"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MapPin,
  Search,
} from "lucide-react";
import {
  Map as PigeonMap,
  Overlay,
  ZoomControl,
} from "pigeon-maps";

type Dealer = {
  id: number;
  name: string;
  address: string;
  mapQuery: string;
};

type Coordinates = [number, number];

type DealerPoint = {
  dealer: Dealer;
  coordinate: Coordinates;
};

type DealerCluster = {
  id: string;
  coordinate: Coordinates;
  dealers: Dealer[];
};

const dealers: Dealer[] = [
  {
    id: 1,
    name: "Laval MOTO Inc",
    address:
      "315 Bd Cartier O, Laval, QC H7N 2J3",
    mapQuery:
      "315 Bd Cartier O, Laval, QC H7N 2J3, Canada",
  },
  {
    id: 2,
    name: "Motos Illimitées",
    address:
      "3250 Bd des Entreprises, Terrebonne, QC J6X 4J8",
    mapQuery:
      "3250 Bd des Entreprises, Terrebonne, QC J6X 4J8, Canada",
  },
  {
    id: 3,
    name: "Valley Moto Sport",
    address:
      "1195 Industrial Rd, West Kelowna, BC V1Z 1G4",
    mapQuery:
      "1195 Industrial Rd, West Kelowna, BC V1Z 1G4, Canada",
  },
  {
    id: 4,
    name: "ADM Sports Quebec",
    address:
      "1884 Boulevard Wilfrid-Hamel, Quebec, QC G1N 3Z2",
    mapQuery:
      "1884 Boulevard Wilfrid-Hamel, Quebec City, QC G1N 3Z2, Canada",
  },
  {
    id: 5,
    name: "ADM Sports Levi's",
    address:
      "625 Rte du Président-Kennedy, Lévis, QC G6C 1K1",
    mapQuery:
      "625 Route du Président-Kennedy, Lévis, QC G6C 1K1, Canada",
  },
  {
    id: 6,
    name: "8-Gear Canada",
    address:
      "50 Biggar Ave, Hamilton, ON L8L 3Z4 Canada",
    mapQuery:
      "50 Biggar Ave, Hamilton, ON L8L 3Z4, Canada",
  },
  {
    id: 7,
    name: "Sceprio Tex",
    address:
      "455 GG, St 22, P4, DHA, Lahore",
    mapQuery:
      "455 GG, Street 22, Phase 4, DHA, Lahore, Pakistan",
  },
  {
    id: 8,
    name: "TripleClamp Moto",
    address:
      "811 Alness St, Toronto, ON M3J 2H8 Canada",
    mapQuery:
      "811 Alness St, North York, ON M3J 2H8, Canada",
  },
  {
    id: 9,
    name: "Holeshot Motorsports",
    address:
      "8867 201 St, Langley Twp, BC V2Y 0C8 Canada",
    mapQuery:
      "8867 201 St, Langley Township, BC V2Y 0C8, Canada",
  },
];

const CACHE_KEY =
  "8gears-dealer-coordinates-v2";

/* =========================================================
   CONVERT LAT/LNG TO MAP PIXELS

   Used only for figuring out which markers are
   visually close enough to become a cluster.
========================================================= */

function latLngToPixel(
  coordinate: Coordinates,
  zoom: number
) {
  const [lat, lng] = coordinate;

  const worldSize =
    256 * Math.pow(2, zoom);

  const x =
    ((lng + 180) / 360) *
    worldSize;

  const sinLatitude = Math.min(
    Math.max(
      Math.sin(
        (lat * Math.PI) / 180
      ),
      -0.9999
    ),
    0.9999
  );

  const y =
    (0.5 -
      Math.log(
        (1 + sinLatitude) /
          (1 - sinLatitude)
      ) /
        (4 * Math.PI)) *
    worldSize;

  return {
    x,
    y,
  };
}

/* =========================================================
   CREATE CLUSTERS

   Low zoom:
      ● 5
      ● 3

   High zoom:
      individual dealer pins
========================================================= */

function createClusters(
  points: DealerPoint[],
  zoom: number
): DealerCluster[] {
  if (points.length === 0) {
    return [];
  }

  /*
   * Larger radius when zoomed far out.
   */
  let clusterRadius = 72;

  if (zoom <= 3) {
    clusterRadius = 125;
  } else if (zoom <= 5) {
    clusterRadius = 100;
  } else if (zoom <= 7) {
    clusterRadius = 82;
  }

  /*
   * At close zoom levels we want all
   * individual pins visible.
   */
  if (zoom >= 11) {
    return points.map(
      ({ dealer, coordinate }) => ({
        id: `dealer-${dealer.id}`,
        coordinate,
        dealers: [dealer],
      })
    );
  }

  const remaining = [...points];

  const clusters: DealerCluster[] =
    [];

  while (remaining.length > 0) {
    const first =
      remaining.shift();

    if (!first) break;

    const firstPixel =
      latLngToPixel(
        first.coordinate,
        zoom
      );

    const grouped: DealerPoint[] = [
      first,
    ];

    /*
     * Find dealers visually close
     * to the first point.
     */
    for (
      let index =
        remaining.length - 1;
      index >= 0;
      index--
    ) {
      const candidate =
        remaining[index];

      const candidatePixel =
        latLngToPixel(
          candidate.coordinate,
          zoom
        );

      const deltaX =
        candidatePixel.x -
        firstPixel.x;

      const deltaY =
        candidatePixel.y -
        firstPixel.y;

      const distance = Math.sqrt(
        deltaX * deltaX +
          deltaY * deltaY
      );

      if (
        distance <= clusterRadius
      ) {
        grouped.push(candidate);

        remaining.splice(
          index,
          1
        );
      }
    }

    /*
     * Center cluster between all dealers.
     */
    const averageLat =
      grouped.reduce(
        (total, item) =>
          total +
          item.coordinate[0],
        0
      ) / grouped.length;

    const averageLng =
      grouped.reduce(
        (total, item) =>
          total +
          item.coordinate[1],
        0
      ) / grouped.length;

    clusters.push({
      id: grouped
        .map(
          (item) =>
            item.dealer.id
        )
        .sort(
          (a, b) => a - b
        )
        .join("-"),

      coordinate: [
        averageLat,
        averageLng,
      ],

      dealers: grouped.map(
        (item) =>
          item.dealer
      ),
    });
  }

  return clusters;
}

export default function DealerLocator() {
  const [
    selectedDealer,
    setSelectedDealer,
  ] = useState<Dealer>(
    dealers[0]
  );

  const [search, setSearch] =
    useState("");

  const [
    dealerCoords,
    setDealerCoords,
  ] = useState<
    Record<
      number,
      Coordinates
    >
  >({});

  const [center, setCenter] =
    useState<Coordinates>([
      45.5601,
      -73.7124,
    ]);

  const [zoom, setZoom] =
    useState(12);

  const [
    locationsLoading,
    setLocationsLoading,
  ] = useState(true);

  /* =========================================================
     FILTER LEFT LIST
  ========================================================= */

  const filteredDealers =
    useMemo(() => {
      const value = search
        .trim()
        .toLowerCase();

      if (!value) {
        return dealers;
      }

      return dealers.filter(
        (dealer) =>
          dealer.name
            .toLowerCase()
            .includes(value) ||
          dealer.address
            .toLowerCase()
            .includes(value)
      );
    }, [search]);

  /* =========================================================
     CREATE DEALER POINTS
  ========================================================= */

  const dealerPoints =
    useMemo<DealerPoint[]>(() => {
      return dealers
        .map((dealer) => {
          const coordinate =
            dealerCoords[
              dealer.id
            ];

          if (!coordinate) {
            return null;
          }

          return {
            dealer,
            coordinate,
          };
        })
        .filter(
          (
            item
          ): item is DealerPoint =>
            item !== null
        );
    }, [dealerCoords]);

  /* =========================================================
     CLUSTER BASED ON CURRENT ZOOM
  ========================================================= */

  const clusters = useMemo(
    () =>
      createClusters(
        dealerPoints,
        zoom
      ),
    [
      dealerPoints,
      zoom,
    ]
  );

  /* =========================================================
     GET COORDINATES

     NO GOOGLE
     NO API KEY

     OpenStreetMap Nominatim
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const sleep = (
      ms: number
    ) =>
      new Promise((resolve) =>
        setTimeout(
          resolve,
          ms
        )
      );

    const loadCoordinates =
      async () => {
        let storedCoordinates: Record<
          number,
          Coordinates
        > = {};

        /* =============================================
           READ LOCAL CACHE
        ============================================= */

        try {
          const saved =
            localStorage.getItem(
              CACHE_KEY
            );

          if (saved) {
            storedCoordinates =
              JSON.parse(saved);

            if (!cancelled) {
              setDealerCoords(
                storedCoordinates
              );
            }
          }
        } catch {
          storedCoordinates =
            {};
        }

        /* =============================================
           ONLY LOOKUP MISSING LOCATIONS
        ============================================= */

        const missingDealers =
          dealers.filter(
            (dealer) =>
              !storedCoordinates[
                dealer.id
              ]
          );

        if (
          missingDealers.length ===
          0
        ) {
          if (!cancelled) {
            setLocationsLoading(
              false
            );
          }

          return;
        }

        /* =============================================
           GET EACH LOCATION
        ============================================= */

        for (
          let index = 0;
          index <
          missingDealers.length;
          index++
        ) {
          if (cancelled) {
            return;
          }

          const dealer =
            missingDealers[index];

          try {
            const params =
              new URLSearchParams({
                q: dealer.mapQuery,
                format: "jsonv2",
                limit: "1",
              });

            const response =
              await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                  headers: {
                    Accept:
                      "application/json",
                  },
                }
              );

            if (
              !response.ok
            ) {
              throw new Error(
                "Location lookup failed"
              );
            }

            const results =
              await response.json();

            if (
              Array.isArray(
                results
              ) &&
              results.length > 0
            ) {
              const lat =
                Number(
                  results[0]
                    .lat
                );

              const lng =
                Number(
                  results[0]
                    .lon
                );

              if (
                Number.isFinite(
                  lat
                ) &&
                Number.isFinite(
                  lng
                )
              ) {
                storedCoordinates =
                  {
                    ...storedCoordinates,

                    [dealer.id]:
                      [
                        lat,
                        lng,
                      ],
                  };

                if (
                  !cancelled
                ) {
                  setDealerCoords(
                    {
                      ...storedCoordinates,
                    }
                  );
                }

                try {
                  localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify(
                      storedCoordinates
                    )
                  );
                } catch {
                  // Ignore storage errors
                }
              }
            }
          } catch (
            error
          ) {
            console.error(
              `Could not locate ${dealer.name}:`,
              error
            );
          }

          /*
           * Small delay between
           * address lookups.
           */
          if (
            index <
            missingDealers.length -
              1
          ) {
            await sleep(
              1100
            );
          }
        }

        if (!cancelled) {
          setLocationsLoading(
            false
          );
        }
      };

    loadCoordinates();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     INITIAL SELECTED DEALER

     Once its coordinate loads,
     position map on it.
  ========================================================= */

  const selectedCoordinate =
    dealerCoords[
      selectedDealer.id
    ];

  useEffect(() => {
    if (
      !selectedCoordinate
    ) {
      return;
    }

    setCenter(
      selectedCoordinate
    );

    setZoom(14);
  }, [
    selectedDealer.id,
    selectedCoordinate?.[0],
    selectedCoordinate?.[1],
  ]);

  /* =========================================================
     CLICK DEALER IN LEFT LIST
  ========================================================= */

  const handleDealerClick = (
    dealer: Dealer
  ) => {
    setSelectedDealer(
      dealer
    );

    const coordinate =
      dealerCoords[
        dealer.id
      ];

    if (!coordinate) {
      return;
    }

    setCenter(
      coordinate
    );

    setZoom(14);
  };

  /* =========================================================
     CLICK INDIVIDUAL MAP PIN
  ========================================================= */

  const handlePinClick = (
    dealer: Dealer
  ) => {
    setSelectedDealer(
      dealer
    );

    const coordinate =
      dealerCoords[
        dealer.id
      ];

    if (!coordinate) {
      return;
    }

    setCenter(
      coordinate
    );

    /*
     * Don't force zoom if already close.
     */
    if (zoom < 13) {
      setZoom(13);
    }
  };

  /* =========================================================
     CLICK CLUSTER

     Move to cluster + zoom in.
  ========================================================= */

  const handleClusterClick = (
    cluster: DealerCluster
  ) => {
    setCenter(
      cluster.coordinate
    );

    setZoom((current) =>
      Math.min(
        current + 2,
        18
      )
    );
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-[20px] py-[60px] sm:px-[35px] lg:px-[60px] lg:py-[90px]">
        <div className="grid grid-cols-1 lg:grid-cols-[41%_59%]">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="flex min-h-0 flex-col bg-white lg:h-[790px] lg:pr-[30px]">
            {/* =============================================
                SEARCH
            ============================================= */}

            <div className="pb-[20px] lg:pb-[26px]">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Address..."
                  className="h-[60px] w-full rounded-[14px] border-0 bg-[#eeeeee] px-[20px] pr-[58px] font-[var(--font-sf-pro)] text-[16px] font-normal text-black outline-none placeholder:text-[#7c7c7c] sm:h-[62px] sm:text-[17px]"
                />

                <Search
                  size={25}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2 text-black"
                />
              </div>
            </div>

            {/* =============================================
                DEALER LIST
            ============================================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                lg:pr-[18px]

                [scrollbar-color:#000_#efefef]
                [scrollbar-width:thin]

                [&::-webkit-scrollbar]:w-[9px]

                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#efefef]

                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-black

                max-lg:max-h-[550px]
              "
            >
              {filteredDealers.length >
              0 ? (
                filteredDealers.map(
                  (dealer) => {
                    const active =
                      selectedDealer.id ===
                      dealer.id;

                    return (
                      <button
                        key={
                          dealer.id
                        }
                        type="button"
                        onClick={() =>
                          handleDealerClick(
                            dealer
                          )
                        }
                        className={`
                          group
                          flex
                          w-full
                          items-start
                          gap-[20px]
                          border-b
                          border-[#eeeeee]
                          px-[6px]
                          py-[30px]
                          text-left
                          transition-all
                          duration-200

                          hover:bg-[#f7f7f7]

                          sm:px-[8px]
                          lg:py-[34px]

                          ${
                            active
                              ? "bg-[#f7f7f7]"
                              : "bg-white"
                          }
                        `}
                      >
                        <div className="pt-[1px]">
                          <MapPin
                            size={
                              29
                            }
                            strokeWidth={
                              2.2
                            }
                            className={
                              active
                                ? "text-black"
                                : "text-[#777777]"
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-[var(--font-sf-pro)] text-[21px] font-semibold leading-[1.15] text-black sm:text-[24px]">
                            {
                              dealer.name
                            }
                          </h3>

                          <p className="mt-[14px] max-w-[470px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.32] text-[#7a7a7a] sm:text-[18px]">
                            {
                              dealer.address
                            }
                          </p>
                        </div>
                      </button>
                    );
                  }
                )
              ) : (
                <div className="flex h-[180px] items-center justify-center px-[20px] text-center">
                  <p className="font-[var(--font-sf-pro)] text-[16px] text-[#777777]">
                    No dealers
                    found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              MAP
          ================================================= */}

          <div className="relative mt-[32px] h-[500px] w-full overflow-hidden bg-[#e7edef] lg:mt-0 lg:h-[790px]">
            <PigeonMap
              center={center}
              zoom={zoom}
              minZoom={2}
              maxZoom={18}
              animate
              metaWheelZoom={
                false
              }
              attribution={
                <span className="font-[var(--font-sf-pro)] text-[10px]">
                  © OpenStreetMap
                  contributors
                </span>
              }
              onBoundsChanged={({
                center:
                  newCenter,
                zoom: newZoom,
              }) => {
                setCenter(
                  newCenter as Coordinates
                );

                setZoom(
                  newZoom
                );
              }}
            >
              <ZoomControl />

              {/* ===========================================
                  CUSTOM CLUSTERS + PINS

                  No Marker component.

                  Overlay lets us make the exact
                  Tailwind design we want.
              =========================================== */}

              {clusters.map(
                (cluster) => {
                  const isCluster =
                    cluster
                      .dealers
                      .length > 1;

                  /* =======================================
                     BLACK NUMBER CLUSTER
                  ======================================= */

                  if (
                    isCluster
                  ) {
                    return (
                      <Overlay
                        key={`cluster-${cluster.id}`}
                        anchor={
                          cluster.coordinate
                        }
                        offset={[
                          34,
                          34,
                        ]}
                      >
                        <button
                          type="button"
                          aria-label={`Zoom into ${cluster.dealers.length} dealers`}
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            handleClusterClick(
                              cluster
                            );
                          }}
                          className="
                            group
                            relative
                            flex
                            h-[68px]
                            w-[68px]
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-full
                            border-[7px]
                            border-black/20
                            bg-[#2b2b2b]
                            font-[var(--font-sf-pro)]
                            text-[18px]
                            font-semibold
                            text-white
                            shadow-[0_5px_18px_rgba(0,0,0,0.20)]
                            transition-all
                            duration-200

                            hover:scale-110
                            hover:bg-black
                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.28)]

                            active:scale-95
                          "
                        >
                          {
                            cluster
                              .dealers
                              .length
                          }
                        </button>
                      </Overlay>
                    );
                  }

                  /* =======================================
                     INDIVIDUAL DEALER PIN
                  ======================================= */

                  const dealer =
                    cluster
                      .dealers[0];

                  const active =
                    selectedDealer.id ===
                    dealer.id;

                  return (
                    <Overlay
                      key={`dealer-${dealer.id}`}
                      anchor={
                        cluster.coordinate
                      }
                      offset={[
                        25,
                        54,
                      ]}
                    >
                      <button
                        type="button"
                        aria-label={
                          dealer.name
                        }
                        title={
                          dealer.name
                        }
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          handlePinClick(
                            dealer
                          );
                        }}
                        className="
                          group
                          relative
                          h-[54px]
                          w-[50px]
                          cursor-pointer
                          border-0
                          bg-transparent
                          p-0
                          outline-none
                        "
                      >
                        {/* MARKER SHADOW */}

                        <span
                          className="
                            absolute
                            bottom-[1px]
                            left-1/2
                            h-[8px]
                            w-[24px]
                            -translate-x-1/2
                            rounded-full
                            bg-black/20
                            blur-[4px]
                          "
                        />

                        {/* TEARDROP */}

                        <span
                          className={`
                            absolute
                            left-1/2
                            top-0
                            flex
                            h-[44px]
                            w-[44px]
                            -translate-x-1/2
                            rotate-[-45deg]
                            items-center
                            justify-center

                            rounded-[50%_50%_50%_7px]

                            bg-black

                            shadow-[0_5px_15px_rgba(0,0,0,0.28)]

                            transition-all
                            duration-200

                            group-hover:scale-110
                            group-hover:shadow-[0_8px_22px_rgba(0,0,0,0.35)]

                            ${
                              active
                                ? "ring-[5px] ring-black/15"
                                : ""
                            }
                          `}
                        >
                          {/* WHITE INNER LOGO AREA */}

                          <span
                            className="
                              flex
                              h-[23px]
                              w-[23px]
                              rotate-[45deg]
                              items-center
                              justify-center
                              rounded-[7px]
                              bg-white
                              font-[var(--font-sf-pro)]
                              text-[14px]
                              font-black
                              leading-none
                              text-black
                            "
                          >
                            8
                          </span>
                        </span>
                      </button>
                    </Overlay>
                  );
                }
              )}
            </PigeonMap>

            {/* =================================================
                SELECTED DEALER BADGE
            ================================================= */}

            <div className="pointer-events-none absolute left-[18px] top-[18px] z-20 hidden max-w-[290px] rounded-[10px] bg-white/95 px-[16px] py-[13px] shadow-[0_4px_18px_rgba(0,0,0,0.14)] backdrop-blur-md sm:block">
              <div className="flex items-start gap-[10px]">
                <div className="mt-[2px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <MapPin
                    size={16}
                    strokeWidth={
                      2
                    }
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-[var(--font-sf-pro)] text-[15px] font-semibold leading-tight text-black">
                    {
                      selectedDealer.name
                    }
                  </p>

                  <p className="mt-[5px] font-[var(--font-sf-pro)] text-[11px] font-normal leading-[1.35] text-[#666666]">
                    {
                      selectedDealer.address
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                ZOOM LEVEL DEBUG
                REMOVE IF YOU DON'T WANT IT
            ================================================= */}

            <div className="pointer-events-none absolute bottom-[18px] left-[18px] z-20 rounded-full bg-black/80 px-[12px] py-[7px] font-[var(--font-sf-pro)] text-[10px] font-medium text-white backdrop-blur-md">
              Zoom{" "}
              {Math.round(
                zoom * 10
              ) / 10}
            </div>

            {/* =================================================
                INITIAL LOCATION LOADER
            ================================================= */}

            {locationsLoading &&
              dealerPoints.length ===
                0 && (
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[#edf1f2]/80 backdrop-blur-[2px]">
                  <div className="flex items-center gap-[11px] rounded-full bg-white px-[18px] py-[11px] shadow-[0_5px_22px_rgba(0,0,0,0.12)]">
                    <div className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-black/20 border-t-black" />

                    <span className="whitespace-nowrap font-[var(--font-sf-pro)] text-[12px] font-medium text-black">
                      Locating
                      dealers...
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
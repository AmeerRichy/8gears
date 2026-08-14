"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";

type Dealer = {
  id: number;
  name: string;
  address: string;
  mapQuery: string;
};

const dealers: Dealer[] = [
  {
    id: 1,
    name: "Laval MOTO Inc",
    address: "315 Bd Cartier O, Laval, QC H7N 2J3",
    mapQuery: "315 Bd Cartier O, Laval, QC H7N 2J3, Canada",
  },
  {
    id: 2,
    name: "Motos Illimitées",
    address: "3250 Bd des Entreprises, Terrebonne, QC J6X 4J8",
    mapQuery:
      "3250 Bd des Entreprises, Terrebonne, QC J6X 4J8, Canada",
  },
  {
    id: 3,
    name: "Valley Moto Sport",
    address: "195 Industrial Rd, West Kelowna, BC V1Z 1G4",
    mapQuery:
      "195 Industrial Rd, West Kelowna, BC V1Z 1G4, Canada",
  },
  {
    id: 4,
    name: "ADM Sports Quebec",
    address:
      "1884, boulevard Wilfred Hamel, Quebec QC Canada, G1N 3Z2",
    mapQuery:
      "1884 Boulevard Wilfrid-Hamel, Quebec City, QC G1N 3Z2, Canada",
  },
  {
    id: 5,
    name: "ADM Sports Levi's",
    address:
      "625 Rte du Presidente, Kennedy Pintendre, QC Canada, G6C-1K1",
    mapQuery:
      "625 Route du Président-Kennedy, Lévis, QC G6C 1K1, Canada",
  },
  {
    id: 6,
    name: "8-Gear Canada",
    address: "50 Biggar Ave, Hamilton, ON, L8L 3Z4 Canada",
    mapQuery:
      "50 Biggar Ave, Hamilton, ON L8L 3Z4, Canada",
  },
  {
    id: 7,
    name: "Sceprio Tex",
    address: "455 GG, St 22, P4, DHA, Lhr",
    mapQuery:
      "455 GG, Street 22, Phase 4, DHA, Lahore, Pakistan",
  },
  {
    id: 8,
    name: "TripleClamp Moto",
    address: "811 Alness St, Toronto, ON M3J 2H8 Canada",
    mapQuery:
      "811 Alness St, Toronto, ON M3J 2H8, Canada",
  },
  {
    id: 9,
    name: "Holeshot Motorsports",
    address: "8867 201 St, Langley Twp, BC V2Y 0C8 Canada",
    mapQuery:
      "8867 201 St, Langley Township, BC V2Y 0C8, Canada",
  },
];

export default function DealerLocator() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer>(dealers[0]);
  const [search, setSearch] = useState("");

  const filteredDealers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return dealers;

    return dealers.filter((dealer) => {
      return (
        dealer.name.toLowerCase().includes(value) ||
        dealer.address.toLowerCase().includes(value)
      );
    });
  }, [search]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    selectedDealer.mapQuery
  )}&z=14&output=embed`;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1920px] px-[24px] py-[70px] sm:px-[40px] lg:px-[65px] lg:py-[90px] xl:px-[70px]">
        <div className="grid grid-cols-1 overflow-hidden bg-white lg:grid-cols-[39%_61%]">
          {/* LEFT SIDE */}
          <div className="flex min-h-0 flex-col border-[#eeeeee] lg:h-[790px] lg:border-r">
            {/* SEARCH */}
            <div className="px-0 pb-[26px] lg:pr-[38px]">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Address..."
                  className="h-[60px] w-full rounded-[14px] border-none bg-[#eeeeee] px-[20px] pr-[58px] font-[var(--font-sf-pro)] text-[16px] font-normal text-black outline-none placeholder:text-[#7c7c7c] sm:h-[62px] sm:text-[17px]"
                />

                <Search
                  size={25}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2 text-black"
                />
              </div>
            </div>

            {/* DEALERS */}
            <div className="dealer-scroll min-h-0 flex-1 overflow-y-auto lg:pr-[18px]">
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer) => {
                  const active = selectedDealer.id === dealer.id;

                  return (
                    <button
                      key={dealer.id}
                      type="button"
                      onClick={() => setSelectedDealer(dealer)}
                      className={`group flex w-full items-start gap-[20px] border-b border-[#eeeeee] px-[6px] py-[30px] text-left transition-colors duration-200 hover:bg-[#fafafa] sm:px-[8px] lg:py-[34px] ${
                        active ? "bg-[#fafafa]" : "bg-white"
                      }`}
                    >
                      <div className="pt-[1px]">
                        <MapPin
                          size={29}
                          strokeWidth={2.2}
                          className="text-black"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-[var(--font-sf-pro)] text-[21px] font-semibold leading-[1.15] text-black sm:text-[24px]">
                          {dealer.name}
                        </h3>

                        <p className="mt-[14px] max-w-[470px] font-[var(--font-sf-pro)] text-[16px] font-normal leading-[1.32] text-[#7a7a7a] sm:text-[18px]">
                          {dealer.address}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex h-[180px] items-center justify-center px-[20px] text-center">
                  <p className="font-[var(--font-sf-pro)] text-[16px] text-[#777]">
                    No dealers found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT MAP */}
          <div className="relative mt-[32px] h-[500px] w-full overflow-hidden bg-[#efefef] lg:mt-0 lg:h-[790px]">
            <iframe
              key={selectedDealer.id}
              src={mapSrc}
              title={`${selectedDealer.name} map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />

            {/* Dealer badge */}
            <div className="pointer-events-none absolute left-[18px] top-[18px] z-10 hidden max-w-[280px] rounded-[4px] bg-white px-[15px] py-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.18)] sm:block">
              <p className="font-[var(--font-sf-pro)] text-[15px] font-semibold leading-tight text-black">
                {selectedDealer.name}
              </p>

              <p className="mt-[5px] font-[var(--font-sf-pro)] text-[11px] font-normal leading-[1.25] text-[#333]">
                {selectedDealer.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dealer-scroll {
          scrollbar-width: thin;
          scrollbar-color: #000000 #efefef;
        }

        .dealer-scroll::-webkit-scrollbar {
          width: 9px;
        }

        .dealer-scroll::-webkit-scrollbar-track {
          background: #efefef;
          border-radius: 999px;
        }

        .dealer-scroll::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 999px;
        }

        @media (max-width: 1023px) {
          .dealer-scroll {
            max-height: 550px;
          }
        }
      `}</style>
    </section>
  );
}
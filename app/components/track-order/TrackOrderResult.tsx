"use client";

import {
  Bike,
  Box,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type OrderStatus =
  | "pending_payment"
  | "order_received"
  | "payment_confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"
  | string;

type TrackingStep = {
  status: OrderStatus;
  message?: string;
  timestamp?: string;
  updatedBy?: "system" | "admin";
};

type OrderItem = {
  title: string;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
};

type ShippingAddress = {
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type ShippingDetails = {
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

export type TrackedOrder = {
  orderId?: string;
  trackingId?: string;
  orderStatus: OrderStatus;
  paymentStatus?: string;

  customer?: {
    name?: string;
  };

  shippingAddress?: ShippingAddress;

  shipping?: ShippingDetails;

  amounts: {
    subtotal?: number;
    shippingAmount?: number;
    totalAmount: number;
    currency: string;
  };

  trackingTimeline?: TrackingStep[];
  items?: OrderItem[];
  createdAt?: string;
};

type TrackOrderResultProps = {
  order: TrackedOrder;
};

type StatusDesign = {
  label: string;
  description: string;
  icon: LucideIcon;
};

const statusDesigns: Record<string, StatusDesign> = {
  pending_payment: {
    label: "Pending Payment",
    description: "Your order is waiting for payment confirmation.",
    icon: Clock3,
  },

  order_received: {
    label: "Order Received",
    description: "Your order has been received successfully.",
    icon: Package,
  },

  payment_confirmed: {
    label: "Payment Confirmed",
    description: "Your payment has been confirmed successfully.",
    icon: ShieldCheck,
  },

  processing: {
    label: "Processing",
    description: "Your order is being prepared for shipment.",
    icon: Settings2,
  },

  packed: {
    label: "Packed",
    description: "Your order has been packed and is ready to ship.",
    icon: Box,
  },

  shipped: {
    label: "Shipped",
    description: "Your package has left our warehouse.",
    icon: Truck,
  },

  out_for_delivery: {
    label: "Out for Delivery",
    description: "Your package is on its way to your address.",
    icon: Bike,
  },

  delivered: {
    label: "Delivered",
    description: "Your package has been delivered successfully.",
    icon: CheckCircle2,
  },

  cancelled: {
    label: "Cancelled",
    description: "This order has been cancelled.",
    icon: XCircle,
  },

  refunded: {
    label: "Refunded",
    description: "The payment for this order has been refunded.",
    icon: RotateCcw,
  },
};

const progressPercentages: Record<string, number> = {
  pending_payment: 5,
  order_received: 16,
  payment_confirmed: 28,
  processing: 42,
  packed: 56,
  shipped: 72,
  out_for_delivery: 88,
  delivered: 100,
  cancelled: 0,
  refunded: 0,
};

function normalizeStatus(status: string) {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function getStatusDesign(status: string): StatusDesign {
  const normalizedStatus = normalizeStatus(status);

  return (
    statusDesigns[normalizedStatus] || {
      label: normalizedStatus
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()),

      description: "Your order status has been updated.",

      icon: Clock3,
    }
  );
}

function getProgressPercentage(status: string) {
  return progressPercentages[normalizeStatus(status)] ?? 10;
}

function isNegativeStatus(status: string) {
  const normalizedStatus = normalizeStatus(status);

  return (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "refunded"
  );
}

function getTimestampMilliseconds(timestamp?: string) {
  if (!timestamp) return 0;

  const milliseconds = new Date(timestamp).getTime();

  return Number.isNaN(milliseconds) ? 0 : milliseconds;
}

function getVisibleTimeline(order: TrackedOrder): TrackingStep[] {
  const sortedTimeline = [...(order.trackingTimeline || [])]
    .filter((step) => Boolean(step.status))
    .sort(
      (firstStep, secondStep) =>
        getTimestampMilliseconds(firstStep.timestamp) -
        getTimestampMilliseconds(secondStep.timestamp)
    );

  const cleanedTimeline: TrackingStep[] = [];

  sortedTimeline.forEach((step) => {
    const previousStep = cleanedTimeline[cleanedTimeline.length - 1];

    if (
      previousStep &&
      normalizeStatus(previousStep.status) ===
        normalizeStatus(step.status)
    ) {
      cleanedTimeline[cleanedTimeline.length - 1] = step;
      return;
    }

    cleanedTimeline.push(step);
  });

  if (cleanedTimeline.length > 0) {
    return cleanedTimeline;
  }

  return [
    {
      status: order.orderStatus,
      message: getStatusDesign(order.orderStatus).description,
      timestamp: order.createdAt,
    },
  ];
}

function formatMoney(currency: string, amount: number) {
  if (/^[A-Za-z]{3}$/.test(currency)) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  }

  return `${currency}${amount.toFixed(2)}`;
}

function formatTimelineDate(timestamp?: string) {
  if (!timestamp) return "-";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatLastUpdatedTime(timestamp?: string) {
  if (!timestamp) return "-";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function getAddressLines(address?: ShippingAddress) {
  if (!address) return [];

  const cityLine = [address.city, address.state, address.zip]
    .filter(Boolean)
    .join(", ");

  return [
    address.address,
    address.apartment,
    cityLine,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

function TimelineStatusIcon({
  status,
  isCurrent,
}: {
  status: string;
  isCurrent: boolean;
}) {
  const design = getStatusDesign(status);
  const Icon = design.icon;
  const hasNegativeStatus = isNegativeStatus(status);

  return (
    <div
      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
        hasNegativeStatus
          ? "bg-[#9f3218]"
          : isCurrent
            ? "bg-black"
            : "bg-[#222222]"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.7}
        className="text-white"
      />
    </div>
  );
}

export default function TrackOrderResult({
  order,
}: TrackOrderResultProps) {
  const timeline = getVisibleTimeline(order);
  const items = order.items || [];

  const currentTimelineIndex = timeline.length - 1;
  const latestTimelineStep = timeline[currentTimelineIndex];

  const latestTimestamp =
    latestTimelineStep?.timestamp || order.createdAt;

  const addressLines = getAddressLines(order.shippingAddress);

  const hasCourierDetails =
    Boolean(order.shipping?.courierName) ||
    Boolean(order.shipping?.trackingNumber);

  const hasNegativeCurrentStatus = isNegativeStatus(
    order.orderStatus
  );

  return (
    <section className="mt-8 animate-[fadeUp_450ms_ease-out] sm:mt-9">
      {/* ORDER STATUS */}
      <div className="rounded-[30px] border border-white/60 bg-[#F0EFEF]/30 px-5 py-5 shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[20px] sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[16px] font-semibold tracking-[0.015em] text-[#111111]">
            Order Status
          </h2>

          <span
            className={`shrink-0 rounded-full px-4 py-2 text-[9px] font-medium leading-none sm:px-5 sm:text-[10px] ${
              hasNegativeCurrentStatus
                ? "bg-[#9f3218] text-white"
                : "bg-black text-white"
            }`}
          >
            {getStatusDesign(order.orderStatus).label}
          </span>
        </div>

        <div className="mt-6 h-[7px] overflow-hidden rounded-full bg-white/45">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              hasNegativeCurrentStatus
                ? "bg-[#9f3218]"
                : "bg-black"
            }`}
            style={{
              width: `${getProgressPercentage(order.orderStatus)}%`,
            }}
          />
        </div>

        <div className="mt-6 flex items-center gap-2 text-[#aaaaaa]">
          <Clock3 size={14} strokeWidth={1.5} />

          <p className="text-[11px] font-normal tracking-[0.035em]">
            Last Updated: {formatLastUpdatedTime(latestTimestamp)}
          </p>
        </div>
      </div>

      {/* REAL SAVED TRACKING HISTORY ONLY */}
      <div className="mt-6 rounded-[30px] border border-white/60 bg-[#F0EFEF]/30 px-5 py-6 shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[20px] sm:px-6">
        <h3 className="text-[16px] font-semibold tracking-[0.015em] text-[#111111]">
          Tracking Timeline
        </h3>

        <div className="relative mt-6">
          {timeline.length > 1 && (
            <div
              className={`absolute bottom-[20px] left-[19px] top-[20px] w-[2px] ${
                hasNegativeCurrentStatus
                  ? "bg-[#9f3218]/40"
                  : "bg-black"
              }`}
            />
          )}

          <div className="space-y-[22px]">
            {timeline.map((step, index) => {
              const isCurrent = index === currentTimelineIndex;
              const design = getStatusDesign(step.status);

              return (
                <div
                  key={`${step.status}-${step.timestamp || index}`}
                  className="relative flex min-h-[56px] items-start gap-4"
                >
                  <TimelineStatusIcon
                    status={step.status}
                    isCurrent={isCurrent}
                  />

                  <div className="min-w-0 flex-1 pt-[1px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[14px] font-semibold tracking-[0.02em] text-[#111111]">
                        {design.label}
                      </h4>

                      {isCurrent ? (
                        <span
                          className={`rounded-full px-3 py-1 text-[9px] font-medium leading-none ${
                            isNegativeStatus(step.status)
                              ? "bg-[#9f3218]/10 text-[#9f3218]"
                              : "bg-white/65 text-[#333333]"
                          }`}
                        >
                          Current
                        </span>
                      ) : (
                        <CheckCircle2
                          size={15}
                          strokeWidth={2}
                          className="text-[#20c768]"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-[11px] font-normal leading-4 tracking-[0.01em] text-[#aaaaaa]">
                      {step.message || design.description}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5 text-[#aaaaaa]">
                      <Clock3 size={12} strokeWidth={1.4} />

                      <span className="text-[10px] font-normal tracking-[0.015em]">
                        {formatTimelineDate(step.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ORDER DETAILS */}
      <div className="mt-6 rounded-[30px] border border-white/60 bg-[#F0EFEF]/30 px-5 py-6 shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[20px] sm:px-6">
        <h3 className="text-[16px] font-semibold tracking-[0.015em] text-[#111111]">
          Order Details
        </h3>

        <div className="mt-5 space-y-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-[51px] w-[51px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-white/55 sm:h-[53px] sm:w-[53px]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package
                        size={20}
                        strokeWidth={1.5}
                        className="text-[#999999]"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold tracking-[0.01em] text-[#111111] sm:text-[14px]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] font-normal text-[#555555]">
                      {[item.color, item.size]
                        .filter(Boolean)
                        .join(" / ") || "Standard variant"}
                    </p>

                    <p className="mt-1 text-[11px] font-normal text-[#333333]">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-[16px] font-semibold tracking-[-0.01em] text-[#111111] sm:text-[18px]">
                  {formatMoney(
                    order.amounts.currency,
                    item.lineTotal ??
                      item.unitPrice * item.quantity
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[12px] font-normal text-[#aaaaaa]">
              No order items are available.
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-white/75 pt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] font-semibold text-[#111111]">
              Total
            </p>

            <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#111111] sm:text-[19px]">
              {formatMoney(
                order.amounts.currency,
                order.amounts.totalAmount
              )}
            </p>
          </div>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="mt-6 rounded-[30px] border border-white/60 bg-[#F0EFEF]/30 px-5 py-6 shadow-[0_14px_42px_rgba(0,0,0,0.045)] backdrop-blur-[20px] sm:px-6">
        <h3 className="text-[16px] font-semibold tracking-[0.015em] text-[#111111]">
          Shipping Address
        </h3>

        <div className="mt-5 flex items-start gap-3">
          <MapPin
            size={17}
            strokeWidth={1.7}
            className="mt-[1px] shrink-0 text-[#555555]"
          />

          {addressLines.length > 0 ? (
            <div>
              <p className="text-[13px] font-semibold text-[#222222]">
                {order.customer?.name || "Customer"}
              </p>

              <div className="mt-1 space-y-[2px]">
                {addressLines.map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className="text-[11px] font-normal leading-4 text-[#aaaaaa]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[12px] font-normal leading-5 text-[#aaaaaa]">
              Shipping address details are unavailable.
            </p>
          )}
        </div>

        {hasCourierDetails && (
          <div className="mt-5 border-t border-white/75 pt-5">
            <p className="text-[13px] font-semibold text-[#222222]">
              Courier Details
            </p>

            {order.shipping?.courierName && (
              <p className="mt-2 text-[11px] font-normal text-[#777777]">
                Courier: {order.shipping.courierName}
              </p>
            )}

            {order.shipping?.trackingNumber && (
              <p className="mt-1 text-[11px] font-normal text-[#777777]">
                Tracking Number: {order.shipping.trackingNumber}
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
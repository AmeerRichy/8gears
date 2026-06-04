"use client";

import {
  AlertCircle,
  Box,
  CheckCircle,
  Clock,
  Package,
  ShieldCheck,
  Truck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

type OrderStatus =
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
  message: string;
  timestamp: string;
};

type OrderItem = {
  title: string;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
};

export type TrackedOrder = {
  trackingId?: string;
  orderStatus: OrderStatus;
  amounts: {
    currency: string;
    totalAmount: number;
  };
  trackingTimeline: TrackingStep[];
  items: OrderItem[];
};

type TrackOrderResultProps = {
  order: TrackedOrder;
};

type StatusDesign = {
  icon: LucideIcon;
  iconClassName: string;
  backgroundClassName: string;
};

const statusDesigns: Record<string, StatusDesign> = {
  order_received: {
    icon: Clock,
    iconClassName: "text-[#3b82f6]",
    backgroundClassName: "bg-[#eaf2ff]",
  },
  payment_confirmed: {
    icon: ShieldCheck,
    iconClassName: "text-[#16a66b]",
    backgroundClassName: "bg-[#e8f8f0]",
  },
  processing: {
    icon: Package,
    iconClassName: "text-[#8b5cf6]",
    backgroundClassName: "bg-[#f1ebff]",
  },
  packed: {
    icon: Box,
    iconClassName: "text-[#5865d8]",
    backgroundClassName: "bg-[#ebedff]",
  },
  shipped: {
    icon: Truck,
    iconClassName: "text-[#f36b2b]",
    backgroundClassName: "bg-[#fff0e8]",
  },
  out_for_delivery: {
    icon: UserCheck,
    iconClassName: "text-[#e49a16]",
    backgroundClassName: "bg-[#fff7df]",
  },
  delivered: {
    icon: CheckCircle,
    iconClassName: "text-[#16a66b]",
    backgroundClassName: "bg-[#e8f8f0]",
  },
  cancelled: {
    icon: AlertCircle,
    iconClassName: "text-[#e05252]",
    backgroundClassName: "bg-[#ffecec]",
  },
  refunded: {
    icon: AlertCircle,
    iconClassName: "text-[#7b8799]",
    backgroundClassName: "bg-[#edf0f4]",
  },
};

const fallbackStatusDesign: StatusDesign = {
  icon: Clock,
  iconClassName: "text-[#7b8799]",
  backgroundClassName: "bg-[#edf0f4]",
};

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function StatusIcon({
  status,
  size = 21,
}: {
  status: string;
  size?: number;
}) {
  const design = statusDesigns[status] || fallbackStatusDesign;
  const Icon = design.icon;

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${design.backgroundClassName}`}
    >
      <Icon size={size} strokeWidth={2.1} className={design.iconClassName} />
    </div>
  );
}

export default function TrackOrderResult({ order }: TrackOrderResultProps) {
  const reversedTimeline = [...order.trackingTimeline].reverse();

  return (
    <section className="mt-10 animate-[fadeUp_550ms_ease-out]">
      <div className="grid gap-5 md:grid-cols-[1fr_250px]">
        <div className="rounded-[26px] border border-[#e8edf4] bg-white p-6 shadow-[0_16px_45px_rgba(23,38,71,0.06)] sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9aa5b5]">
            Current Status
          </p>

          <div className="mt-4 flex items-center gap-4">
            <StatusIcon status={order.orderStatus} size={22} />

            <h2 className="text-[22px] font-black capitalize leading-tight tracking-[-0.6px] text-[#0c172f] sm:text-[28px]">
              {formatStatus(order.orderStatus)}
            </h2>
          </div>
        </div>

        <div className="rounded-[26px] border border-[#e8edf4] bg-white p-6 shadow-[0_16px_45px_rgba(23,38,71,0.06)] sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9aa5b5]">
            Order Amount
          </p>

          <p className="mt-5 text-[25px] font-black tracking-[-1px] text-[#0c172f]">
            {order.amounts.currency} {order.amounts.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-[#e8edf4] bg-white p-6 shadow-[0_16px_45px_rgba(23,38,71,0.06)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-7 w-[4px] rounded-full bg-[#f36b2b]" />

          <h3 className="text-[18px] font-black tracking-[-0.4px] text-[#0c172f]">
            Tracking Timeline
          </h3>
        </div>

        <div className="relative mt-8 space-y-8">
          <div className="absolute bottom-5 left-[21px] top-5 w-px bg-[#e4e9f0]" />

          {reversedTimeline.map((step, index) => (
            <div
              key={`${step.status}-${step.timestamp}-${index}`}
              className="relative flex gap-4"
            >
              <div className="relative z-10">
                <StatusIcon status={step.status} size={19} />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <h4
                    className={`text-[14px] font-black capitalize tracking-[-0.1px] ${
                      index === 0 ? "text-[#0c172f]" : "text-[#687488]"
                    }`}
                  >
                    {formatStatus(step.status)}
                  </h4>

                  <span className="shrink-0 text-[10px] font-semibold text-[#a0a9b7]">
                    {new Date(step.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#8b96a6]">
                  {step.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[26px] bg-[#0c172f] p-6 shadow-[0_18px_45px_rgba(12,23,47,0.16)] sm:p-8">
        <div className="flex items-center gap-3">
          <Package size={20} strokeWidth={2.2} className="text-[#f36b2b]" />

          <h3 className="text-[17px] font-black tracking-[-0.3px] text-white">
            Package Contents
          </h3>
        </div>

        <div className="mt-6 divide-y divide-white/10">
          {order.items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-white/10">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Box
                      size={21}
                      strokeWidth={1.8}
                      className="text-white/50"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    {[item.color, item.size].filter(Boolean).join(" / ") ||
                      "Standard variant"}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[11px] font-bold text-[#f58b55]">
                  ×{item.quantity}
                </p>

                <p className="mt-1 text-[13px] font-bold text-white">
                  {order.amounts.currency} {item.unitPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
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
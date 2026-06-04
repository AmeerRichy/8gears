import {
  MessageCircle,
  Package,
  Phone,
  Truck,
  type LucideIcon,
} from "lucide-react";

type ContactItem = {
  title: string;
  subtitle?: string;
  linkText: string;
  href: string;
  icon: LucideIcon;
};

const contactItems: ContactItem[] = [
  {
    title: "CUSTOMER CARE",
    subtitle: "MON-SAT (10 AM - 7 PM)",
    linkText: "CALL NOW",
    href: "tel:+920000000000",
    icon: Phone,
  },
  {
    title: "WHATSAPP",
    linkText: "CHAT NOW",
    href: "https://wa.me/920000000000",
    icon: MessageCircle,
  },
  {
    title: "RETURN & EXCHANGE",
    linkText: "INITIATE",
    href: "/returns",
    icon: Package,
  },
  {
    title: "TRACK YOUR ORDER",
    linkText: "TRACK NOW",
    href: "/track-order",
    icon: Truck,
  },
];

export default function ContactSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid min-h-[302px] w-full grid-cols-1 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-24 lg:py-[78px]">
        {contactItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={[
                "relative flex min-h-[155px] flex-col items-center justify-start px-5 text-center",
                "sm:min-h-[170px] sm:px-8",
                "lg:min-h-[126px] lg:px-10",
                index !== contactItems.length - 1
                  ? "border-b border-[#e7e7e7] pb-10 sm:border-b-0 sm:pb-0 lg:border-r"
                  : "",
                index === 1
                  ? "pt-10 sm:pt-0 sm:border-l sm:border-[#e7e7e7] lg:border-l-0"
                  : "",
                index === 2
                  ? "pt-10 sm:border-t sm:border-[#e7e7e7] lg:border-t-0 lg:pt-0"
                  : "",
                index === 3
                  ? "pt-10 sm:border-l sm:border-t sm:border-[#e7e7e7] lg:border-l-0 lg:border-t-0 lg:pt-0"
                  : "",
              ].join(" ")}
            >
              <Icon
                strokeWidth={2.4}
                className="mb-[15px] h-[27px] w-[27px] text-black"
              />

              <h3 className="text-[15px] font-bold tracking-[2px] text-black">
                {item.title}
              </h3>

              {item.subtitle && (
                <p className="mt-[6px] text-[10px] font-medium tracking-[0.4px] text-[#858585]">
                  {item.subtitle}
                </p>
              )}

              <a
                href={item.href}
                className={`text-[12px] font-semibold text-black underline decoration-[1px] underline-offset-[3px] transition-opacity hover:opacity-60 ${
                  item.subtitle ? "mt-[11px]" : "mt-[13px]"
                }`}
              >
                {item.linkText}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
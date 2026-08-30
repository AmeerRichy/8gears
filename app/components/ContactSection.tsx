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
    linkText: "SEE DETAILS",
    href: "/return-policy",
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
      <div className="mx-auto grid w-full grid-cols-2 px-4 py-7 sm:px-8 sm:py-10 lg:grid-cols-4 lg:px-24 lg:py-[78px]">
        {contactItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={[
                "relative flex min-h-[120px] flex-col items-center justify-center px-3 py-5 text-center",
                "sm:min-h-[140px] sm:px-6",
                "lg:min-h-[126px] lg:px-10 lg:py-0",

                // Mobile / tablet 2x2 borders
                index === 0
                  ? "border-b border-r border-[#e7e7e7] lg:border-b-0"
                  : "",
                index === 1
                  ? "border-b border-[#e7e7e7] lg:border-b-0 lg:border-r"
                  : "",
                index === 2
                  ? "border-r border-[#e7e7e7]"
                  : "",

                // Desktop vertical separators
                index === 0 ? "lg:border-r" : "",
                index === 2 ? "lg:border-r" : "",
              ].join(" ")}
            >
              <Icon
                strokeWidth={2.2}
                className="mb-3 h-6 w-6 text-black sm:h-[27px] sm:w-[27px]"
              />

              <h3 className="text-[11px] font-bold tracking-[1.2px] text-black sm:text-[13px] sm:tracking-[1.6px] lg:text-[15px] lg:tracking-[2px]">
                {item.title}
              </h3>

              {item.subtitle && (
                <p className="mt-1.5 text-[8px] font-medium tracking-[0.2px] text-[#858585] sm:text-[9px] lg:text-[10px]">
                  {item.subtitle}
                </p>
              )}

              <a
                href={item.href}
                className={`text-[10px] font-semibold text-black underline decoration-[1px] underline-offset-[3px] transition-opacity hover:opacity-60 sm:text-[11px] lg:text-[12px] ${
                  item.subtitle ? "mt-2.5" : "mt-3"
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
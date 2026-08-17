"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  MessageSquareText,
  ShoppingBag,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "@/components/cartdrawer";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<{ name: string; _id: string }[]>([]);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const updateNavbar = () => setIsScrolled(window.scrollY > 20);

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    return () => window.removeEventListener("scroll", updateNavbar);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => setCategories([]));
  }, []);

  const aboutItems = [
    { name: "Vision", link: "/about#vision" },
    { name: "Mission", link: "/about#mission" },
    { name: "Our Story", link: "/about#our-story" },
    { name: "Sustainability", link: "/sustainability" },
    { name: "Policies", link: "/policies" },
  ];

  const collectionItems = categories.map((category) => ({
    name: category.name,
    link: `/category?cat=${encodeURIComponent(category.name.toLowerCase())}`,
  }));

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about", children: aboutItems },
    {
      name: "Collection",
      link: "/category?cat=all",
      children: collectionItems,
    },
    { name: "Technology", link: "/technology" },
    { name: "Sustainability", link: "/sustainability" },
    { name: "Our Dealers", link: "/dealers" },
    { name: "ContactUs", link: "/contact" },
  ];

  const isItemActive = (item: (typeof menuItems)[number]) => {
    if (item.name === "Home") return pathname === "/";
    if (item.name === "Collection") {
      return pathname === "/category" || pathname.startsWith("/product/");
    }

    return pathname === item.link || pathname.startsWith(`${item.link}/`);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 top-0 z-[100] w-full transition-all duration-300",
          isScrolled
            ? "border-b border-white/35 bg-white/70 shadow-[0_8px_32px_rgba(15,23,42,0.10)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-white"
        )}
      >
        <div className="mx-auto flex h-[95px] w-full max-w-[1920px] items-center justify-between px-[62px] max-lg:px-6 max-sm:h-[78px] max-sm:px-5">
          {/* Logo Image */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="8 Gears"
              width={135}
              height={70}
              priority
              className="h-auto w-[135px] object-contain max-sm:w-[105px]"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-[31px]">
              {menuItems.map((item) =>
                item.children ? (
                  <div key={item.name} className="group relative py-8">
                    <Link
                      href={item.link}
                      aria-current={isItemActive(item) ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 text-[15px] font-normal leading-none tracking-[0.01em] text-[#555555] transition-all duration-200 hover:bg-black/[0.045] hover:text-black",
                        isItemActive(item) && "bg-black/[0.055] font-bold text-black"
                      )}
                    >
                      {item.name}
                      <ChevronDown
                        size={17}
                        strokeWidth={2.2}
                        className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      />
                    </Link>

                    <div className="invisible absolute left-1/2 top-[calc(100%-8px)] min-w-[250px] -translate-x-1/2 translate-y-3 overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 p-2.5 opacity-0 shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-white/80 backdrop-blur-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="mb-1 px-3 pb-2 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                        {item.name === "Collection" ? "Shop by category" : "Discover our brand"}
                      </div>
                      {item.children.length > 0 ? (
                        item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.link}
                            className="group/item flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-[#555555] transition-all hover:bg-black hover:pl-4 hover:text-white"
                          >
                            {child.name}
                            <span className="translate-x-1 text-lg leading-none opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100">›</span>
                          </Link>
                        ))
                      ) : (
                        <span className="block px-4 py-3 text-[14px] text-[#888888]">
                          No categories available
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.link}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-2.5 py-2 text-[15px] font-normal leading-none tracking-[0.01em] text-[#555555] transition-all duration-200 hover:bg-black/[0.045] hover:text-black",
                      isItemActive(item) && "bg-black/[0.055] font-bold text-black"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden shrink-0 items-center gap-[30px] lg:flex">
            <Link
              href="/contact"
              aria-label="Messages"
              className="text-black transition-opacity hover:opacity-70"
            >
              <MessageSquareText size={25} strokeWidth={1.9} />
            </Link>

            <button
              type="button"
              aria-label="Cart"
              onClick={() => setDrawerOpen(true)}
              className="relative text-black transition-opacity hover:opacity-70"
            >
              <ShoppingBag size={26} strokeWidth={1.9} />
              {cartCount > 0 && (
                <span className="absolute -right-[8px] -top-[8px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-[4px] text-[9px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href="/admin/products"
              aria-label="Account"
              className="text-black transition-opacity hover:opacity-70"
            >
              <UserRound size={26} strokeWidth={1.9} />
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-5 lg:hidden">
            <button
              type="button"
              aria-label="Cart"
              onClick={() => setDrawerOpen(true)}
              className="relative text-black"
            >
              <ShoppingBag size={25} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -right-[8px] -top-[8px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-[4px] text-[9px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenu((prev) => !prev)}
              className="text-black"
            >
              {mobileMenu ? <X size={29} /> : <Menu size={29} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="absolute left-0 top-full w-full border-t border-black/5 bg-white shadow-xl lg:hidden">
            <div className="flex flex-col px-7 py-8">
              {menuItems.map((item) =>
                item.children ? (
                  <div key={item.name} className="border-b border-black/5">
                    <div className="flex items-center">
                      <Link
                        href={item.link}
                        onClick={() => setMobileMenu(false)}
                        aria-current={isItemActive(item) ? "page" : undefined}
                        className={cn(
                          "flex-1 py-4 text-[18px] font-medium text-[#555555]",
                          isItemActive(item) && "font-bold text-black"
                        )}
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Toggle ${item.name} menu`}
                        aria-expanded={mobileDropdown === item.name}
                        onClick={() =>
                          setMobileDropdown((current) =>
                            current === item.name ? null : item.name
                          )
                        }
                        className="p-4 text-[#555555]"
                      >
                        <ChevronDown
                          size={20}
                          className={cn(
                            "transition-transform",
                            mobileDropdown === item.name && "rotate-180"
                          )}
                        />
                      </button>
                    </div>
                    {mobileDropdown === item.name && (
                      <div className="pb-3 pl-5">
                        {item.children.length > 0 ? (
                          item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.link}
                              onClick={() => setMobileMenu(false)}
                              className="block py-2.5 text-[16px] text-[#777777]"
                            >
                              {child.name}
                            </Link>
                          ))
                        ) : (
                          <span className="block py-2.5 text-[14px] text-[#999999]">
                            No categories available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setMobileMenu(false)}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={cn(
                      "border-b border-black/5 py-4 text-[18px] font-medium text-[#555555]",
                      isItemActive(item) && "font-bold text-black"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}

              <Link
                href="/admin/products"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 pt-6 text-[18px] font-bold text-black"
              >
                <UserRound size={22} />
                Account
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

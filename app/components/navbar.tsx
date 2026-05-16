"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareText, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CartDrawer } from "@/components/cartdrawer";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { cartCount } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/category?cat=all", active: true },
    { name: "Sustainability", link: "/sustainability" },
    { name: "Policies", link: "/policies" },
    { name: "Order", link: "/orders/track" },
    { name: "Our Dealers", link: "/dealers" },
    { name: "Contact Us", link: "/contact" },
    { name: "News & Events", link: "/news-events" },
    { name: "Blog Posts", link: "/blog" },
  ];

  return (
    <>
      <nav className="fixed left-0 top-0 z-[100] w-full bg-white">
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
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className={cn(
                    "whitespace-nowrap text-[15px] font-normal leading-none tracking-[0.01em] text-[#555555] transition-colors hover:text-black",
                    item.active && "font-bold text-black"
                  )}
                >
                  {item.name}
                </Link>
              ))}
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
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setMobileMenu(false)}
                  className={cn(
                    "border-b border-black/5 py-4 text-[18px] font-medium text-[#555555]",
                    item.active && "font-bold text-black"
                  )}
                >
                  {item.name}
                </Link>
              ))}

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
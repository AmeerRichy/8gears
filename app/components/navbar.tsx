"use client";

import { useState } from "react";
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
        <div className="mx-auto flex h-[95px] w-full max-w-[1920px] items-center justify-between px-[62px]">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <div className="relative flex items-center">
              <span className="font-black text-[54px] leading-none tracking-[-0.08em] text-black">
                8
              </span>

              <div className="ml-[5px] flex flex-col leading-none">
                <span className="font-black text-[27px] leading-[0.9] tracking-[-0.04em] text-black">
                  GEAR
                </span>

                <div className="relative mt-[3px] h-[10px] w-[72px]">
                  <span className="absolute left-[18px] top-[0px] block h-[1.5px] w-[45px] bg-black" />
                  <span className="absolute left-[9px] top-[4px] block h-[1.5px] w-[59px] bg-black" />
                  <span className="absolute left-[32px] top-[8px] block h-[1.5px] w-[31px] bg-black" />
                </div>
              </div>
            </div>
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
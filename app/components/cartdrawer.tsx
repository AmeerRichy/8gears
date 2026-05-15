"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, total, cartCount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  return (
    <>
      {/* Blur Overlay */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/35 backdrop-blur-[8px] transition-all duration-300 ${isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[9999] h-dvh w-full max-w-[500px] bg-white text-black shadow-2xl transform transition-transform duration-300 ease-out font-[system-ui] ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div className="h-[86px] px-6 sm:px-7 flex items-center justify-between border-b border-black/10">
          <div className="flex items-center gap-3">
            <h2 className="text-[28px] sm:text-[30px] leading-none font-semibold tracking-[-0.8px] text-black">
              Add To Cart
            </h2>

            <div className="h-[34px] min-w-[74px] px-4 rounded-full border border-black/10 bg-white flex items-center justify-center text-[15px] leading-none font-normal text-black">
              {cartCount} Item{cartCount === 1 ? "" : "s"}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-[34px] h-[34px] flex items-center justify-center text-black/55 text-[26px] leading-none font-light hover:text-black transition cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="h-[calc(100dvh-86px)] overflow-y-auto px-6 sm:px-7 pt-6 pb-[220px]">
          {cart.length === 0 ? (
            <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
              <div className="text-[44px] leading-none">🛍️</div>

              <h3 className="mt-5 text-[23px] font-semibold tracking-[-0.4px] text-black">
                Your cart is empty
              </h3>

              <p className="mt-2 text-[15px] text-black/55">
                Add some products to continue.
              </p>

              <button
                onClick={() => {
                  onClose();
                  router.push("/category?cat=all");
                }}
                className="mt-7 h-[52px] px-8 rounded-full bg-black text-white text-[12px] tracking-[0.08em] uppercase hover:bg-white hover:text-black border border-black transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-7">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="relative grid grid-cols-[100px_1fr_auto] gap-4 items-start"
                >
                  {/* Product Image */}
                  <div className="w-[100px] h-[150px] bg-[#f1f1f1] overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Middle Info */}
                  <div className="min-w-0 pt-[1px] pr-2">
                    <h3 className="text-[13px] leading-[1.25] font-medium tracking-[0.08em] uppercase text-black underline underline-offset-[3px] decoration-[1px] truncate">
                      {item.name}
                    </h3>

                    <div className="mt-[12px] flex items-center gap-[8px] text-[12px] leading-none font-normal tracking-[0.08em] uppercase text-black">
                      <span className="w-[17px] h-[17px] rounded-full bg-[#536250] inline-block shrink-0" />
                      <span className="truncate">{item.color}</span>
                      <span>/</span>
                      <span>{item.size}</span>
                    </div>

                    {/* Quantity + Price same bottom line */}
                    <div className="mt-[66px] flex items-center justify-between gap-4">
                      <div className="inline-flex h-[27px] min-w-[55px] items-center rounded-full border border-black bg-white overflow-hidden">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          className="w-full h-full px-3 bg-transparent text-[12px] text-black outline-none cursor-pointer appearance-auto"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <p className="hidden text-[13px] leading-none font-normal tracking-[0.08em] text-black whitespace-nowrap">
                        ${Number(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="h-[150px] flex flex-col items-end justify-between pt-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      className="w-[20px] h-[20px] flex items-center justify-center text-[18px] leading-none text-black/60 hover:text-black transition cursor-pointer"
                    >
                      ×
                    </button>

                    <p className="text-[13px] leading-none font-normal tracking-[0.08em] text-black whitespace-nowrap">
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-black/20 px-6 sm:px-7 pt-5 pb-5">
            <div className="flex items-center justify-between">
              <p className="text-[18px] leading-none font-semibold tracking-[0.02em] text-black">
                Sub Total:
              </p>

              <p className="text-[24px] leading-none font-normal tracking-[-0.3px] text-black">
                ${Number(total).toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full h-[54px] rounded-full bg-black border border-black text-white text-[12px] font-normal tracking-[0.08em] uppercase hover:bg-white hover:text-black transition cursor-pointer"
            >
              Continue To Checkout
            </button>

            <button
              onClick={handleViewCart}
              className="mt-3 w-full h-[54px] rounded-full bg-white border border-black text-black text-[12px] font-normal tracking-[0.08em] uppercase hover:bg-black hover:text-white transition cursor-pointer"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
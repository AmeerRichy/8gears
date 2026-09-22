import { Suspense } from "react";
import Script from "next/script";

import Footer from "@/components/footer";

import { createPageMetadata } from "@/app/lib/seo";

import AboutUsHero from "@/components/sections/Abouthero";
import AboutWhoWeAre from "@/components/sections/AboutWhoWeAre";
import AboutPurpose from "@/components/sections/AboutPurpose";
import AboutValuesBar from "@/components/sections/AboutValuesBar";
import AboutStory from "@/components/sections/AboutStory";
import AboutSustainability from "@/components/sections/AboutSustainability";
import ContactSection from "@/components/ContactSection";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Discover 8-Gear — motorcycle gear built for riders who value performance, protection, durability, and the freedom of the ride.",
  path: "/about",
});

export default function About() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black" />
      }
    >
      {/* =====================================================
          ABOUT HASH SCROLL FIX

          IMPORTANT:
          - Does NOT touch normal /about navigation
          - Does NOT replace your global scroll-to-top
          - Only runs for:
              /about#who-we-are
              /about#vision-mission
              /about#our-story
              /about#sustainability
      ====================================================== */}
      <Script
        id="about-hash-scroll"
        strategy="afterInteractive"
      >
        {`
          (() => {
            const validHashes = new Set([
              "who-we-are",
              "vision-mission",
              "our-story",
              "sustainability"
            ]);

            let timers = [];

            const clearTimers = () => {
              timers.forEach((timer) => {
                window.clearTimeout(timer);
              });

              timers = [];
            };

            const getHashId = () => {
              const hash = window.location.hash;

              if (!hash) return null;

              const id = decodeURIComponent(
                hash.substring(1)
              );

              if (!validHashes.has(id)) {
                return null;
              }

              return id;
            };

            const getTarget = () => {
              const id = getHashId();

              if (!id) return null;

              return document.getElementById(id);
            };

            const scrollToTarget = (
              behavior = "auto"
            ) => {
              const target = getTarget();

              if (!target) return;

              /*
               * The target itself sits at 50%
               * of the section.
               *
               * Put that point in the center
               * of the viewport.
               */
              const rect =
                target.getBoundingClientRect();

              const absoluteTargetY =
                window.scrollY +
                rect.top;

              const desiredY =
                absoluteTargetY -
                window.innerHeight / 2;

              window.scrollTo({
                top: Math.max(0, desiredY),
                behavior
              });
            };

            const settleHashPosition = () => {
              /*
               * No hash = leave your normal
               * global scroll-to-top completely alone.
               */
              if (!getTarget()) return;

              clearTimers();

              /*
               * Pass 1:
               * Wait for browser + React paint.
               */
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  scrollToTarget("auto");
                });
              });

              /*
               * Pass 2:
               * Correct after initial components settle.
               */
              timers.push(
                window.setTimeout(() => {
                  scrollToTarget("auto");
                }, 120)
              );

              /*
               * Pass 3:
               * Correct after images/fonts/layout.
               */
              timers.push(
                window.setTimeout(() => {
                  scrollToTarget("auto");
                }, 350)
              );

              /*
               * Final pass:
               * Happens after your global
               * scroll-to-top logic has had time to run.
               */
              timers.push(
                window.setTimeout(() => {
                  scrollToTarget("smooth");
                }, 700)
              );
            };

            /*
             * Coming from another page:
             *
             * /technology
             *      ↓
             * /about#our-story
             */
            settleHashPosition();

            /*
             * Correct again once everything,
             * including images, has loaded.
             */
            window.addEventListener(
              "load",
              settleHashPosition
            );

            /*
             * Switching dropdown sections while
             * already on /about.
             */
            window.addEventListener(
              "hashchange",
              settleHashPosition
            );

            /*
             * Browser back/forward.
             */
            window.addEventListener(
              "pageshow",
              settleHashPosition
            );
          })();
        `}
      </Script>

      {/* =====================================================
          STYLES
      ====================================================== */}
      <style>
        {`
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            html {
              scroll-behavior: auto;
            }
          }

          /* ===================================================
             ABOUT HASH SECTIONS
          ==================================================== */
          .about-hash-section {
            position: relative;
          }

          /*
           * Invisible navigation target.
           *
           * It sits at the exact vertical center
           * of its corresponding section.
           */
          .about-hash-anchor {
            pointer-events: none;

            position: absolute;

            left: 0;
            top: 50%;

            width: 1px;
            height: 1px;
          }

          /* ===================================================
             DESTINATION HIGHLIGHT

             Small premium focus pulse when arriving
             from the navbar.
          ==================================================== */
          .about-hash-anchor:target
            + .about-hash-content {
            animation:
              about-section-focus
              900ms
              cubic-bezier(0.22, 1, 0.36, 1);
          }

          @keyframes about-section-focus {
            0% {
              transform: scale(1);
              filter: brightness(1);
            }

            35% {
              transform: scale(1.008);
              filter: brightness(1.02);
            }

            65% {
              transform: scale(1.003);
              filter: brightness(1.01);
            }

            100% {
              transform: scale(1);
              filter: brightness(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .about-hash-anchor:target
              + .about-hash-content {
              animation: none;
            }
          }
        `}
      </style>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <AboutUsHero />

        {/* =====================================================
            VALUES BAR
        ====================================================== */}
        <AboutValuesBar />

        {/* =====================================================
            WHO WE ARE
        ====================================================== */}
        <section className="about-hash-section">
          <span
            id="who-we-are"
            aria-hidden="true"
            className="about-hash-anchor"
          />

          <div className="about-hash-content">
            <AboutWhoWeAre />
          </div>
        </section>

        {/* =====================================================
            VISION + MISSION
        ====================================================== */}
        <section className="about-hash-section">
          <span
            id="vision-mission"
            aria-hidden="true"
            className="about-hash-anchor"
          />

          <div className="about-hash-content">
            <AboutPurpose />
          </div>
        </section>

        {/* =====================================================
            OUR STORY
        ====================================================== */}
        <section className="about-hash-section">
          <span
            id="our-story"
            aria-hidden="true"
            className="about-hash-anchor"
          />

          <div className="about-hash-content">
            <AboutStory />
          </div>
        </section>

        {/* =====================================================
            SUSTAINABILITY
        ====================================================== */}
        <section className="about-hash-section">
          <span
            id="sustainability"
            aria-hidden="true"
            className="about-hash-anchor"
          />

          <div className="about-hash-content">
            <AboutSustainability />
          </div>
        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <ContactSection />
      </main>

      <Footer />
    </Suspense>
  );
}
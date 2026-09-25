
"use client";

import { FaFacebook, FaInstagram, FaPhoneAlt, FaYoutube  } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { IoIosMail } from "react-icons/io";


export default function FooterSection() {
  return (
    <footer className="relative w-full border-t border-primary-brown/20">

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* ================= COMPANY INFO ================= */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-primary-thick">
              Trivya
            </h2>

            <p className="mt-4 max-w-sm text-sm md:text-base leading-7 text-primary-thick/70">
              Natural care for stronger, healthier and
              shinier-looking hair. Rooted in tradition,
              crafted with care.
            </p>

            {/* Address */}
            <div className="mt-6 flex items-start gap-3">
              <FiMapPin className="w-5 h-5 mt-1 shrink-0 text-primary-brown" />

              <div className="text-sm leading-6 text-primary-thick/70">
                <p className="font-medium text-primary-thick">
                  Company Address
                </p>

                <p>
                  13/A3, Jose Garden,
                  <br />
                  Urumandampalaya G.N.Mills post, Coimbatore,
                  <br />
                  Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Phone */}
           <div className="mt-4 flex items-center gap-3">
                <FaPhoneAlt className="w-5 h-5 shrink-0 text-primary-brown" />

                <a
                    href="tel:+917904208592"
                    className="text-sm text-primary-thick/70 hover:text-primary-thick transition-colors"
                >
                    +91 7904208592
                </a>
            </div>
            {/* Email */}
            <div className="mt-3 flex items-center gap-3">
              <IoIosMail className="w-5 h-5 shrink-0 text-primary-brown" />

              <a
                href="mailto:business@trivyacare.com"
                className="text-sm text-primary-thick/70 hover:text-primary-thick transition-colors"
              >
                business@trivyacare.com
              </a>
            </div>
          </div>

          {/* ================= GOOGLE MAP ================= */}
          <div>
            <h2 className="text-xl font-serif font-semibold text-primary-thick">
              Find Us
            </h2>

            <p className="mt-2 text-sm text-primary-thick/60">
              Visit our location
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-primary-brown/15 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3915.714577696376!2d76.95458597504597!3d11.060012789106523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDAzJzM2LjEiTiA3NsKwNTcnMjUuOCJF!5e0!3m2!1sen!2sin!4v1789843704964!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Trivya Location"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-semibold text-primary-thick">
              Connect With Us
            </h2>

            <p className="mt-2 text-sm leading-6 text-primary-thick/60">
              Follow Trivya for updates, products and
              natural hair-care tips.
            </p>

            <div className="mt-6 flex items-center gap-4">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/trivya.care/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Trivya Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-brown/20 text-primary-thick transition-all duration-300 hover:bg-primary-brown hover:text-white hover:scale-105"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61594492712046"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Trivya Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-brown/20 text-primary-thick transition-all duration-300 hover:bg-primary-brown hover:text-white hover:scale-105"
              >
                <FaFacebook  className="w-5 h-5" />
              </a>

              <a
                href="https://www.youtube.com/@Trivyacare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Trivya Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-brown/20 text-primary-thick transition-all duration-300 hover:bg-primary-brown hover:text-white hover:scale-105"
              >
                <FaYoutube  className="w-5 h-5" />
              </a>

            </div>

            {/* Shop Link */}
            <div className="mt-8">
              <a
                href="/main-products"
                className="inline-flex items-center rounded-xl bg-primary-thick px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Shop Our Products
              </a>
            </div>
          </div>

        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="mt-12 pt-6 border-t border-primary-brown/100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-sm text-black/50">
              © 2026 Trivya. All Rights Reserved.
            </p>

            <p className="text-sm text-black/40">
              Natural Care. Rooted in Tradition.
            </p>

          </div>
        </div>

      </div>

    </footer>
  );
}

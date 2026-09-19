"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation";
export default function Navbar({userSession}: {userSession: any}) {

  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);

  const redirectProducts = () => {router.push("/shop-products")}


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-background dark:bg-black border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-25">
          <div className="flex items-center h-full">
            <img
              src="/product/sidebar-image-2.png"
              alt="Trivya"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-6 lg:gap-8 xl:gap-10">
              
              <li>
                <a href="#oilUseSection" className="nav-link">
                  Home
                </a>
              </li>

              <li>
                <a href="#homeSection" className="nav-link">
                  About Us
                </a>
              </li>

              <li>
                <a href="#ingredients" className="nav-link">
                  Ingredients
                </a>
              </li>

              <li>
                <a href="#howToUseSection" className="nav-link">
                  How To Use
                </a>
              </li>

              <li>
                <a href="#faqSection" className="nav-link">
                  FAQ
                </a>
              </li>

              <li>
                <a href="/shop-products" className="nav-link">
                  Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Icons + Mobile Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="cursor-pointer flex items-center gap-2 text-primary font-medium border border-primary px-3 py-1.5 rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300"
                onClick={redirectProducts}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Now</span>
            </button>

            {/* {userSession ? (
              <button
                className="cursor-pointer flex items-center gap-2 text-primary font-medium border border-primary px-3 py-1.5 rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300"
                onClick={handleLogoutCustomer}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                className="cursor-pointer flex items-center gap-2 text-primary font-medium border border-primary px-3 py-1.5 rounded-2xl hover:bg-primary hover:text-white transition-colors duration-300"
                onClick={redirectUserCreate}
              >
                <User className="w-5 h-5" />
                <span>Log in</span>
              </button>
            )} */}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden cursor-pointer"
            >
              {menuOpen ? (
                <X className="text-primary w-6 h-6" />
              ) : (
                <Menu className="text-primary w-6 h-6" />
              )}
            </button>
          </div>
        </div>


        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-600">
            <ul className="flex flex-col py-4 space-y-4">

              <li>
                <a href="#oilUseSection" className="nav-link">
                  Home
                </a>
              </li>

              <li>
                <a href="#homeSection" className="nav-link">
                  About Us
                </a>
              </li>

              <li>
                <a href="#ingredients" className="nav-link">
                  Ingredients
                </a>
              </li>

              <li>
                <a href="#howToUseSection" className="nav-link">
                  How To Use
                </a>
              </li>

              <li>
                <a href="#faqSection" className="nav-link">
                  FAQ
                </a>
              </li>

              <li>
                <a href="#bannerSection" className="nav-link">
                  Shop
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
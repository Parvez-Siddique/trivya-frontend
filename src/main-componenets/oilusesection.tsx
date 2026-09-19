
"use client";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OilUseSection({
  userSession,
}: {
  userSession?: any;
}) {
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/shop-products");
  };

  return (
    <section
      className="relative w-full min-h-[calc(100vh-100px)] mt-[100px] px-6 md:px-12 lg:px-20 py-16 overflow-hidden"
      id="oilUseSection"
    >
      <div className="max-w-7xl mx-auto">

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* Content Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">

            <p className="text-sm md:text-base tracking-[0.3em] uppercase text-primary-brown mb-5">
              Trivya
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-primary-thick mb-8">
              Hair Care,
              <br />
              <span className="italic font-normal">
                Rooted in Tradition.
              </span>
            </h1>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-primary-thick/80">

              <p>
                Natural care for stronger, healthier and
                shinier-looking hair.
              </p>

              <p>
                A nourishing blend of traditional ingredients
                crafted with care to make hair oiling a simple
                and comforting part of your routine.
              </p>

            </div>



            {/* Shop Now Button */}
            <div className="mt-8 flex justify-center lg:justify-start">
               <button className="cursor-pointer flex items-center gap-2 bg-primary text-white font-medium border border-primary px-3 py-1.5 rounded-2xl  hover:bg-primary-background hover:text-primary transition-colors duration-300"
                    onClick={handleShopNow}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                </button>
            </div>

          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
            <img
              src="/product/lady-oil-use.jpeg"
              alt="Woman applying Trivya Hair Oil"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Benefits Row */}
        <div className="mt-16 pt-8 border-t border-primary-brown/20">

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm md:text-base tracking-wide text-primary-thick/80">

            <span>Strengthens Hair</span>

            <span className="text-primary-brown">•</span>

            <span>Nourishes the Scalp</span>

            <span className="text-primary-brown">•</span>

            <span>Promotes Healthy-Looking Hair</span>

            <span className="text-primary-brown">•</span>

            <span>Traditional Ingredients</span>

          </div>

        </div>

      </div>
    </section>
  );
}

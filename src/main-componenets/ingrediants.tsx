"use client";

const ingredients = [
  {
    name: "Coconut Oil",
    description: "A nourishing base traditionally used for hair care.",
    image: "/ingredients/coconut.png",
  },
  {
    name: "Amla",
    description: "A traditional ingredient widely used in hair-care routines.",
    image: "/ingredients/amla.png",
  },
  {
    name: "Fenugreek",
    description: "Known for its use in traditional scalp and hair care.",
    image: "/ingredients/fenugreek.png",
  },
  {
    name: "Henna",
    description: "A natural botanical traditionally associated with hair care.",
    image: "/ingredients/henna.png",
  },
  {
    name: "Rosemary",
    description: "A popular botanical used in scalp-care routines.",
    image: "/ingredients/rosemary.png",
  },
  {
    name: "Hibiscus",
    description: "Traditionally used to nourish and condition hair.",
    image: "/ingredients/hibiscus.png",
  },
  {
    name: "Curry Leaves",
    description:
      "A familiar ingredient in traditional Indian hair-care practices.",
    image: "/ingredients/curryleaves.png",
  },
];

export default function IngredientSection() {
  return (
    <section id="ingredients"
      className="relative w-full mt-[100px] px-4 sm:px-6 md:px-10 lg:px-16 py-12  sm:py-14 md:py-16 lg:py-20 overflow-hidden border-t border-b border-primary-brown/100bg-primary-background-lite">
      <div className="w-full max-w-7xl mx-auto">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-black">
            Nature's Goodness in Every Drop
          </p>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-black/60 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Carefully selected natural ingredients that nourish your scalp
            and help keep your hair healthy and beautiful.
          </p>
        </div>


        {/* ================= INGREDIENT CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:gap-6 lg:gap-5">

          {ingredients.map((ingredient) => (

            <div key={ingredient.name} className="flex flex-col items-center text-center min-w-0">

              {/* ================= IMAGE ================= */}
              <div className="w-full aspect-square rounded-xl sm:rounded-2xl border border-primary-brown/30 p-1.5 sm:p-2 md:p-3 overflow-hidden bg-white">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl"/>
              </div>


              {/* ================= TEXT ================= */}
              <div className="pt-3 sm:pt-4 md:pt-5 px-1 sm:px-2">

                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-black mb-1.5 sm:mb-2">
                  {ingredient.name}
                </h3>

                <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-black/60">
                  {ingredient.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
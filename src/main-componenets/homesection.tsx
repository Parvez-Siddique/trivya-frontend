"use client";

export default function HomeSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] mt-[100px] px-6 md:px-12 lg:px-20 py-16 overflow-hidden"
      id="homeSection">

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 max-w-7xl mx-auto">

        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[650px] rounded-2xl overflow-hidden">
          <img
            src="/product/trivya-bottle.jpeg"
            alt="Trivya Hair Oil"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">

          <p className="text-sm tracking-[0.3em] uppercase text-primary-brown mb-5">
            The Trivya Story
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-primary-thick mb-8">
            Rooted in Tradition.
            <br />
            <span className="italic font-normal">
              Made with Love.
            </span>
          </h1>

          <div className="space-y-6 text-base md:text-lg leading-relaxed text-primary-thick/80">

            <p>
              Trivya Hair Oil brings together the goodness of carefully
              selected traditional ingredients in one nourishing blend.
            </p>

            <p>
              Inspired by timeless hair-care rituals passed down through
              generations, Trivya is created to make everyday hair care
              simple, natural and enjoyable.
            </p>

          </div>

          <div className="mt-10 pt-8 border-t border-primary-brown/20">
            <p className="text-xl md:text-2xl font-serif italic text-primary-brown">
              அம்மாவின் அன்பில்
            </p>

            <p className="mt-2 text-sm tracking-wide text-primary-thick/70">
              Made with the warmth and care of a mother.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
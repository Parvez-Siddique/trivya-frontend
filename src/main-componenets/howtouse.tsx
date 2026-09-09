"use client";

const steps = [
  {
    name: "1",
    description: "Take a few drops of Trivya Hair Oil into your palm.",
    image: "/usage/oildrops.png",
  },
  {
    name: "2",
    description: "Apply the oil gently to your scalp and hair.",
    image: "/usage/apply.png",
  },
  {
    name: "3",
    description: "Massage your scalp gently for 5–10 minutes.",
    image: "/usage/massage.png",
  },
  {
    name: "4",
    description: "Leave it on for at least 2 hours or overnight.",
    image: "/usage/clock.png",
  },
  {
    name: "5",
    description: "Wash your hair thoroughly with a mild shampoo.",
    image: "/usage/shower.png",
  },
];

export default function HowToUseSection() {
  return (
    <section className="relative w-full mt-[100px] px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 md:py-20 overflow-hidden border-primary-brown/20"
      id="howToUseSection">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-10 lg:gap-12">

        {/* =====================================================
            BRAND STORY
        ====================================================== */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center px-2 sm:px-6 lg:px-8" >

          {/* Brand Image */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mb-5 sm:mb-6 flex items-center justify-center">
            <img
              src="/product/triviya-oil.png"
              alt="Trivya Hair Oil"
              className="w-full h-full object-contain"
            />
          </div>


          {/* Small Label */}
          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase text-primary-thick font-medium mb-4 sm:mb-6">
            Our Story
          </p>


          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black leading-tight">
            More Than Hair Oil.
            <br />

            <span className="text-primary-thick">
              It's a Tradition.
            </span>
          </h2>


          {/* Divider */}
          <div className="w-14 sm:w-16 h-px bg-primary-thick/40 mx-auto my-6 sm:my-8"/>


          {/* Story */}
          <div className="w-full max-w-xl space-y-4 sm:space-y-5" >

            <p className="text-base sm:text-lg md:text-xl font-serif leading-relaxed text-black/80">
              Hair oiling has always been more than just hair care.
            </p>


            <p className="text-sm sm:text-base leading-relaxed text-black/60" >
              It is the warmth of a mother's hands, the comfort of a
              familiar fragrance and a tradition passed from one
              generation to another.
            </p>


            <p className="text-sm sm:text-base leading-relaxed text-black/60">
              Trivya was created to carry that feeling forward —
              <span className="font-semibold text-primary-thick">
                {" "}in every drop.
              </span>
            </p>

          </div>

          {/* Brand Signature */}
          <div className="mt-8 sm:mt-10">

            <p className="text-3xl sm:text-4xl font-serif text-primary-thick">
              Trivya
            </p>

            <p className="text-xl md:text-2xl font-serif italic text-primary-brown">
              அம்மாவின் அன்பில்
            </p>
          </div>
        </div>


        {/* =====================================================
            RESPONSIVE DIVIDER
        ====================================================== */}

        {/* Desktop Vertical Divider */}
        <div className="hidden lg:block w-px self-stretch bg-primary-brown/30 shrink-0" />

        {/* Mobile / Tablet Horizontal Divider */}
        <div className="block lg:hidden w-full h-px bg-primary-brown/20" />
        {/* HOW TO USE */}
            <div className="w-full lg:w-1/2 flex justify-center px-1 sm:px-4 lg:pl-8 lg:pr-0" >

            <div className="w-full max-w-4xl text-center">

                {/* Heading */}
                <div className="mb-10 sm:mb-12">

                <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-black">
                    How to Use
                </p>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-black/60 max-w-xl mx-auto leading-relaxed">
                    A simple ritual for making the most of your
                    Trivya Hair Oil.
                </p>

                </div>


                {/* =================================================
                    STEPS
                ================================================== */}
                <div
                className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8 lg:gap-4">

                {/* Desktop Connecting Line */}
                <div className="hidden lg:block absolute top-[56px] left-[10%] right-[10%] h-px bg-primary-brown/20"/>


                {steps.map((step) => (

                    <div
                    key={step.name}
                    className="relative z-10 flex flex-col items-center text-center min-w-0"
                    >

                    {/* Image */}
                    <div
                        className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border border-primary-brown/30 p-1.5 bg-primary-background-lite"
                    >
                        <img
                        src={step.image}
                        alt={`Step ${step.name}`}
                        className="w-full h-full object-cover rounded-full" />
                    </div>


                    {/* Step Number */}
                    <div
                        className="relative z-20 -mt-3 sm:-mt-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary-thick text-white text-xs font-bold border-4 border-primary-background-lite"
                    >
                        {step.name}
                    </div>


                    {/* Description */}
                    <div
                        className="mt-3 sm:mt-4 px-2"
                    >

                        <p
                        className="text-xs sm:text-sm leading-relaxed font-medium text-primary-thick max-w-[220px] mx-auto"
                        >
                        {step.description}
                        </p>

                    </div>

                    </div>

                ))}

                </div>
            </div>
            </div>
      </div>
    </section>
  );
}
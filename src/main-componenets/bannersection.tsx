
"use client";

export default function BannerSection() {
  return (
    <section
      className="relative w-full h-[calc(100vh-100px)] mt-[100px] overflow-hidden"
      id="bannerSection"
    >
      <picture className="absolute inset-0 w-full h-full">
        {/* Large screens */}
        <source
          media="(min-width: 1024px)"
          srcSet="/product/banner-mediium.jpeg"
        />

        {/* Medium screens */}
        <source
          media="(min-width: 640px)"
          srcSet="/product/banner-small.jpeg"
        />

        {/* Small screens / Mobile */}
        <img
          src="/product/banner-small.jpeg"
          alt="Trivya Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
    </section>
  );
}

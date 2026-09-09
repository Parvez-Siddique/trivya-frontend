"use client";

export default function BannerSection() {
  return (
    <section
      className="relative w-full h-[calc(100vh-100px)] mt-[100px] overflow-hidden"
      id="bannerSection">
      <img
        src="/product/trivya-banner.png"
        alt="Trivya Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </section>
  );
}
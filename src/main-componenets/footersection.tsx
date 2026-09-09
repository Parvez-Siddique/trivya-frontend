"use client";

export default function FooterSection() {
  return (
    <footer className="relative w-full px-6 md:px-12 lg:px-20 md:py-5 border-t border-primary-brown/20 bg-primary-background-lite">
        <div className="max-w-8xl mx-auto">
            <div className="border-t border-primary-brown/10">
                <div className="flex flex-row justify-center">
                    <p className="text-xl md:text-sm text-black/50">
                        © 2026 Trivya. All Rights Reserved.
                    </p>
                </div>
            </div>
         </div>
    </footer>
  );
}
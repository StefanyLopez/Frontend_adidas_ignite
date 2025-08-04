export default function PartnersBar() {
  return (
    <section className="bg-bg border-y-2 border-orange py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Logos */}
        <div className="flex justify-center lg:justify-end items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 flex-wrap order-2 lg:order-1">
          <img
            src="/logos/thi.png"
            alt="THI Alemania"
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain"
          />
          <img
            src="/logos/umng.png"
            alt="Universidad Militar"
            className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain"
          />
          <img
            src="/logos/adidaslogo.png"
            alt="Adidas Careers"
            className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain"
          />
        </div>

        {/* Text */}
        <div className="text-center lg:text-left order-1 lg:order-2 px-2">
          <h2 className="font-adi text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-3 leading-tight">
            Design and Technology
          </h2>
          <p className="font-adi text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            This project was developed as part of the technical challenge for
            the <strong>enGlobe_connect</strong> program.
          </p>
        </div>
      </div>
    </section>
  );
}

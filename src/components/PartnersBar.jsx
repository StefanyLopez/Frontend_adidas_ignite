export default function PartnersBar() {
  return (
    <section className="bg-bg border-y-2 border-orange py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/*logos */}
        <div className="flex justify-center md:justify-end items-center gap-10 flex-wrap">
          <img src="/logos/thi.png" alt="THI Alemania" className="h-30 sm:h-34 object-contain" />
          <img src="/logos/umng.png" alt="Universidad Militar" className="h-32 sm:h-36 object-contain" />
          <img src="/logos/adidas.png" alt="Adidas Careers" className="h-40 sm:h-44 object-contain" />
        </div>
        
        {/* Text */}
        <div className="text-center md:text-left">
          <h2 className="font-adi md:text-6xl font-bold text-white mb-4">
            Design and Technology
          </h2>
          <p className="font-adi text-base md:text-2xl text-muted max-w-xl">
             This project was developed as part of the technical challenge for the <strong>enGlobe_connect</strong> program.
          </p>
        </div>
      </div>
    </section>
  );
}

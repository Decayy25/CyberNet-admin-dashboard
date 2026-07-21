import Image from "next/image";

const Hero = () => {
  return (
    <section id="hero">
      <div className="relative bg-[linear-gradient(rgba(255,255,255,0.88),rgba(255,255,255,0.88)),url('/fiber-bg.jpg')] bg-cover bg-center bg-no-repeat py-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 mt-10 md:mt-0 text-left">
                <div className="text-blue-600 text-6xl font-extrabold size-14">
                  CYBERNET
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  Internet Fiber Optik Cepat & Stabil
                </h1>

                <p className="text-xl md:text-2xl text-blue-500 italic mt-6 font-medium">
                  Connected With Your Needs
                </p>

                <p className="text-slate-700 mt-5 text-base md:text-lg max-w-md leading-relaxed">
                  Solusi internet rumah, UMKM, kantor, sekolah dan instansi
                  dengan jaringan Fiber Optik berkualitas.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#coverage"
                    className="bg-blue-600 text-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition duration-300 shadow-md">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Cek Coverage
                  </a>

                  <div className="py-1">
                    <a
                    target="_blank"
                      href="https://wa.me/6282126376157?text=Halo%20CYBERNET,%20saya%20ingin%20berlangganan%20internet."
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition duration-300 shadow-md">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Hubungi Kami
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center md:justify-end relative min-h-87.5] md:min-h-125 lg:max-w-md ml-25">
                <div className="relative w-full max-w-100 md:max-w-150 lg:max-w-200 right-0 translate-x-4 md:translate-x-12 lg:translate-x-24">
                  <Image
                    src="/fiber-optic.png"
                    alt="Kabel Fiber Optik"
                    className="object-contain drop-shadow-2xl scale-110 md:scale-125 lg:scale-150"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              {/* <div className="w-full md:w-150 flex justify-center md:justify-end relative">
              <Image
                src="/fiber-optic.png"
                alt="Kabel Fiber Optik"
                className="w-full max-w-lg object-contain drop-shadow-xl translate-x-4 md:translate-x-65"
                fill
              />
            </div> */}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

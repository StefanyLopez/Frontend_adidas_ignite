import { Search } from "lucide-react";

export default function FilterMenu() {
  return (
    <div className="relative w-full mt-10 mb-8 px-16">
      <div
        className="bg-orange px-16 py-4 flex items-center justify-between text-white font-bold text-lg"
        style={{
          clipPath: "polygon(0 36%, 98.5% 0, 100% 100%, 2% 100%)",
        }}
      >
        <div className="flex px-16 gap-20 translate-y-[14px] font-adi text-2xl ">
          {["JPG", "PNG", "SVG", "MP4", "MP3"].map((type) => (
            <button
              key={type}
              className="hover:text-bg transition-colors duration-200 drop-shadow-md"
            >
              {type}
            </button>
          ))}
        </div>

        <div
          className="flex items-center bg-white text-bg px-24 py-4 shadow-md"
          style={{
            clipPath: "polygon(0 36%, 94% 0, 100% 100%, 8% 100%)",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            className="font-adi translate-y-[8px] bg-transparent outline-none w-72"
          />
          <Search className="w-6 h-6 ml-2 text-gray-600" />
        </div>
      </div>
    </div>
  );
}


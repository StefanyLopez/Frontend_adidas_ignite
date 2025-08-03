import { Search } from "lucide-react"; // Importing Search icon from lucide-react

// FilterMenu component to handle filtering and searching
export default function FilterMenu({ 
  extensionFilter, // Current filter state
  setExtensionFilter, // Function to update filter state
  searchTerm, // Current search term
  setSearchTerm // Function to update search term
}) {
  
  // If the clicked filter is already active, remove it (set to null)
  // Otherwise, set the filter to the clicked extension
  const handleFilterClick = (ext) => {
    setExtensionFilter(extensionFilter === ext ? null : ext);
  };

  // Updates the searchTerm state with the current input value
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full mt-10 mb-8 px-16">
      <div
        className="bg-orange px-16 py-4 flex items-center justify-between text-white font-bold text-lg"
        style={{ // Clip path for the section
          clipPath: "polygon(0 36%, 98.5% 0, 100% 100%, 2% 100%)", // Adjusted to match the design
        }}
      >
        <div className="flex px-16 gap-20 translate-y-[14px] font-adi text-2xl">
          {["jpg", "png", "mp4", "mp3"].map((type) => ( 
            <button // Button for each filter type
              key={type} // Unique key for each button
              className={`transition-all duration-200 drop-shadow-md ${
                extensionFilter === type // Check if this filter is active
                  ? "text-bg scale-110 font-black" // Active 
                  : "hover:text-bg hover:scale-105" // Inactive 
              }`}
              onClick={() => handleFilterClick(type)} 
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input for search functionality */}
        <div
          className="flex items-center bg-white text-bg px-24 py-4 shadow-md"
          style={{
            clipPath: "polygon(0 36%, 94% 0, 100% 100%, 8% 100%)",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange} // Update search term on input change
            className="font-adi translate-y-[8px] bg-transparent outline-none w-72"
          />
          <Search className="w-6 h-6 ml-2 text-gray-600" /> {/* Search icon */}
        </div>
      </div>
    </div>
  );
}
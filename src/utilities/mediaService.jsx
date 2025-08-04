/**
 * MediaService class for handling media asset operations
 * Manages fetching and processing of images, videos, and audio files
 */
export class MediaService {
  constructor(baseURL = window.location.origin) {
    this.baseURL = baseURL;
  }

  /**
   * Fetch all media assets with metadata
   * Returns array of asset objects with file information, dimensions, and metadata
   */
  async fetchAssets() {
    // Define static file lists for each media type
    const images = [
      "sports_(1).jpg",
      "sports_(2).jpg",
      "sports_(3).jpg",
      "sports_(4).jpg",
      "sports_(5).jpg",
      "sports_(6).jpg",
      "sports_(7).jpg",
      "sports_(8).jpg",
      "sports_(1).png",
    ];
    const audios = ["audio1.mp3", "high-impact.mp3"];
    const videos = ["basket.mp4", "box.mp4", "running.mp4", "shoes.mp4"];

    // Combine all files with their type and folder information
    const allFiles = [
      ...images.map((file) => ({ file, tipo: "image", carpeta: "images" })),
      ...audios.map((file) => ({ file, tipo: "audio", carpeta: "audios" })),
      ...videos.map((file) => ({ file, tipo: "video", carpeta: "videos" })),
    ];

    // Process each file to get metadata and create asset objects
    const promises = allFiles.map(async ({ file, tipo, carpeta }) => {
      const url = `${this.baseURL}/${carpeta}/${file}`;
      let type = "unknown";
      let size = 0;
      let dimensions = null;

      try {
        // Fetch file metadata using HEAD request (more efficient than GET)
        const res = await fetch(url, { method: "HEAD" });
        type = res.headers.get("Content-Type") || "unknown";
        size = parseInt(res.headers.get("Content-Length") || "0", 10);
      } catch (err) {
        console.error(`❌ Error fetching metadata for ${file}:`, err);
        // Return error asset object if metadata fetch fails
        return {
          id: `${tipo}-${file}`,
          tipo,
          url,
          titulo: file,
          type: "error",
          size: 0,
          dimensions: null,
        };
      }

      // Get image dimensions for image files
      if (tipo === "image") {
        try {
          const img = new Image();
          img.src = url;
          // Wait for image to load to get natural dimensions
          await new Promise((resolve, reject) => {
            img.onload = () => {
              dimensions = `${img.naturalWidth}x${img.naturalHeight}`;
              resolve();
            };
            img.onerror = reject;
          });
        } catch (err) {
          console.warn(`⚠️ Could not get dimensions for ${file}:`, err);
        }
      }

      // Return complete asset object with all metadata
      return {
        id: `${tipo}-${file}`, // Unique identifier
        tipo, // Media type (image/video/audio)
        url, // Full URL to asset
        titulo: file, // Display name
        type, // MIME type from server
        size, // File size in bytes
        dimensions, // Image dimensions (width x height)
      };
    });

    // Wait for all asset processing to complete
    return Promise.all(promises);
  }
}

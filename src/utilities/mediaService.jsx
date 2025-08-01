export class MediaService {
  constructor(baseURL = window.location.origin) {
    this.baseURL = baseURL;
  }

  async fetchAssets() {
    const images = ['adi_(1).jpg', 'adi_(2).jpg', 'adi_(3).jpg', 'adi_(4).jpg', 'adi_(5).jpg', 'adi_(6).jpg', 'adi_(7).jpg', 'adi_(8).jpg', 'adi_(9).jpg', 'adi_(10).jpg'];
    const audios = ['audio1.mp3', 'high-impact.mp3'];

    const allFiles = [
      ...images.map((file) => ({ file, tipo: 'image', carpeta: 'images' })),
      ...audios.map((file) => ({ file, tipo: 'audio', carpeta: 'audios' })),
    ];

    const promises = allFiles.map(async ({ file, tipo, carpeta }) => {
      const url = `${this.baseURL}/${carpeta}/${file}`;
      let type = "unknown";
      let size = 0;
      let dimensions = null;

      try {
        const res = await fetch(url, { method: "HEAD" });
        type = res.headers.get("Content-Type") || "unknown";
        size = parseInt(res.headers.get("Content-Length") || "0", 10);
      } catch (err) {
        console.error(`❌ Error al obtener metadata de ${file}:`, err);
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

      // 🖼️ Si es imagen, obtener dimensiones
      if (tipo === "image") {
        try {
          const img = new Image();
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = () => {
              dimensions = `${img.naturalWidth}x${img.naturalHeight}`;
              resolve();
            };
            img.onerror = reject;
          });
        } catch (err) {
          console.warn(`⚠️ No se pudieron obtener dimensiones de ${file}:`, err);
        }
      }

      return {
        id: `${tipo}-${file}`,
        tipo,
        url,
        titulo: file,
        type,
        size,
        dimensions, // 👉 se agrega esta propiedad
      };
    });

    return Promise.all(promises);
  }
}

// Export por defecto
// src/utilities/mediaService.jsx
export class MediaService {
  constructor(baseURL = window.location.origin) {
    this.baseURL = baseURL;
  }


  async fetchAssets() {
    const images = ['image1.png', '01.jpg', '02.png', '03.jpg'];
    /* const videos = ['video1.mp4']; */
    const audios = ['audio1.mp3'];

    const mapToAsset = (arr, tipo, carpeta) =>
      arr.map((file) => ({
        id: `${tipo}-${file}`,
        tipo,
        url: `${this.baseURL}/${carpeta}/${file}`,
        titulo: file,
      }));

    return [
      ...mapToAsset(images, 'image', 'images'),
/*       ...mapToAsset(videos, 'video', 'videos'), */
      ...mapToAsset(audios, 'audio', 'audios'),
    ];
  }
}

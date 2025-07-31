// import { useState, useEffect, useMemo } from "react";
// import styles from "./HomePage.module.css";
// import AssetsPanel from "../components/AssetsPanel";
// import RequestPopup from "../components/RequestPopup";
// import { MediaService } from "../utilities/mediaService";
// import LoginAdminModal from "../components/LoginAdminModal";


// const HomePage = () => {
//   const [mediaAssets, setMediaAssets] = useState([]);
//   const [selectedAssets, setSelectedAssets] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);


//   const mediaService = useMemo(
//     () => new MediaService("http://localhost:3000"),
//     []
//   );

//   useEffect(() => {
//     mediaService
//       .fetchAssets()
//       .then((assets) => {
//         console.log("URLs cargadas:", assets.map((a) => a.url));
//         setMediaAssets(assets);
//       })
//       .catch((err) => console.error("Error al cargar assets:", err));
//   }, [mediaService]);

//   const handleSelect = (item) => {
//     setSelectedAssets((prev) => {
//       const exists = prev.some((a) => a.id === item.id);
//       return exists
//         ? prev.filter((a) => a.id !== item.id)
//         : [...prev, item];
//     });
//   };

//   const handleRemoveAsset = (id) => {
//     setSelectedAssets((prev) => prev.filter((a) => a.id !== id));
//   };

//   const handleSubmitRequest = async (formData) => {
//     const selected = new Date(formData.deadline).setHours(0, 0, 0, 0);
//     const startToday = new Date().setHours(0, 0, 0, 0);
//     if (selected < startToday) {
//       alert("La fecha límite no puede ser anterior a hoy.");
//       return;
//     }

//     const payload = {
//       requesterName: formData.name,
//       requesterEmail: formData.email,
//       assetType: formData.assetType,
//       purpose: formData.purpose,
//       deadline: formData.deadline,
//       items: selectedAssets.map((a) => a.id),
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:3000/test/requests",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (response.ok) {
//         alert("✅ Solicitud enviada");
//         setSelectedAssets([]);
//         setShowPopup(false);
//       } else {
//         alert("❌ Error al enviar");
//       }
//     } catch (error) {
//       alert("❌ Error de conexión");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <img src="/logo.jpg" alt="Logo" className={styles.logo} />
//         <button
//           className={styles.loginButton}
//           onClick={() => setShowLoginModal(true)}
//         >
//           Login Admin
//         </button>
//       </header>

//       <div className={styles.banner} />

//       <div className={styles.pageContent}>
//         <h1 className={styles.title}>Galería de medios</h1>
//         <AssetsPanel
//           assets={mediaAssets}
//           selectedIds={selectedAssets.map((a) => a.id)}
//           onSelect={handleSelect}
//         />
//       </div>
//         {showPopup && (
//       <div className={styles.popupWrapper}>
//         <RequestPopup
//           selectedAssets={selectedAssets}
//           onClose={() => setShowPopup(false)}
//           onRemoveAsset={handleRemoveAsset}
//           onSubmit={handleSubmitRequest}
//         />
//       </div>
//     )}

//     {/* 2) El carrito: */}
//     <div className={styles.cartContainer}>
//       <button
//         className={styles.cartButton}
//         onClick={() => setShowPopup((v) => !v)}
//       >
//         🛒 ({selectedAssets.length})
//       </button>
//       </div> 
//     {showLoginModal && (
//     <LoginAdminModal onClose={() => setShowLoginModal(false)} />
//     )}    
//     </div>
//   );
// };

// export default HomePage;


import { useState, useEffect, useMemo } from "react";
import styles from "./HomePage.module.css";
import AssetsPanel from "../components/antiguo/AssetsPanel";
import RequestPopup from "../components/antiguo/RequestPopup";
import LoginAdminModal from "../components/antiguo/LoginAdminModal";
import { MediaService } from "../utilities/mediaService";
import Header from "../components/Header";
import SplineBanner from "../components/Banner";
import Footer from "../components/Footer";
import PartnersBar from "../components/PartnersBar";
import FilterMenu from "../components/FilterMenu";
import Card from "../components/Gallery/Card";
import Gallery from "../components/Gallery/Gallery";


const HomePage = () => {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const mediaService = useMemo(
    () => new MediaService("http://localhost:3000"),
    []
  );

  useEffect(() => {
    mediaService
      .fetchAssets()
      .then((assets) => {
        console.log("URLs cargadas:", assets.map((a) => a.url));
        setMediaAssets(assets);
      })
      .catch((err) => console.error("Error al cargar assets:", err));
  }, [mediaService]);


  const handleSelect = (item) => {
    setSelectedAssets((prev) => {
      const exists = prev.some((a) => a.id === item.id);
      return exists
        ? prev.filter((a) => a.id !== item.id)
        : [...prev, item];
    });
  };

  const handleRemoveAsset = (id) => {
    setSelectedAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmitRequest = async (formData) => {
    const selected = new Date(formData.deadline).setHours(0, 0, 0, 0);
    const startToday = new Date().setHours(0, 0, 0, 0);
    if (selected < startToday) {
      alert("La fecha límite no puede ser anterior a hoy.");
      return;
    }

    const payload = {
      requesterName: formData.name,
      requesterEmail: formData.email,
      assetType: formData.assetType,
      purpose: formData.purpose,
      deadline: formData.deadline,
      items: selectedAssets.map((a) => a.id),
    };

    try {
      const response = await fetch("http://localhost:3000/test/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Solicitud enviada");
        setSelectedAssets([]);
        setShowPopup(false);
      } else {
        alert("❌ Error al enviar");
      }
    } catch (error) {
      alert("❌ Error de conexión");
    }
  };

return (
    <div className="min-h-screen flex flex-col bg-bg text-white">
      <Header onLoginClick={() => setShowLoginModal(true)} />

      {/* Contenido principal */}
      <SplineBanner />
      <PartnersBar />
      <FilterMenu />
      

      <main className="flex-grow px-20 py-10">

        <Gallery 
          assets={mediaAssets}
          selectedIds={selectedAssets.map((a) => a.id)}
          onSelect={handleSelect} />
      </main>

      {/* Carrito flotante */}
      <div className="fixed bottom-46 right-16 z-50">
        <button
          onClick={() => setShowPopup((v) => !v)}
          className="w-16 h-16 rounded-full bg-orange text-white text-xl shadow-lg hover:scale-105 transition"
        >
          🛒{selectedAssets.length > 0 && ` (${selectedAssets.length})`}
        </button>
      </div>

      {/* Popup de solicitud */}
      {showPopup && (
        <div className="fixed bottom-[240px] right-16 z-49">
          <RequestPopup
            selectedAssets={selectedAssets}
            onClose={() => setShowPopup(false)}
            onRemoveAsset={handleRemoveAsset}
            onSubmit={handleSubmitRequest}
          />
        </div>
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <LoginAdminModal onClose={() => setShowLoginModal(false)} />
      )}

      <Footer />
    </div>
  );
}
export default HomePage;




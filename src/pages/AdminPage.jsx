import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import styles from "./AdminPage.module.css";   // CSS Module
import AdminDashboard from "../components/antiguo/AdminDashboard";
import AssetsPanel     from "../components/antiguo/AssetsPanel";
import { MediaService } from "../utilities/mediaService";

const AdminPage = () => {
  const [requests, setRequests]       = useState([]);
  const [assetsCatalog, setAssetsCatalog] = useState([]);

  // 1) Igual que en HomePage: crea el service con el host de tu API
  const mediaService = useMemo(
    () => new MediaService("http://localhost:3000"),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 2) Carga solicitudes
        const { data: reqs } = await axios.get("http://localhost:3000/test/requests");
        setRequests(reqs);

        // 3) Carga assets desde el backend estático
        const assets = await mediaService.fetchAssets();
        console.log("Assets cargados en admin:", assets);
        setAssetsCatalog(assets);
      } catch (err) {
        console.error("Error al cargar datos en AdminPage:", err);
      }
    };
    fetchData();
  }, [mediaService]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/test/requests/${id}`, {
        status: newStatus,
        adminComments: newStatus === "Approved" ? "Aprobado" : "Rechazado",
      });
      const { data: updated } = await axios.get("http://localhost:3000/test/requests");
      setRequests(updated);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Panel del Administrador</h1>

      <AdminDashboard
        requests={requests}
        onUpdateStatus={updateStatus}
        assetsCatalog={assetsCatalog}
      />

      <hr className={styles.hr} />

      {/* Aquí ahora sí verás las imágenes/audio/video */}
      <AssetsPanel assets={assetsCatalog} />
    </div>
  );
};

export default AdminPage;


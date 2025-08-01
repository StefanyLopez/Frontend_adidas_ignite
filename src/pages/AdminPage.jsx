import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import styles from "./AdminPage.module.css";
import AdminDashboard from "../components/AdminDashboard";
import { MediaService } from "../utilities/mediaService";
// import { RequestsByDayChart } from "../components/RequestsDay";


const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [assetsCatalog, setAssetsCatalog] = useState([]);
  const today = new Date();
  const selectedYear = today.getFullYear();
  const selectedMonth = today.getMonth();


  const mediaService = useMemo(
    () => new MediaService("http://localhost:3000"),
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: reqs } = await axios.get(
          "http://localhost:3000/test/requests"
        );
        setRequests(reqs);

        const assets = await mediaService.fetchAssets();
        setAssetsCatalog(assets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [mediaService]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3000/test/requests/${id}`,
        {
          status: newStatus,
          adminComments: newStatus === "Approved" ? "Aprobado" : "Rechazado",
        }
      );
      const { data } = await axios.get(
        "http://localhost:3000/test/requests"
      );
      setRequests(data);
    } catch (error) {
      console.error(error);
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

      <div className={styles.mediaSummaryContainer}>
        {[
          { label: "Imágenes", type: "image" },
          { label: "Videos", type: "video" },
          { label: "Audios", type: "audio" },
        ].map(({ label, type }) => {
          const count = assetsCatalog.filter((a) =>
            a.type.toLowerCase().includes(type)
          ).length;
          return (
            <div key={type} className={styles.mediaCard}>
              <div className={styles.mediaContent}>
                <div className={styles.mediaCount}>{count}</div>
                <div className={styles.mediaLabel}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>

        <h2>Tabla de Archivos Multimedia</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Nombre</th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Tipo</th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Tamaño</th>
            </tr>
          </thead>
          <tbody>
            {assetsCatalog.map((asset) => (
              <tr key={asset.id}>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{asset.titulo}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{asset.type}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {asset.size < 1024
                    ? `${asset.size} B`
                    : asset.size < 1024 * 1024
                    ? `${(asset.size / 1024).toFixed(1)} KB`
                    : `${(asset.size / (1024 * 1024)).toFixed(1)} MB`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


      <hr className={styles.hr} />
    </div>
  );
};

export default AdminPage;




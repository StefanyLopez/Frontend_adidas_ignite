import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import AdminDashboard from "../components/AdminDashboard";
import { MediaService } from "../utilities/mediaService";
import { requestsbyDay } from "../components/grouprequest";


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
    <div className="">
      <h1 className="">Panel del Administrador</h1>

      <AdminDashboard
        requests={requests}
        onUpdateStatus={updateStatus}
        assetsCatalog={assetsCatalog}
      />

      <hr className="" />

      <div className="">
        {[
          { label: "Imágenes", type: "image" },
          { label: "Videos", type: "video" },
          { label: "Audios", type: "audio" },
        ].map(({ label, type }) => {
          const count = assetsCatalog.filter((a) =>
            a.type.toLowerCase().includes(type)
          ).length;
          return (
            <div key={type} className="">
              <div className="">
                <div className="">{count}</div>
                <div className="">{label}</div>
              </div>
            </div>
          );
        })}
      </div>

        <h2>Tabla de Archivos Multimedia</h2>
        <table className="">
          <thead>
            <tr className=""  >
              <th className="">Nombre</th>
              <th className="">Tipo</th>
              <th className="">Tamaño</th>
            </tr>
          </thead>
          <tbody>
            {assetsCatalog.map((asset) => (
              <tr key={asset.id}>
                <td className="">{asset.titulo}</td>
                <td className="">{asset.type}</td>
                <td className="">
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


      <hr className="" />
    </div>
  );
};

export default AdminPage;




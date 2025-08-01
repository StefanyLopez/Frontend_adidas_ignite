import React, { useState } from "react";
import AssetModal from "./AssetModal";

const formatIsoDate = (iso) => {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${parseInt(month, 10)}/${year}`;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const cellStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
};

const AdminDashboard = ({ requests, onUpdateStatus, assetsCatalog }) => {
  const [modalAssets, setModalAssets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const getArchivosReq = (ids) =>
    Array.isArray(ids)
      ? assetsCatalog.filter((asset) => ids.includes(asset.id))
      : [];

  const openModal = (ids) => {
    setModalAssets(getArchivosReq(ids));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAssets([]);
  };

  return (
    <div>
      <h2>Solicitudes de Usuarios</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Usuario</th>
            <th>Email</th>
            <th>Descripción</th>
            <th>Fecha solicitud</th>
            <th>Fecha límite</th>
            <th>Estado</th>
            <th>Archivos asociados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const count = Array.isArray(req.items) ? req.items.length : 0;
            return (
              <tr key={req.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{req.requesterName}</td>
                <td>{req.requesterEmail}</td>
                <td>{req.purpose}</td>
                <td>
                  {new Date(req.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{formatIsoDate(req.deadline)}</td>
                <td>{req.status}</td>
                <td>
                  {count > 0 ? (
                    <button
                      onClick={() => openModal(req.items)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      {count} archivo{count > 1 ? "s" : ""}
                    </button>
                  ) : (
                    <em>No hay archivos</em>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => onUpdateStatus(req.id, "Approved")}
                    style={approveBtn}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onUpdateStatus(req.id, "Rejected")}
                    style={rejectBtn}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <AssetModal assets={modalAssets} onClose={closeModal} />
      )}
    </div>
  );
};

const approveBtn = {
  background: "#4caf50",
  color: "#fff",
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  marginRight: "0.5rem",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#f44336",
  color: "#fff",
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AdminDashboard;




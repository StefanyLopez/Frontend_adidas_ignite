import React, { useState } from "react";
import AssetModal from "../Antiguo/AssetModal.jsx";


const formatIsoDate = (iso) => {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${parseInt(month, 10)}/${year}`;
};

const AdminDashboard = ({ requests, onUpdateStatus, assetsCatalog }) => {
  const [ventarch, setVentarch] = useState([]);
  const [ventavisi, setVentavisi] = useState(false);

  const getArchivosReq = (ids) => {
    if (!Array.isArray(ids)) return [];
    return assetsCatalog.filter((asset) => ids.includes(asset.id));
  };

  const abrirVen = (items) => {
    const archivos = getArchivosReq(items);
    setVentarch(archivos);
    setVentavisi(true);
  };

  const cerrarVen = () => {
    setVentavisi(false);
    setVentarch([]);
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
            const numArchivos = Array.isArray(req.items) ? req.items.length : 0;
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
                  {numArchivos > 0 ? (
                    <button
                      onClick={() => abrirVen(req.items)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      {numArchivos} archivo{numArchivos > 1 ? "s" : ""}
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

      {ventavisi && (
        <AssetModal assets={ventarch} onClose={cerrarVen} />
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


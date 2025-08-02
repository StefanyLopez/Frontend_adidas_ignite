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
  <div className="w-full">

    {/* Contenedor de la tabla */}
    <div className="bg-bg rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-black/30 border-b border-white/10">
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                USUARIO
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                EMAIL
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                DESCRIPCIÓN
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                FECHA SOLICITUD
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                FECHA LÍMITE
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                ESTADO
              </th>
              <th className="text-left py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                ARCHIVOS
              </th>
              <th className="text-center py-4 px-4 font-bebas text-white text-sm lg:text-base tracking-wider">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const count = Array.isArray(req.items) ? req.items.length : 0;
              
              // Determinar color del estado
              const getStatusStyle = (status) => {
                switch (status?.toLowerCase()) {
                  case 'approved':
                  case 'aprobado':
                    return 'bg-green-900/50 text-green-200 border-green-500/50';
                  case 'rejected':
                  case 'rechazado':
                    return 'bg-red-900/50 text-red-200 border-red-500/50';
                  case 'pending':
                  case 'pendiente':
                    return 'bg-yellow-900/50 text-yellow-200 border-yellow-500/50';
                  case 'in progress':
                  case 'en progreso':
                    return 'bg-blue-900/50 text-blue-200 border-blue-500/50';
                  default:
                    return 'bg-gray-900/50 text-gray-200 border-gray-500/50';
                }
              };

              return (
                <tr 
                  key={req.id}
                  className={`
                    border-b border-white/5 hover:bg-white/5 transition-colors duration-200
                    ${index % 2 === 0 ? 'bg-black/10' : 'bg-transparent'}
                  `}
                >
                  {/* Usuario */}
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange font-bebas text-sm">
                          {req.requesterName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="font-adi text-white text-sm">
                        {req.requesterName}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 font-adi text-white/70 text-sm">
                    {req.requesterEmail}
                  </td>

                  {/* Descripción */}
                  <td className="py-4 px-4 font-adi text-white text-sm max-w-xs">
                    <div className="truncate" title={req.purpose}>
                      {req.purpose}
                    </div>
                  </td>

                  {/* Fecha solicitud */}
                  <td className="py-4 px-4 font-adi text-white/70 text-sm">
                    {new Date(req.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  {/* Fecha límite */}
                  <td className="py-4 px-4 font-adi text-white/70 text-sm">
                    {formatIsoDate(req.deadline)}
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-4">
                    <span className={`
                      inline-flex px-3 py-1 rounded-full text-xs font-medium border
                      ${getStatusStyle(req.status)}
                    `}>
                      {req.status}
                    </span>
                  </td>

                  {/* Archivos */}
                  <td className="py-4 px-4">
                    {count > 0 ? (
                      <button
                        onClick={() => openModal(req.items)}
                        className="inline-flex items-center px-3 py-1 bg-orange/20 hover:bg-orange/30 text-orange border border-orange/50 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                      >
                        📁 {count} archivo{count > 1 ? "s" : ""}
                      </button>
                    ) : (
                      <span className="text-white/40 italic text-sm">
                        No hay archivos
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => onUpdateStatus(req.id, "Approved")}
                        className="px-3 py-1 bg-green-900/50 hover:bg-green-800/70 text-green-200 border border-green-500/50 rounded-lg transition-all duration-200 hover:scale-105 text-xs font-medium min-w-[70px]"
                      >
                        ✅ Aprobar
                      </button>
                      <button
                        onClick={() => onUpdateStatus(req.id, "Rejected")}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800/70 text-red-200 border border-red-500/50 rounded-lg transition-all duration-200 hover:scale-105 text-xs font-medium min-w-[70px]"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Estado vacío */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-white/50 font-adi mb-2">No hay solicitudes disponibles</p>
          <p className="text-white/30 font-adi text-sm">Las nuevas solicitudes aparecerán aquí</p>
        </div>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <AssetModal assets={modalAssets} onClose={closeModal} />
    )}
  </div>
);

};
export default AdminDashboard;




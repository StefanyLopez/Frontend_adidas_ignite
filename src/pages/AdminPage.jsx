import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MediaService } from "../utilities/mediaService";
import AssetModal from "../components/AssetModal";
import admindashboard from "../components/AdminDashboard";
import { requestsbyDay } from "../components/grouprequest";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardAssetsModal from "../components/DashboardAssetsModal";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [assetsCatalog, setAssetsCatalog] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requestsPage, setRequestsPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAssets, setModalAssets] = useState([]);
  
  const today = new Date();
  const selectedYear = today.getFullYear();
  const selectedMonth = today.getMonth();
  const itemsPerPage = 10;

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

  const formatIsoDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openModal = (assets) => {
    setModalAssets(assets);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAssets([]);
  };

  // Paginación para requests
  const totalRequestsPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice(
    (requestsPage - 1) * itemsPerPage,
    requestsPage * itemsPerPage
  );

  // Paginación para inventory
  const totalInventoryPages = Math.ceil(assetsCatalog.length / itemsPerPage);
  const paginatedAssets = assetsCatalog.slice(
    (inventoryPage - 1) * itemsPerPage,
    inventoryPage * itemsPerPage
  );

  // Datos para dashboard (últimos 5)
  const recentRequests = requests.slice(0, 5);
  const recentAssets = assetsCatalog.slice(0, 5);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'requests', name: 'Requests', icon: '📋' },
    { id: 'inventory', name: 'Inventory', icon: '📁' }
  ];

  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-bg border border-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
      >
        ← Anterior
      </button>
      
      <div className="flex space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
              currentPage === page
                ? 'bg-orange text-white'
                : 'bg-bg border border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-bg border border-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
      >
        Siguiente →
      </button>
    </div>
  );

  const RequestsTable = ({ requests: requestsData, showPagination = false }) => (
    <div className="bg-bg rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-orange border-b border-white/10">
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                USUARIO
              </th>
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                EMAIL
              </th>
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                DESCRIPCIÓN
              </th>
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                FECHA SOLICITUD
              </th>
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                ESTADO
              </th>
              <th className="text-left py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                ARCHIVOS
              </th>
              <th className="text-center py-4 px-4 font-adi text-white text-sm lg:text-base tracking-wider">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {requestsData.map((req, index) => {
              const count = Array.isArray(req.items) ? req.items.length : 0;
              
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
                  <td className="py-4 px-4 font-adi text-white/70 text-sm">
                    {req.requesterEmail}
                  </td>
                  <td className="py-4 px-4 font-adi text-white text-sm max-w-xs">
                    <div className="truncate" title={req.purpose}>
                      {req.purpose}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-adi text-white/70 text-sm">
                    {new Date(req.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`
                      inline-flex px-3 py-1 rounded-full text-xs font-medium border
                      ${getStatusStyle(req.status)}
                    `}>
                      {req.status}
                    </span>
                  </td>
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
                  <td className="py-4 px-4">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => updateStatus(req.id, "Approved")}
                        className="px-3 py-1 bg-green-900/50 hover:bg-green-800/70 text-green-200 border border-green-500/50 rounded-lg transition-all duration-200 hover:scale-105 text-xs font-medium"
                      >
                        ✅ Aprobar
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "Rejected")}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800/70 text-red-200 border border-red-500/50 rounded-lg transition-all duration-200 hover:scale-105 text-xs font-medium"
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
      
      {requestsData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-white/50 font-adi">No hay solicitudes disponibles</p>
        </div>
      )}
    </div>
  );

  const InventoryTable = ({ assets, onAssetClick = null }) => (
  <div className="bg-bg rounded-xl shadow-2xl border border-white/10 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-orange border-b border-white/10">
            <th className="text-left py-4 px-6 font-adi text-white text-lg tracking-wider">
              NOMBRE
            </th>
            <th className="text-left py-4 px-6 font-adi text-white text-lg tracking-wider">
              TIPO
            </th>
            <th className="text-left py-4 px-6 font-adi text-white text-lg tracking-wider">
              TAMAÑO
            </th>
            {onAssetClick && (
              <th className="text-center py-4 px-6 font-adi text-white text-lg tracking-wider">
                ACCIÓN
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr 
              key={asset.id}
              className={`
                border-b border-white/5 hover:bg-white/5 transition-colors duration-200
                ${index % 2 === 0 ? 'bg-black/10' : 'bg-transparent'}
                ${onAssetClick ? 'cursor-pointer' : ''}
              `}
              onClick={onAssetClick ? () => onAssetClick(asset) : undefined}
            >
              <td className="py-4 px-6 font-adi text-white">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">
                      {asset.tipo?.includes("image") ? "🖼️" : 
                       asset.tipo?.includes("video") ? "🎬" : 
                       asset.tipo?.includes("audio") ? "🎵" : "📄"}
                    </span>
                  </div>
                  {asset.titulo}
                </div>
              </td>
              <td className="py-4 px-6">
                <span className={`
                  inline-flex px-3 py-1 rounded-full text-xs font-medium
                  ${asset.type.toLowerCase().includes('image') ? 'bg-blue-900/50 text-blue-200' : ''}
                  ${asset.type.toLowerCase().includes('video') ? 'bg-purple-900/50 text-purple-200' : ''}
                  ${asset.type.toLowerCase().includes('audio') ? 'bg-green-900/50 text-green-200' : ''}
                `}>
                  {asset.type}
                </span>
              </td>
              <td className="py-4 px-6 font-adi text-white/70">
                {asset.size < 1024
                  ? `${asset.size} B`
                  : asset.size < 1024 * 1024
                  ? `${(asset.size / 1024).toFixed(1)} KB`
                  : `${(asset.size / (1024 * 1024)).toFixed(1)} MB`}
              </td>
              {onAssetClick && (
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssetClick(asset);
                    }}
                    className="px-3 py-1 bg-orange/20 hover:bg-orange/30 text-orange border border-orange/50 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                  >
                    👁️ Ver
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {assets.length === 0 && (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <p className="text-white/50 font-adi">No hay archivos disponibles</p>
      </div>
    )}
  </div>
);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            

            {/* Últimas solicitudes */}
            <div>
              <h3 className="text-3xl font-bebas text-white tracking-wider mb-4">
                ÚLTIMAS SOLICITUDES
              </h3>
              <RequestsTable requests={recentRequests} />
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: "Imágenes", type: "image", icon: "🖼️" },
                { label: "Videos", type: "video", icon: "🎥" },
                { label: "Audios", type: "audio", icon: "🎵" },
              ].map(({ label, type, icon }) => {
                const count = assetsCatalog.filter((a) =>
                  a.type.toLowerCase().includes(type)
                ).length;
                
                return (
                  <div 
                    key={type} 
                    className="bg-bg rounded-xl p-6 shadow-2xl border border-white/10 hover:border-orange/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl text-orange font-adi p-6">{icon}  {label}</span>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-bebas text-orange tracking-wider">
                          {count}
                        </div>
                        <div className="text-white/70 font-adi text-sm">
                          
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange to-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((count / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Últimos archivos */}
            <div>
              <h3 className="text-3xl font-bebas text-white tracking-wider mb-4">
                ÚLTIMOS ARCHIVOS SUBIDOS
              </h3>
              <InventoryTable assets={recentAssets} onAssetClick={openIndividualModal} />
            </div>
          </div>
        );

      case 'requests':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bebas text-white tracking-wider">
                TODAS LAS SOLICITUDES
              </h3>
              <span className="text-white/70 font-adi">
                Total: {requests.length} solicitudes
              </span>
            </div>
            <RequestsTable requests={paginatedRequests} showPagination={true} />
            {totalRequestsPages > 1 && (
              <Pagination
                currentPage={requestsPage}
                totalPages={totalRequestsPages}
                onPageChange={setRequestsPage}
              />
            )}
          </div>
        );

      case 'inventory':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bebas text-white tracking-wider">
                INVENTARIO COMPLETO
              </h3>
              <span className="text-white/70 font-adi">
                Total: {assetsCatalog.length} archivos
              </span>
            </div>
            <InventoryTable assets={paginatedAssets} />
            {totalInventoryPages > 1 && (
              <Pagination
                currentPage={inventoryPage}
                totalPages={totalInventoryPages}
                onPageChange={setInventoryPage}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#171717' }}>
      <Header onLoginClick={() => setShowLoginModal(true)} />

      <div className="flex-1 flex">
        {/* Sidebar de navegación */}
        <div className="w-64 bg-bg border-r border-white/10 p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bebas text-white tracking-wider">
              ADMIN PANEL
            </h1>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-orange text-white shadow-lg scale-105' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-adi">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <requestsbyDay/>

        {/* Contenido principal */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bebas text-white tracking-wider mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name.toUpperCase()}
            </h1>
            <p className="text-white/70 font-adi">
              {activeTab === 'dashboard' && 'Resumen general del sistema'}
              {activeTab === 'requests' && 'Gestiona todas las solicitudes de usuarios'}
              {activeTab === 'inventory' && 'Explora todos los archivos multimedia'}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      <Footer />

      {isModalOpen && (
        <DashboardAssetsModal
          assets={modalAssets} 
          assetsCatalog={assetsCatalog}
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default AdminPage;
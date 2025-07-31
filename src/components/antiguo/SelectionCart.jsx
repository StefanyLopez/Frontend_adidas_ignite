// Componente que muestra los archivos seleccionados antes de enviar la solicitud
export default function SelectionCart({ assets, onRemoveAsset, onContinue }) {
  return (
    <div className="selection-cart">
      <h2>🧺 Tu Selección</h2>

      {assets.length === 0 ? (
        <p>No has seleccionado ningún activo.</p>
      ) : (
        <>
          <ul className="selected-list">
            {assets.map((item) => {
              const tipo = (item.tipo || item.type)?.toLowerCase() ?? "";
              const nombre = item.titulo || item.name || "Archivo sin nombre";

              return (
                <li key={item.id} className="selected-item">
                  <span className="asset-icon">
                    {tipo === "image" ? "📷" :
                     tipo === "video" ? "📹" :
                     tipo === "audio" ? "🔉" : "❓"}
                  </span>

                  <span className="asset-name">{nombre}</span>

                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveAsset(item.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </li>
              );
            })}
          </ul>

          <button 
            className="continue-btn primary"
            onClick={onContinue}
          >
            Continuar a Solicitud →
          </button>
        </>
      )}
    </div>
  );
}

import React from "react";

const hmedios = "200px";
const estilomedios = {
  width: "100%",
  height: hmedios,
  objectFit: "cover",
  borderRadius: "4px",
};

const defaultimga = "/default-audio.jpg";

const AssetsPanel = ({ assets = [], selectedIds = [], onSelect = () => {} }) => {
  return (
    <div style={{ padding: "1rem", backgroundColor: "#121212", color: "white" }}>
      <h2 style={{ marginBottom: "1rem" }}>Archivos Multimedia</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        {assets.length > 0 ? (
          assets.map((item) => {
            const tipo = (item.tipo || item.type)?.toLowerCase() ?? "";
            const url = item.url ?? "";
            const titulo = item.titulo || item.name;
            const seleccionado = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  width: "100%",
                  height: hmedios,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  boxShadow: seleccionado ? "0 0 0 2px #00ffcc" : "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
                onClick={() => onSelect(item)}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "#000000aa",
                    color: "#ccc",
                    padding: "0.3rem",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {titulo}
                </div>

                {tipo.includes("image") && url && (
                  <img src={url} alt={titulo} style={estilomedios} />
                )}

                {tipo.includes("video") && url && (
                  <video controls style={estilomedios}>
                    <source src={url} type="video/mp4" />
                  </video>
                )}

                {tipo.includes("audio") && url && (
                  <div style={{ position: "relative", width: "100%", height: hmedios }}>
                    <img src={defaultimga} alt="Audio Preview" style={estilomedios} />
                    <audio
                      controls
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "#121212cc",
                      }}
                    >
                      <source src={url} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No hay archivos disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssetsPanel;


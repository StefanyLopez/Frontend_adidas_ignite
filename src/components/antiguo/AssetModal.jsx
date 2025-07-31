const AssetModal = ({ assets, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Assets seleccionados</h3>
        <ul className="mb-4 list-disc pl-5">
          {assets.map((asset, i) => (
            <li key={i}>{asset.name}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-orange hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AssetModal;

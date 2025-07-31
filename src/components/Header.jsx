export default function Header({ onLoginClick }) {
  return (
    <header className="flex justify-between items-center px-20 py-4 bg-bg w-full">
      <img
        src="../logos/adidas.png"
        alt="Logo"
        className="h-20 object-contain"
      />
      <button
        onClick={onLoginClick}
        className="px-4 py-2 font-adi text-lg tracking-wide bg-bg text-white border-2 
        border-orange transition-all duration-300 hover:bg-orange hover:text-white"
      >
        Login Admin
      </button>
    </header>
  );
}

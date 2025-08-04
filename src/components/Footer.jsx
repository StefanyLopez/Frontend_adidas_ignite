export default function Footer() {
  // Render the footer
  return (
    // Footer component
    <footer className="flex justify-between items-center px-20 py-4 bg-bg border-t-2 border-orange">
      <img // Logo
        src="../logos/adidas.png"
        alt="Logo"
        className="h-30 object-contain p-4"
      />
      {/* Footer text with current year and authors */}
      <p className="text-orange font-adi text-md">
        © {new Date().getFullYear()} Daniel Colmenares - Stefany López | All
        Rights Reserved
      </p>
    </footer>
  );
}

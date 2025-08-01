import Button from "./Button";

export default function Header({ onLoginClick }) {
  return (
    <header className="flex justify-between items-center px-20 py-4 bg-bg w-full">
      <img
        src="../logos/adidas.png"
        alt="Logo"
        className="h-20 object-contain"
      />
      <Button text="Login" filled={false} onClick={() => setVisibleCount((prev) => prev + 8)} />
    </header>
  );
}

import { useNavigate, Link } from "react-router-dom";
import Button from "./Button";

export default function Header({ onLoginClick }) {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-20 py-4 bg-bg w-full">
      <Link to="/"> <img src="../logos/adidas.png" alt="Logo" className="h-20 object-contain cursor-pointer" /> </Link>
      <Button text="Login" filled={false} onClick={() => navigate("/Login")} />
    </header>
  );
}

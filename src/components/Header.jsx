// Import navigation hooks and Link component from react-router-dom for routing
import { useNavigate, Link } from "react-router-dom"; 
import Button from "./Button"; //Custom button component

// Header component
export default function Header({}) {
  const navigate = useNavigate(); // Hook to navigate

  // Render the header
  return (
    <header className="flex justify-between items-center px-20 py-4 bg-bg w-full">
      {/* Logo with link to home */}
      <Link to="/"> <img src="../logos/adidas.png" alt="Logo" className="h-20 object-contain cursor-pointer" /> </Link>
      {/* Navigation button to Login page*/}
      <Button text="Login" onClick={() => navigate("/Login")} /> 
    </header>
  );
}

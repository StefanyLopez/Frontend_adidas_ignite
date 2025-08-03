import { motion } from "framer-motion"; // Import Framer Motion for animations
import ButtonShape from "../assets/Vector_3.svg?react"; // Import  SVG as a React component

// component for the button
const Button = ({ text = "LOGIN", icon, onClick, disabled = false }) => {
  return ( // Button component with Framer Motion animations
    // Main button container with hover effect
    <motion.button
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      disabled={disabled} // Disable button if disabled prop is true
      className="font-bebas relative group w-fit flex items-center justify-center gap-2 px-6"
    >
      {/* SVG back */}
      <motion.div
        className="absolute top-2 left-4 rotate-0 transition-transform duration-300 group-hover:rotate-4"
      >
        <ButtonShape className="stroke-orange w-52 h-auto" />
      </motion.div>

      {/* SVG front */}
      <motion.div
        className="absolute top-0 left-0 transition-colors duration-300"
      >
        <ButtonShape className="stroke-white fill-bg group-hover:fill-orange w-52 h-auto " />
      </motion.div>

      {/* Button content */}
      <div className="relative z-10 flex items-center gap-2 px-10 py-6 text-white font-bold text-xl">
        <span>{icon}</span>
        <span>{text}</span>
      </div>
    </motion.button>
  );
};

export default Button;

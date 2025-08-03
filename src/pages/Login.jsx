import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginAdminModal = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Form input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Alert notification states
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success", "error", "warning"

  // Show alert notification with auto-hide functionality
  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    // Auto-hide alert after 4 seconds
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 4000);
  };

  // Email validation using regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle admin login authentication
  const handleSignIn = async () => {
    // Validate email format before API call
    if (!isValidEmail(email)) {
      showAlert("⚠️ Please enter a valid email address", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/test/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert("✅ Successful login", "success");
        // Navigate to admin panel after successful login
        setTimeout(() => navigate("/admin"), 1000);
      } else if (response.status === 401) {
        showAlert("❌ Unauthorized user. Please verify your credentials.", "error");
      } else if (response.status === 400) {
        showAlert("❌ User not found", "error");
      } else if (response.status >= 500) {
        showAlert("❌ Server error. Please try again later.", "error");
      } else {
        showAlert(`❌ Unexpected error: ${data.message ?? "No message"}`, "error");
      }

      console.error("Login error:", data);
    } catch (error) {
      // Network or connection errors
      showAlert("❌ Could not connect to the server", "error");
      console.error("Connection failed:", error);
    }
  };

  // Handle creating new admin user
  const handleCreateUser = async () => {
    // Validate email format before API call
    if (!isValidEmail(email)) {
      showAlert("⚠️ Please enter a valid email address", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/test/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        showAlert("✅ User created successfully", "success");
        // Close modal after successful user creation
        setTimeout(() => onClose(), 2000);
      } else {
        const errorResult = await response.text();
        showAlert("❌ Error creating user", "error");
        console.error("Creation error:", errorResult);
      }
    } catch (error) {
      // Network or connection errors
      showAlert("❌ Server connection error", "error");
      console.error("Connection error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onLoginClick={() => setShowLoginModal(true)} />

      {/* Main login container with background */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8 relative" style={{ backgroundColor: '#171717d8' }}>
        
        {/* Responsive background image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/loginbg.png" 
            alt="Background decoration" 
            className="w-80 h-20 sm:w-96 md:w-450 md:h-100 object-contain filter sm:translate-y-[135px]"
          />
        </div>

        {/* Responsive login container */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-md lg:max-w-none">
          
          {/* Responsive login card */}
          <div className="relative bg-bg font-bebas text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 w-full min-h-[450px] sm:min-h-[500px] lg:w-145 lg:h-170 flex flex-col items-center justify-center gap-6 sm:gap-8 tracking-wider shadow-2xl">

            {/* Logo */}
            <img src="../logos/adidas.png" alt="Logo" className="h-16 sm:h-20 lg:h-24 object-contain" />

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center">ADMIN LOGIN</h1>

            {/* Form inputs */}
            <div className="w-full space-y-4 sm:space-y-6 px-2 sm:px-0">
              <input
                type="text"
                placeholder="Email"
                className="w-full bg-transparent border-2 border-white/40 px-4 py-2 sm:px-6 sm:py-3 font-adi text-sm sm:text-base text-white skew-x-[30deg] placeholder-white/70 focus:outline-none focus:border-orange focus:border-2 transition-all duration-300 hover:border-white/60 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-2 border-white/40 px-4 py-2 sm:px-6 sm:py-3 font-adi text-sm sm:text-base text-white skew-x-[30deg] placeholder-white/70 focus:outline-none focus:border-orange focus:border-2 transition-all duration-300 hover:border-white/60 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 sm:space-y-4">
              {/* Sign in button */}
              <div className="flex justify-center translate-x-0 translate-x-[-30px]">
                <Button text="Sign In" filled={true} onClick={handleSignIn} />
              </div>
              {/* Create user button */}
              <div className="flex justify-center">
                <Button text="Create User" filled={false} onClick={handleCreateUser} />
              </div>
            </div>
          </div>

          {/* Responsive alert area */}
          {alertMessage && (
            <div className="mt-4 sm:mt-6 w-full max-w-md lg:w-145 animate-fade-in px-2 sm:px-0">
              <div className={`
                px-4 py-3 sm:px-6 sm:py-4 rounded-lg border-l-4 shadow-lg text-sm sm:text-base
                ${alertType === 'success' ? 'bg-green-900/90 border-green-400 text-green-100' : ''}
                ${alertType === 'error' ? 'bg-red-900/90 border-red-400 text-red-100' : ''}
                ${alertType === 'warning' ? 'bg-yellow-900/90 border-yellow-400 text-yellow-100' : ''}
                backdrop-blur-sm
              `}>
                <p className="font-medium text-center">{alertMessage}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />

      {/* CSS animation for alert fade-in effect */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginAdminModal;
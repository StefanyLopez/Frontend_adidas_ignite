import Spline from "@splinetool/react-spline"; // Import Spline component

// This component renders a full-screen Spline scene
export default function SplineBanner() {
  return (
    // Full-screen Spline scene
    <div className=" top-0 left-0 w-screen h-screen z-51">
      {/* Spline scene with the specific URL */}
      <Spline scene="https://prod.spline.design/ZB5mcEV5ARwPm8x8/scene.splinecode" />
    </div>
  );
}

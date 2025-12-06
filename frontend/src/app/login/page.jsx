import LoginComponent from "../components/login";

export default function LoginPage() {
  const overlayColor = "rgba(10, 10, 10, 0.75)";

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-[#0a0a0a] font-mono"
      style={{
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <LoginComponent />
    </div>
  );
}

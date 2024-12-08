import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/userContext";
import { Toaster } from "@/components/ui/toaster";
import Loading from "@/components/common/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_HOST}/health`);
        if (response.ok) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Backend is not ready:", error);
        setTimeout(checkBackendStatus, 5000); // Retry after 3 seconds
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <StrictMode>
      {isLoading ? (
        <Loading />
      ) : (
        <UserProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}
            onScriptLoadError={(error) => {
              console.error("Google Script Load Error:", error);
            }}
          >
            <RouterProvider router={router} />
            <Toaster />
          </GoogleOAuthProvider>
        </UserProvider>
      )}
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);

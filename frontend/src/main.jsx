import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/userContext";
import { Toaster } from "@/components/ui/toaster";
import HealthCheck from "./components/common/HealthCheck";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider 
          clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}
          onScriptLoadError={(error) => {
              console.error('Google Script Load Error:', error);
          }}
      >
        <RouterProvider router={router} />
        <Toaster />
        <HealthCheck />
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>
);

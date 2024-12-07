import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/userContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <RouterProvider router={router}></RouterProvider>
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>
);
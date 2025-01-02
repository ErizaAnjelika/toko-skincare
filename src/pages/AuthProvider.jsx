import { createContext, useContext } from "react";

// Membuat context untuk otentikasi
const AuthContext = createContext();

// Komponen provider untuk AuthContext
export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

// Hook untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const userInfo = JSON.parse(localStorage.getItem("user-info"));

// ProtectedRoute untuk melindungi akses ke halaman tertentu
export const ProtectedRoute = ({ children }) => {
  if (!userInfo) {
    window.location.href = "/login"; // Jika tidak ada userInfo, arahkan ke halaman login
    return null; // Jangan tampilkan children jika ada redirect
  }

  return children;
};

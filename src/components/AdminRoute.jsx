import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // se não existe user, bloqueia
  if (!user) return <Navigate to="/" />;

  // se não for admin, bloqueia
  if (user.tipo !== "admin") return <Navigate to="/home" />;

  // autorizado
  return children;
}

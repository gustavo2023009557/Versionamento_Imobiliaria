import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../views/Login";
import Home from "../views/Home";
import PrivateRoute from "../components/PrivateRoute";

import VerImoveis from "../views/VerImoveis";
import CadastrarImoveis from "../views/CadastrarImoveis";
import EditarImoveis from "../views/EditarImoveis";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/imoveis"
          element={
            <PrivateRoute>
              <VerImoveis />
            </PrivateRoute>
          }
        />

        <Route
          path="/imoveis/cadastrar"
          element={
            <PrivateRoute>
              <CadastrarImoveis />
            </PrivateRoute>
          }
        />

        <Route
          path="/imoveis/editar"
          element={
            <PrivateRoute>
              <EditarImoveis />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

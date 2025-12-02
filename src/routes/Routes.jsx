import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../views/Login";
import Home from "../views/Home";
import PrivateRoute from "../components/PrivateRoute";

import VerImoveis from "../views/VerImoveis";
import VerMeusImoveis from "../views/VerMeusImoveis";
import ImovelDetalhes from "../views/ImovelDetalhes";
import CadastrarImoveis from "../views/CadastrarImoveis";
import EditarImoveis from "../views/EditarImoveis";
import ListarImoveis from "../views/ListarImoveis";
import DeletarImovel from "../views/DeletarImovel";

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

        <Route path="/imoveis" element={<VerImoveis />} />
        <Route path="/imoveis/:id" element={<ImovelDetalhes />} />

        <Route
          path="/imoveis/cadastrar"
          element={
            <PrivateRoute>
              <CadastrarImoveis />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/imoveis/meus_imoveis"
          element={
            <PrivateRoute>
              <VerMeusImoveis />
            </PrivateRoute>
          }
        />

        <Route
          path="/imoveis/listar"
          element={
            <PrivateRoute>
              <ListarImoveis />
            </PrivateRoute>
          }
        />

        <Route
          path="/imoveis/editar/:id"
          element={
            <PrivateRoute>
              <EditarImoveis />
            </PrivateRoute>
          }
        />
        <Route
          path="/imoveis/deletar"
          element={
            <PrivateRoute>
              <DeletarImovel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

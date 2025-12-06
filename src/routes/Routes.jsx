import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../views/Login";
import Home from "../views/Home";
import PrivateRoute from "../components/PrivateRoute";
import AdminRoute from "../components/AdminRoute";

import VerImoveis from "../views/imovel/VerImoveis";
import VerMeusImoveis from "../views/imovel/VerMeusImoveis";
import ImovelDetalhes from "../views/imovel/ImovelDetalhes";
import CadastrarImoveis from "../views/imovel/CadastrarImoveis";
import EditarImoveis from "../views/imovel/EditarImoveis";
import ListarImoveis from "../views/imovel/ListarImoveis";
import DeletarImovel from "../views/imovel/DeletarImovel";
import VerBairros from "../views/bairro/VerBairros";
import CadastrarBairro from "../views/bairro/CadastrarBairro";
import EditarBairro from "../views/bairro/EditarBairro";
import DeletarBairro from "../views/bairro/DeletarBairro";

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
        <Route
          path="/bairros"
          element={

            <PrivateRoute>
              <AdminRoute>

                <VerBairros />

              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bairros/cadastrar"
          element={

            <PrivateRoute>
              <AdminRoute>

                <CadastrarBairro />

              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bairros/editar/:id"
          element={

            <PrivateRoute>
              <AdminRoute>

                <EditarBairro />

              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bairros/deletar"
          element={

            <PrivateRoute>
              <AdminRoute>

                <DeletarBairro />

              </AdminRoute>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bem-vindo, {user.nome}!</h1>

      <p><b>Email:</b> {user.email}</p>
      <p><b>Tipo:</b> {user.tipo}</p>

      <hr />

      <h2>📌 Navegação</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/imoveis">Ver Imóveis</Link>
        </li>
        <li>
          <Link to="/imoveis/cadastrar">Cadastrar Imóvel</Link>
        </li>
        <li>
          <Link to={`/imoveis/listar`}>Ver Meus Imóveis</Link>
        </li>

      </ul>

      <button onClick={logout} style={{ marginTop: "20px" }}>
        Sair
      </button>
    </div>
  );
}

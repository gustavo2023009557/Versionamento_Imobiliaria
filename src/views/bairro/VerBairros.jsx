import React, { useEffect, useState } from "react";
import { getBairros } from "../../api";
import { Link } from "react-router-dom";

// Função auxiliar para obter o ID do usuário (reutilizada de outros componentes)
const getUserId = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    return user.id || null; 
};

export default function VerBairros() {
  const [bairros, setBairros] = useState([]);
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário

  useEffect(() => {
    async function carregar() {
      const response = await getBairros();
      setBairros(response);
      setUserId(getUserId()); // Busca o ID do usuário ao carregar
    }
    carregar();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Bairros</h1>

      <Link
        to={`/home`}
        style={{
          display: "inline-block",
          marginBottom: "20px",
          background: "#007bff",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "6px",
          textDecoration: "none"
        }}
      >
        Voltar
      </Link>

      {bairros.length === 0 && <p>Nenhum bairro encontrado.</p>}

      {bairros.map((bairro) => (
        <div
          key={bairro.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h2>{bairro.nome}</h2>

          <p><strong>Cidade:</strong> {bairro.cidade}</p>
          <p><strong>Estado:</strong> {bairro.estado}</p>
          <p>
            <strong>CEP Inicial:</strong> {bairro.cepInicial ?? "Não informado"}
          </p>
          <p>
            <strong>CEP Final:</strong> {bairro.cepFinal ?? "Não informado"}
          </p>
          <Link
            to={`/bairros/editar/${bairro.id}`} 
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#007bff",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
          >
            Editar Bairro
          </Link>
          <Link
            to="/bairros/deletar"
            // ✅ CORRIGIDO: Passando userId e itemId (bairro.id) no objeto 'state'
            state={{ userId: userId, itemId: bairro.id }} 
            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#dc3545",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              marginLeft: "10px"
            }}
          >
            Deletar Bairro
          </Link>

        </div>
      ))}
    </div>
  );
}
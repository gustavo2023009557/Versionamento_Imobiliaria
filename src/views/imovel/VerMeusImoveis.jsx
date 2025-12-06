import React, { useEffect, useState } from "react";
import { getImovelByUserId } from "../../api";
import { Link } from "react-router-dom";

export default function VerMeusImoveis() {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    async function carregar() {
      const response = await getImovelByUserId();
      setImoveis(response);
    }
    carregar();
  }, []);

  return (
    <div>
      <h1>Lista de Imóveis</h1>

      {imoveis.length === 0 && <p>Nenhum imóvel encontrado.</p>}

      {imoveis.map((item) => (
        <div key={item.id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "6px"
        }}>
          <h2>{item.titulo}</h2>

          <p><strong>Descrição:</strong> {item.descricao}</p>
          <p><strong>Preço de Venda:</strong> R$ {item.precoVenda}</p>
          <p><strong>Preço de Aluguel:</strong> R$ {item.precoAluguel}</p>

          {/* botão para acessar página do imóvel */}
          <Link
            to={`/imoveis/${item.id}`}
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
            Ver detalhes
          </Link>
          <Link

            style={{
              display: "inline-block",
              marginTop: "10px",
              background: "#ffffff",
              color: "#000",
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none"
            }}
            to={`/imoveis/editar/${item.id}`}>
            Editar Imóvel
          </Link>

        </div>
      ))}
    </div>
  );
}

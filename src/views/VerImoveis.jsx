import React, { useEffect, useState } from "react";
import { getImoveis } from "../api";

export default function VerImoveis() {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    async function carregar() {
      //Recebe já convertido em json
      const response = await getImoveis();
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
          <p><strong>Finalidade:</strong> {item.finalidade}</p>
          <p><strong>Status:</strong> {item.status}</p>

          <p><strong>Dormitórios:</strong> {item.dormitorios}</p>
          <p><strong>Banheiros:</strong> {item.banheiros}</p>
          <p><strong>Garagem:</strong> {item.garagem}</p>

          <p><strong>Área Total:</strong> {item.areaTotal} m²</p>
          <p><strong>Área Construída:</strong> {item.areaConstruida} m²</p>

          <p><strong>Endereço:</strong> {item.endereco}, Nº {item.numero}</p>
          {item.complemento && (
            <p><strong>Complemento:</strong> {item.complemento}</p>
          )}

          {item.cep && <p><strong>CEP:</strong> {item.cep}</p>}

          <p><strong>Características:</strong> {item.caracteristicas}</p>

          <p><strong>Destaque:</strong> {item.destaque ? "Sim" : "Não"}</p>
        </div>
      ))}
    </div>
  );
}
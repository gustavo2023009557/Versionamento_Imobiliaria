import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getImovelById } from "../api";  // você deve criar essa função na API

export default function ImovelDetalhes() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);

  useEffect(() => {
    async function carregar() {
      const response = await getImovelById(id);
      setImovel(response);
    }
    carregar();
  }, [id]);

  if (!imovel) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{imovel.titulo}</h1>
      <p><strong>Descrição:</strong> {imovel.descricao}</p>
      <p><strong>Preço de Venda:</strong> R$ {imovel.precoVenda}</p>
      <p><strong>Preço de Aluguel:</strong> R$ {imovel.precoAluguel}</p>
      <p><strong>Finalidade:</strong> {imovel.finalidade}</p>
      <p><strong>Status:</strong> {imovel.status}</p>
      <p><strong>Dormitórios:</strong> {imovel.dormitorios}</p>
      <p><strong>Banheiros:</strong> {imovel.banheiros}</p>
      <p><strong>Garagem:</strong> {imovel.garagem}</p>
      <p><strong>Área Total:</strong> {imovel.areaTotal} m²</p>
      <p><strong>Área Construída:</strong> {imovel.areaConstruida} m²</p>
      <p><strong>Endereço:</strong> {imovel.endereco}, Nº {imovel.numero}</p>
      {imovel.complemento && <p><strong>Complemento:</strong> {imovel.complemento}</p>}
      <p><strong>CEP:</strong> {imovel.cep}</p>
      <p><strong>Características:</strong> {imovel.caracteristicas}</p>
    </div>
  );
}

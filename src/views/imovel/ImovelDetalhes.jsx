import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// As funções de API já estão importadas:
// getImovelById, getBairroById, getTipoImovelById
import { getImovelById, getBairroById, getTipoImovelById } from "../../api";

export default function ImovelDetalhes() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  // 1. NOVO ESTADO: Detalhes do Bairro
  const [bairroDetalhes, setBairroDetalhes] = useState(null);
  // 2. NOVO ESTADO: Detalhes do Tipo de Imóvel
  const [tipoImovelDetalhes, setTipoImovelDetalhes] = useState(null);

  useEffect(() => {
    async function carregar() {
      // 1. Carregar o Imóvel principal
      const imovelResponse = await getImovelById(id);
      setImovel(imovelResponse);

      if (imovelResponse) {
        // 2. Carregar Detalhes do Bairro
        if (imovelResponse.bairro_id) {
          const bairroResponse = await getBairroById(imovelResponse.bairro_id);
          setBairroDetalhes(bairroResponse);
        }

        // 3. Carregar Detalhes do Tipo de Imóvel
        if (imovelResponse.tipo_imovel_id) {
          const tipoResponse = await getTipoImovelById(imovelResponse.tipo_imovel_id);
          setTipoImovelDetalhes(tipoResponse);
        }
      }
    }
    carregar();
  }, [id]);

  if (!imovel) return <p>Carregando detalhes do Imóvel...</p>;

  return (
    <div>
      <h1>{imovel.titulo}</h1>
      <p><strong>Descrição:</strong> {imovel.descricao}</p>

      <hr />

      {/* 4. EXIBINDO DETALHES DO TIPO DE IMÓVEL */}
      <h2>Tipo de Imóvel</h2>
      {tipoImovelDetalhes ? (
        <>
          <p><strong>Nome do Tipo:</strong> {tipoImovelDetalhes.nome}</p>
          <p><strong>Descrição do Tipo:</strong> {tipoImovelDetalhes.descricao}</p>
        </>
      ) : (
        <p>Carregando detalhes do Tipo de Imóvel (ID: {imovel.tipo_imovel_id})...</p>
      )}

      <hr />

      {/* 5. EXIBINDO DETALHES DO BAIRRO E ENDEREÇO */}
      <h2>Localização</h2>
      <p><strong>Endereço:</strong> {imovel.endereco}, Nº {imovel.numero}</p>
      {imovel.complemento && <p><strong>Complemento:</strong> {imovel.complemento}</p>}

      {bairroDetalhes ? (
        <>
          <p>
            <strong>Bairro:</strong> {bairroDetalhes.nome}
            ({bairroDetalhes.cidade}/{bairroDetalhes.estado})
          </p>
          <p>
            <strong>CEP Informado:</strong> {imovel.cep}
            (Faixa do Bairro: {bairroDetalhes.cepInicial} a {bairroDetalhes.cepFinal})
          </p>
        </>
      ) : (
        <p>Carregando detalhes do Bairro (ID: {imovel.bairro_id})...</p>
      )}

      <hr />

      <h2>Características</h2>
      <p><strong>Preço de Venda:</strong> R$ {imovel.precoVenda}</p>
      <p><strong>Preço de Aluguel:</strong> R$ {imovel.precoAluguel}</p>
      <p><strong>Finalidade:</strong> {imovel.finalidade}</p>
      <p><strong>Status:</strong> {imovel.status}</p>
      <p><strong>Dormitórios:</strong> {imovel.dormitorios}</p>
      <p><strong>Banheiros:</strong> {imovel.banheiros}</p>
      <p><strong>Garagem:</strong> {imovel.garagem}</p>
      <p><strong>Área Total:</strong> {imovel.areaTotal} m²</p>
      <p><strong>Área Construída:</strong> {imovel.areaConstruida} m²</p>
      <p><strong>Outras Características:</strong> {imovel.caracteristicas}</p>

    </div>
  );
}
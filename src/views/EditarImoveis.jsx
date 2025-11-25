import React, { useState } from "react";
import { getImovelById, atualizarImovel } from "../api";
import { useNavigate } from "react-router-dom";

export default function EditarImoveis() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const navigate = useNavigate();

  async function buscarImovel() {
    const response = await getImovelById(id);

    if (response.status === 404) {
      alert("Imóvel não encontrado");
      return;
    }

    const dados = await response.json();
    setNome(dados.nome);
    setEndereco(dados.endereco);
  }

  async function salvar() {
    const response = await atualizarImovel(id, { nome, endereco });

    if (response.status === 204) {
      alert("Imóvel atualizado com sucesso!");
      navigate("/imoveis");
    } else {
      alert("Erro ao atualizar imóvel.");
    }
  }

  return (
    <div>
      <h1>Editar Imóvel</h1>

      <input
        type="number"
        placeholder="ID do imóvel"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={buscarImovel}>Buscar</button>

      <hr />

      <input
        type="text"
        placeholder="Nome do imóvel"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="text"
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
      />

      <button onClick={salvar}>Salvar Alterações</button>
    </div>
  );
}

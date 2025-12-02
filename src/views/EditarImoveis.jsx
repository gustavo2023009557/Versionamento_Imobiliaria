import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImovelById, atualizarImovel } from "../api";

export default function EditarImovel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    async function carregar() {
      const dados = await getImovelById(id);

      console.log(dados)

      if (!dados) {
        alert("Imóvel não encontrado");
        navigate("/imoveis");
        return;
      }



      setForm({
        id: dados.id,                   // necessário para o PUT da sua API
        titulo: dados.titulo ?? "",
        descricao: dados.descricao ?? "",
        precoVenda: dados.precoVenda ?? "",
        precoAluguel: dados.precoAluguel ?? "",
        finalidade: dados.finalidade ?? "",
        status: dados.status ?? "",
        dormitorios: dados.dormitorios ?? "",
        banheiros: dados.banheiros ?? "",
        garagem: dados.garagem ?? "",
        areaTotal: dados.areaTotal ?? "",
        areaConstruida: dados.areaConstruida ?? "",
        endereco: dados.endereco ?? "",
        numero: dados.numero ?? "",
        complemento: dados.complemento ?? "",
        cep: dados.cep ?? "",
        caracteristicas: dados.caracteristicas ?? "",
        destaque: dados.destaque ?? false
      });
    }

    carregar();
  }, [id, navigate]);

  if (!form) return <p>Carregando...</p>;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function salvar() {
    const response = await atualizarImovel(form);

    if (response.ok) {
      alert("Imóvel atualizado!");
      navigate("/imoveis");
    } else {
      alert("Erro ao atualizar imóvel.");
    }
  }

  return (
    <div>
      <h1>Editar Imóvel #{id}</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>

        <label>Título:</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} />

        <label>Descrição:</label>
        <input name="descricao" value={form.descricao} onChange={handleChange} />

        <label>Preço de Venda:</label>
        <input type="number" name="precoVenda" value={form.precoVenda} onChange={handleChange} />

        <label>Preço de Aluguel:</label>
        <input type="number" name="precoAluguel" value={form.precoAluguel} onChange={handleChange} />

        <label>Finalidade:</label>
        <input name="finalidade" value={form.finalidade} onChange={handleChange} />

        <label>Status:</label>
        <input name="status" value={form.status} onChange={handleChange} />

        <label>Dormitórios:</label>
        <input type="number" name="dormitorios" value={form.dormitorios} onChange={handleChange} />

        <label>Banheiros:</label>
        <input type="number" name="banheiros" value={form.banheiros} onChange={handleChange} />

        <label>Garagem:</label>
        <input type="number" name="garagem" value={form.garagem} onChange={handleChange} />

        <label>Área Total:</label>
        <input type="number" name="areaTotal" value={form.areaTotal} onChange={handleChange} />

        <label>Área Construída:</label>
        <input type="number" name="areaConstruida" value={form.areaConstruida} onChange={handleChange} />

        <label>Endereço:</label>
        <input name="endereco" value={form.endereco} onChange={handleChange} />

        <label>Número:</label>
        <input name="numero" value={form.numero} onChange={handleChange} />

        <label>Complemento:</label>
        <input name="complemento" value={form.complemento} onChange={handleChange} />

        <label>CEP:</label>
        <input name="cep" value={form.cep} onChange={handleChange} />

        <label>Características:</label>
        <input name="caracteristicas" value={form.caracteristicas} onChange={handleChange} />

        <label>
          Destaque:
          <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} />
        </label>

        <button onClick={salvar}>Salvar alterações</button>
      </div>
    </div>
  );
}

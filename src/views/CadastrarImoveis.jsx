import React, { useState } from "react";
import { cadastrarImovel } from "../api";
import { useNavigate } from "react-router-dom";

export default function CadastrarImoveis() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    precoVenda: "",
    precoAluguel: "",
    finalidade: "",
    status: "",
    dormitorios: "",
    banheiros: "",
    garagem: "",
    areaTotal: "",
    areaConstruida: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    caracteristicas: "",
    destaque: false,
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await cadastrarImovel(form);

    if (response.status === 201) {
      alert("Imóvel cadastrado com sucesso!");
      navigate("/imoveis");
    } else {
      alert("Erro ao cadastrar imóvel");
    }
  }

  return (
    <div>
      <h1>Cadastrar Imóvel</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px", // espaçamento entre os campos
          maxWidth: "400px",
        }}
      >
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />

        <input name="precoVenda" type="number" placeholder="Preço de venda" value={form.precoVenda} onChange={handleChange} />
        <input name="precoAluguel" type="number" placeholder="Preço de aluguel" value={form.precoAluguel} onChange={handleChange} />

        <input name="finalidade" placeholder="Finalidade" value={form.finalidade} onChange={handleChange} />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} />

        <input name="dormitorios" type="number" placeholder="Dormitórios" value={form.dormitorios} onChange={handleChange} />
        <input name="banheiros" type="number" placeholder="Banheiros" value={form.banheiros} onChange={handleChange} />
        <input name="garagem" type="number" placeholder="Garagem" value={form.garagem} onChange={handleChange} />

        <input name="areaTotal" type="number" placeholder="Área total" value={form.areaTotal} onChange={handleChange} />
        <input name="areaConstruida" type="number" placeholder="Área construída" value={form.areaConstruida} onChange={handleChange} />

        <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} />
        <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} />
        <input name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} />
        <input name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} />

        <input
          name="caracteristicas"
          placeholder="Características (separadas por vírgula)"
          value={form.caracteristicas}
          onChange={handleChange}
        />

        <label>
          Destaque:
          <input
            name="destaque"
            type="checkbox"
            checked={form.destaque}
            onChange={handleChange}
            style={{ marginLeft: "8px" }}
          />
        </label>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

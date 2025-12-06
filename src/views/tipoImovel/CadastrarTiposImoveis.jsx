import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Assumindo que você tem esta função configurada em sua API
import { cadastrarTipoImovel } from "../../api"; 

export default function CadastrarTiposImoveis() {
  const navigate = useNavigate();

  // Inicializa o estado com os campos 'nome' e 'descricao'
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificação de campos obrigatórios
    if (!form.nome || !form.descricao) {
      alert("Por favor, preencha o Nome e a Descrição.");
      return;
    }

    try {
      // Chama a função de cadastro na API
      const response = await cadastrarTipoImovel(form);

      if (response.status === 201) {
        alert("Tipo de Imóvel cadastrado com sucesso!");
        // Navega para a lista de tipos de imóveis
        navigate("/tiposimoveis"); 
      } else {
        alert("Erro ao cadastrar Tipo de Imóvel. Verifique o servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro na comunicação com a API.");
    }
  }

  return (
    <div>
      <h1>Cadastrar Novo Tipo de Imóvel</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        {/* Campo Nome */}
        <label htmlFor="nome">Nome do Tipo:</label>
        <input 
          id="nome"
          name="nome" 
          placeholder="Ex: Apartamento" 
          value={form.nome} 
          onChange={handleChange} 
          required
        />

        {/* Campo Descrição */}
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          name="descricao" 
          placeholder="Uma breve descrição sobre este tipo de imóvel." 
          value={form.descricao} 
          onChange={handleChange}
          rows="4"
          required
        />
        
        <button type="submit">Cadastrar Tipo</button>
      </form>
    </div>
  );
}
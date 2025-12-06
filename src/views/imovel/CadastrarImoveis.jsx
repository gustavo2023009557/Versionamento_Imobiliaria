import React, { useState, useEffect } from "react";
// ✅ Importado getTipoImovel
import { cadastrarImovel, getBairros, getTipoImovel } from "../../api";
import { useNavigate } from "react-router-dom";

// ... (função getUserId permanece inalterada) ...

const getUserId = () => {
  const userString = localStorage.getItem("user");
  if (!userString) {
    return null;
  }

  try {
    const user = JSON.parse(userString);
    const userId = parseInt(user.id);
    if (isNaN(userId)) {
      console.error("ID do usuário no localStorage não é um número válido.");
      return null;
    }
    return userId;
  } catch (error) {
    console.error("Erro ao fazer parse do usuário do localStorage:", error);
    return null;
  }
};


export default function CadastrarImoveis() {
  const navigate = useNavigate();

  // 1. ESTADO: Lista de bairros
  const [bairros, setBairros] = useState([]);
  // 1. ✅ NOVO ESTADO: Lista de tipos de imóveis
  const [tiposImoveis, setTiposImoveis] = useState([]);

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
    // 2. CAMPO: ID do Bairro
    bairro_id: "",
    // 2. ✅ NOVO CAMPO: ID do Tipo de Imóvel
    tipo_imovel_id: "",
    usuario_id: getUserId(),
  });

  // 3. CARREGAMENTO: Carrega as listas na montagem do componente
  useEffect(() => {
    // Função para carregar bairros (mantida)
    async function carregarBairros() {
      try {
        const listaBairros = await getBairros();
        setBairros(listaBairros);

        if (listaBairros.length > 0) {
          setForm(prevForm => ({
            ...prevForm,
            // Se o tipoImovel ainda não tiver sido setado (para evitar sobrescrever), define o bairro_id
            bairro_id: prevForm.bairro_id || listaBairros[0].id
          }));
        }

      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
      }
    }

    // 3. ✅ NOVA FUNÇÃO: Carrega a lista de tipos de imóveis
    async function carregarTiposImoveis() {
      try {
        const listaTipos = await getTipoImovel(); // Assumindo que esta API existe
        setTiposImoveis(listaTipos);

        if (listaTipos.length > 0) {
          setForm(prevForm => ({
            ...prevForm,
            // Pré-seleciona o primeiro tipo de imóvel
            tipo_imovel_id: listaTipos[0].id
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar tipos de imóveis:", error);
      }
    }

    carregarBairros();
    carregarTiposImoveis();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // ✅ Atualizado: Incluindo "tipo_imovel_id" na conversão para inteiro
    const newValue = (name === "bairro_id" || name === "tipo_imovel_id" || name === "dormitorios" || name === "banheiros" || name === "garagem")
      ? parseInt(value)
      : value;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : newValue,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificação de campo obrigatório para tipo de imóvel
    if (!form.bairro_id) {
      alert("Por favor, selecione um Bairro.");
      return;
    }
    if (!form.tipo_imovel_id) {
      alert("Por favor, selecione um Tipo de Imóvel.");
      return;
    }

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
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        {/* 4. ✅ NOVO CAMPO DE SELEÇÃO DE TIPO DE IMÓVEL */}
        <label htmlFor="tipo_imovel_id">Selecione o Tipo de Imóvel:</label>
        <select
          id="tipo_imovel_id"
          name="tipo_imovel_id"
          value={form.tipo_imovel_id || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Escolha um tipo</option>
          {tiposImoveis.length > 0 ? (
            tiposImoveis.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))
          ) : (
            <option value="" disabled>Carregando tipos...</option>
          )}
        </select>

        <hr style={{ width: '100%' }} />

        {/* Campo de Seleção de Bairro (Mantido) */}
        <label htmlFor="bairro_id">Selecione o Bairro:</label>
        <select
          id="bairro_id"
          name="bairro_id"
          value={form.bairro_id || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Escolha um bairro</option>
          {bairros.length > 0 ? (
            bairros.map((bairro) => (
              <option key={bairro.id} value={bairro.id}>
                {bairro.nome} ({bairro.cidade}/{bairro.estado})
              </option>
            ))
          ) : (
            <option value="" disabled>Carregando bairros...</option>
          )}
        </select>

        <hr style={{ width: '100%' }} />

        {/* Outros campos permanecem inalterados */}
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
        {/* ... (resto do formulário) ... */}
        <input name="precoVenda" type="number" placeholder="Preço de venda" value={form.precoVenda} onChange={handleChange} />
        <input name="precoAluguel" type="number" placeholder="Preço de aluguel" value={form.precoAluguel} onChange={handleChange} />
        {/* ... (campos numéricos, endereço, etc.) ... */}
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
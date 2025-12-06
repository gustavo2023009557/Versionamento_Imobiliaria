import React, { useState, useEffect } from "react"; // ✅ Adicionado useEffect
import { cadastrarImovel, getBairros } from "../../api"; // ✅ Importado getBairros
import { useNavigate } from "react-router-dom";

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

  // 1. ✅ NOVO ESTADO: Lista de bairros
  const [bairros, setBairros] = useState([]);

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
    // 2. ✅ NOVO CAMPO: ID do Bairro
    bairro_id: "",
    usuario_id: getUserId(),
  });

  // 3. ✅ CARREGAMENTO: Carrega a lista de bairros na montagem do componente
  useEffect(() => {
    async function carregarBairros() {
      try {
        const listaBairros = await getBairros();
        setBairros(listaBairros);

        // Opcional: Pré-selecionar o primeiro bairro se a lista não estiver vazia
        if (listaBairros.length > 0) {
          setForm(prevForm => ({
            ...prevForm,
            bairro_id: listaBairros[0].id // Seleciona o ID do primeiro bairro
          }));
        }

      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
      }
    }
    carregarBairros();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // O valor do select deve ser convertido para inteiro, já que ele representa um ID.
    const newValue = (name === "bairro_id" || name === "dormitorios" || name === "banheiros" || name === "garagem")
      ? parseInt(value)
      : value;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : newValue,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Verificação básica
    if (!form.bairro_id) {
      alert("Por favor, selecione um Bairro.");
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
        {/* 4. ✅ CAMPO DE SELEÇÃO DE BAIRRO */}
        <label htmlFor="bairro_id">Selecione o Bairro:</label>
        <select
          id="bairro_id"
          name="bairro_id"
          value={form.bairro_id || ""} // Use || "" para evitar aviso de componente não controlado
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
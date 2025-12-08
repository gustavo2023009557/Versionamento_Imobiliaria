import React, { useState, useEffect } from "react";
import { cadastrarImovel, getBairros, getTipoImovel } from "../../api";
import { useNavigate } from "react-router-dom";

// Função para obter o ID do usuário (mantida inalterada)
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

// --- ESTILOS CSS ---

const styles = {
  // 1. Container Principal da Página
  pageContainer: {
    padding: "30px",
    backgroundColor: "#f8f9fa", // Fundo cinza claro
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  // 2. Container do Formulário (o "Card" branco)
  formContainer: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px", // Largura máxima para telas maiores
  },
  // 3. Estilo para o título das seções
  sectionTitle: {
    borderBottom: "2px solid #0000AA",
    paddingBottom: "5px",
    marginBottom: "20px",
    color: "#007bff", // Azul
    marginTop: "30px",
  },
  // 4. Estilo padrão para todos os inputs e selects
  inputField: {
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "1em",
    marginBottom: "10px",
    width: "100%",
    boxSizing: "border-box",
  },
  // 5. Layout de Grid para agrupar campos lado a lado
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  // 6. Estilo do botão de Salvar (Primary Action)
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#0000FF", // Azul Forte (Primary Action)
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1.1em",
    marginTop: "10px", // Ajustado para dar espaço do botão de voltar
  },
  // 6b. ✅ NOVO ESTILO: Botão de Voltar (Secondary Action)
  backButton: {
    padding: "12px 20px",
    backgroundColor: "#6c757d", // Cinza/Secundário
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1.1em",
    width: '100%',
    marginBottom: '10px',
  },
  // 7. Estilo para os labels
  labelStyle: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
    color: "#343a40",
  },
};

export default function CadastrarImoveis() {
  const navigate = useNavigate();

  const [bairros, setBairros] = useState([]);
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
    bairro_id: "",
    tipo_imovel_id: "",
    usuario_id: getUserId(),
  });

  useEffect(() => {
    async function carregarBairros() {
      try {
        const listaBairros = await getBairros();
        setBairros(listaBairros);

        if (listaBairros.length > 0) {
          setForm(prevForm => ({
            ...prevForm,
            bairro_id: prevForm.bairro_id || listaBairros[0].id
          }));
        }

      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
      }
    }

    async function carregarTiposImoveis() {
      try {
        const listaTipos = await getTipoImovel();
        setTiposImoveis(listaTipos);

        if (listaTipos.length > 0) {
          setForm(prevForm => ({
            ...prevForm,
            tipo_imovel_id: prevForm.tipo_imovel_id || listaTipos[0].id
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

    if (!form.bairro_id) {
      alert("Por favor, selecione um Bairro.");
      return;
    }
    if (!form.tipo_imovel_id) {
      alert("Por favor, selecione um Tipo de Imóvel.");
      return;
    }

    // Validação básica de números para campos vazios, convertendo para 0 se necessário para o backend
    const formToSend = {
      ...form,
      precoVenda: form.precoVenda ? parseFloat(form.precoVenda) : 0,
      precoAluguel: form.precoAluguel ? parseFloat(form.precoAluguel) : 0,
      dormitorios: form.dormitorios ? parseInt(form.dormitorios) : 0,
      banheiros: form.banheiros ? parseInt(form.banheiros) : 0,
      garagem: form.garagem ? parseInt(form.garagem) : 0,
      areaTotal: form.areaTotal ? parseFloat(form.areaTotal) : 0,
      areaConstruida: form.areaConstruida ? parseFloat(form.areaConstruida) : 0,
    };

    const response = await cadastrarImovel(formToSend);

    if (response.status === 201) {
      alert("Imóvel cadastrado com sucesso!");
      navigate("/imoveis");
    } else {
      alert("Erro ao cadastrar imóvel");
    }
  }

  // ✅ NOVA FUNÇÃO: Manipulador de clique para o botão Voltar
  const handleBackClick = () => {
    navigate("/home"); // Redireciona para a rota /home
  };

  return (
    <div style={styles.pageContainer}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <h1 style={{ color: '#0000FF' }}>➕ Cadastrar Novo Imóvel</h1>
      </div>



      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <button type="button" onClick={handleBackClick} style={styles.backButton}>
          Voltar
        </button>

        {/* DADOS ESSENCIAIS (TIPO E LOCALIZAÇÃO) */}
        <h2 style={{ ...styles.sectionTitle, marginTop: '0' }}>Informações Básicas</h2>

        <div style={styles.gridContainer}>
          {/* Seleção de Tipo de Imóvel */}
          <div>
            <label htmlFor="tipo_imovel_id" style={styles.labelStyle}>Tipo de Imóvel:</label>
            <select
              id="tipo_imovel_id"
              name="tipo_imovel_id"
              value={form.tipo_imovel_id || ""}
              onChange={handleChange}
              required
              style={styles.inputField}
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
          </div>

          {/* Seleção de Bairro */}
          <div>
            <label htmlFor="bairro_id" style={styles.labelStyle}>Localização (Bairro):</label>
            <select
              id="bairro_id"
              name="bairro_id"
              value={form.bairro_id || ""}
              onChange={handleChange}
              required
              style={styles.inputField}
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
          </div>
        </div>

        {/* TÍTULO E DESCRIÇÃO */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="titulo" style={styles.labelStyle}>Título do Anúncio:</label>
          <input name="titulo" placeholder="Ex: Apartamento 3 Quartos com Varanda Gourmet" value={form.titulo} onChange={handleChange} style={styles.inputField} required />

          <label htmlFor="descricao" style={styles.labelStyle}>Descrição Detalhada:</label>
          <textarea
            name="descricao"
            placeholder="Descreva as características, proximidades e diferenciais do imóvel."
            value={form.descricao}
            onChange={handleChange}
            style={{ ...styles.inputField, resize: 'vertical', minHeight: '80px' }}
          />
        </div>

        {/* DADOS FINANCEIROS E STATUS */}
        <h2 style={styles.sectionTitle}>Detalhes Financeiros e Status</h2>
        <div style={styles.gridContainer}>
          <div>
            <label htmlFor="precoVenda" style={styles.labelStyle}>Preço de Venda (R$):</label>
            <input name="precoVenda" type="number" placeholder="0.00" value={form.precoVenda} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="precoAluguel" style={styles.labelStyle}>Preço de Aluguel (R$):</label>
            <input name="precoAluguel" type="number" placeholder="0.00" value={form.precoAluguel} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="finalidade" style={styles.labelStyle}>Finalidade:</label>
            <input name="finalidade" placeholder="Ex: Venda, Aluguel ou Ambos" value={form.finalidade} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="status" style={styles.labelStyle}>Status:</label>
            <input name="status" placeholder="Ex: Ativo, Vendido, Alugado" value={form.status} onChange={handleChange} style={styles.inputField} />
          </div>
        </div>

        {/* CARACTERÍSTICAS NUMÉRICAS */}
        <h2 style={styles.sectionTitle}>Características do Imóvel</h2>
        <div style={styles.gridContainer}>
          <div>
            <label htmlFor="dormitorios" style={styles.labelStyle}>Dormitórios:</label>
            <input name="dormitorios" type="number" placeholder="0" value={form.dormitorios} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="banheiros" style={styles.labelStyle}>Banheiros:</label>
            <input name="banheiros" type="number" placeholder="0" value={form.banheiros} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="garagem" style={styles.labelStyle}>Garagem (Vagas):</label>
            <input name="garagem" type="number" placeholder="0" value={form.garagem} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="areaTotal" style={styles.labelStyle}>Área Total (m²):</label>
            <input name="areaTotal" type="number" placeholder="0.00" value={form.areaTotal} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="areaConstruida" style={styles.labelStyle}>Área Construída (m²):</label>
            <input name="areaConstruida" type="number" placeholder="0.00" value={form.areaConstruida} onChange={handleChange} style={styles.inputField} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="caracteristicas" style={styles.labelStyle}>Outras Características (Separe por vírgula):</label>
            <input
              name="caracteristicas"
              placeholder="Ex: Piscina, Churrasqueira, Portaria 24h"
              value={form.caracteristicas}
              onChange={handleChange}
              style={styles.inputField}
            />
          </div>
        </div>

        {/* ENDEREÇO E OPÇÕES FINAIS */}
        <h2 style={styles.sectionTitle}>Endereço e Publicação</h2>

        <div style={styles.gridContainer}>
          <div>
            <label htmlFor="cep" style={styles.labelStyle}>CEP:</label>
            <input name="cep" placeholder="00000-000" value={form.cep} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="endereco" style={styles.labelStyle}>Logradouro:</label>
            <input name="endereco" placeholder="Rua / Avenida" value={form.endereco} onChange={handleChange} style={styles.inputField} />
          </div>
        </div>

        <div style={styles.gridContainer}>
          <div>
            <label htmlFor="numero" style={styles.labelStyle}>Número:</label>
            <input name="numero" placeholder="Nº" value={form.numero} onChange={handleChange} style={styles.inputField} />
          </div>
          <div>
            <label htmlFor="complemento" style={styles.labelStyle}>Complemento (Opcional):</label>
            <input name="complemento" placeholder="Apto, Bloco, etc." value={form.complemento} onChange={handleChange} style={styles.inputField} />
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label style={{ ...styles.labelStyle, display: 'inline-flex', alignItems: 'center' }}>
            Destaque no Site:
            <input
              name="destaque"
              type="checkbox"
              checked={form.destaque}
              onChange={handleChange}
              style={{ marginLeft: "10px", width: 'auto' }}
            />
          </label>
        </div>

        {/* BOTÃO SUBMIT */}
        <button type="submit" style={styles.submitButton}>
          ✅ Cadastrar Imóvel
        </button>
      </form>
    </div>
  );
}
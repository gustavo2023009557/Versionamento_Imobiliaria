import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ✅ Importação da função para buscar todos os bairros
import { getImovelById, atualizarImovel, getBairros } from "../../api";

export default function EditarImovel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  // 1. Novo estado para armazenar a lista de bairros
  const [bairros, setBairros] = useState([]);

  useEffect(() => {
    async function carregar() {
      // Busca os dados do imóvel e a lista de bairros em paralelo
      const [dadosImovel, listaBairros] = await Promise.all([
        getImovelById(id),
        getBairros()
      ]);

      setBairros(listaBairros || []);

      if (!dadosImovel) {
        alert("Imóvel não encontrado");
        navigate("/imoveis");
        return;
      }

      setForm({
        id: dadosImovel.id,
        titulo: dadosImovel.titulo ?? "",
        descricao: dadosImovel.descricao ?? "",
        precoVenda: dadosImovel.precoVenda ?? "",
        precoAluguel: dadosImovel.precoAluguel ?? "",
        finalidade: dadosImovel.finalidade ?? "",
        status: dadosImovel.status ?? "",
        dormitorios: dadosImovel.dormitorios ?? "",
        banheiros: dadosImovel.banheiros ?? "",
        garagem: dadosImovel.garagem ?? "",
        areaTotal: dadosImovel.areaTotal ?? "",
        areaConstruida: dadosImovel.areaConstruida ?? "",
        endereco: dadosImovel.endereco ?? "",
        numero: dadosImovel.numero ?? "",
        complemento: dadosImovel.complemento ?? "",
        cep: dadosImovel.cep ?? "",
        caracteristicas: dadosImovel.caracteristicas ?? "",
        destaque: dadosImovel.destaque ?? false,
        // 2. Inicializa com o ID do Bairro atual do Imóvel
        bairro_id: dadosImovel.bairro_id ?? ""
      });
    }

    carregar();
  }, [id, navigate]);

  // Exibe 'Carregando' até que o formulário e a lista de bairros estejam prontos
  if (!form || bairros.length === 0) return <p>Carregando...</p>;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    // 3. Garante que IDs e campos numéricos sejam convertidos para Int
    if (type === "number" || name === "bairro_id" || name === "dormitorios" || name === "banheiros" || name === "garagem") {
      newValue = value === "" ? "" : parseInt(value);
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : newValue,
    });
  }

  async function salvar() {
    // Verificação se um Bairro foi selecionado
    if (!form.bairro_id) {
      alert("Por favor, selecione um Bairro.");
      return;
    }

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

        {/* 4. Campo de Seleção de Bairro */}
        <label htmlFor="bairro_id">Selecione o Bairro:</label>
        <select
          id="bairro_id"
          name="bairro_id"
          // O valor deve ser o ID do bairro associado ao Imóvel (dadosImovel.bairro_id)
          value={form.bairro_id || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Escolha um bairro</option>
          {bairros.map((bairro) => (
            <option key={bairro.id} value={bairro.id}>
              {bairro.nome} ({bairro.cidade}/{bairro.estado})
            </option>
          ))}
        </select>
        <hr style={{ width: '100%' }} />

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
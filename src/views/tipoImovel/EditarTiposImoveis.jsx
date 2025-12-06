import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ✅ Alterado: Funções de API para Tipo Imóvel
import { getTipoImovelById, atualizarTipoImovel } from "../../api";

export default function EditarTiposImoveis() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Inicializando com null para exibir 'Carregando...'
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function carregar() {
            // ✅ Alterado: Chamada da API para buscar Tipo de Imóvel
            const dados = await getTipoImovelById(id);

            if (!dados) {
                alert("Tipo de Imóvel não encontrado");
                // ✅ Alterado: Navegação em caso de erro
                navigate("/tiposimoveis");
                return;
            }

            // ✅ Alterado: Campos do formulário para Tipo Imóvel
            setForm({
                id: dados.id,
                nome: dados.nome ?? "",
                descricao: dados.descricao ?? "",
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
        // ✅ Alterado: Chamada da API para atualizar Tipo de Imóvel
        const response = await atualizarTipoImovel(form);

        if (response.ok) {
            alert("Tipo de Imóvel atualizado!");
            // ✅ Alterado: Navegação de sucesso
            navigate("/tiposimoveis");
        } else {
            alert("Erro ao atualizar Tipo de Imóvel. Verifique os dados e o servidor.");
        }
    }

    return (
        <div>
            <h1>Editar Tipo de Imóvel #{id}</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>

                {/* ✅ Campo Nome */}
                <label htmlFor="nome">Nome do Tipo:</label>
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />

                {/* ✅ Campo Descrição */}
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    rows="4"
                    required
                />

                {/* Campos de Bairro removidos */}

                <button onClick={salvar}>Salvar alterações</button>
            </div>
        </div>
    );
}
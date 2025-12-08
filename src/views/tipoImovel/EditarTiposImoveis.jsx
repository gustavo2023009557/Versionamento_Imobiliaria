import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ✅ Alterado: Funções de API para Tipo Imóvel
import { getTipoImovelById, atualizarTipoImovel } from "../../api";

// --- ESTILOS CSS REPLICADOS PARA COERÊNCIA VISUAL ---
const styles = {
    pageContainer: {
        padding: "30px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    formContainer: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "500px",
    },
    title: {
        color: "#0000FF",
        borderBottom: "2px solid #007bff",
        paddingBottom: "5px",
        marginBottom: "20px",
    },
    inputField: {
        padding: "10px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "1em",
        marginBottom: "15px",
        width: "100%",
        boxSizing: "border-box",
        resize: 'none', // Desabilita o redimensionamento do textarea
    },
    labelStyle: {
        fontWeight: "bold",
        marginBottom: "5px",
        display: "block",
        color: "#343a40",
    },
    submitButton: {
        padding: "12px 20px",
        backgroundColor: "#0000FF",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1.1em",
        marginTop: "10px",
        width: '100%',
    },
    backButton: {
        padding: "10px 15px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1em",
        width: '100%',
        marginBottom: '20px',
    },
};

export default function EditarTiposImoveis() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Inicializando com null para exibir 'Carregando...'
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function carregar() {
            const dados = await getTipoImovelById(id);

            if (!dados) {
                alert("Tipo de Imóvel não encontrado");
                navigate("/tiposimoveis");
                return;
            }

            setForm({
                id: dados.id,
                nome: dados.nome ?? "",
                descricao: dados.descricao ?? "",
            });
        }

        carregar();
    }, [id, navigate]);

    // Função de tratamento de mudança
    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    // Função de submissão do formulário
    async function handleSubmit(e) {
        e.preventDefault(); 
        
        // Simples verificação de campos obrigatórios
        if (!form.nome || !form.descricao) {
             alert("Por favor, preencha o Nome e a Descrição.");
             return;
        }

        const response = await atualizarTipoImovel(form);

        if (response.ok) {
            alert("Tipo de Imóvel atualizado com sucesso! 🎉");
            navigate("/tiposimoveis");
        } else {
            alert("Erro ao atualizar Tipo de Imóvel. Verifique os dados e o servidor.");
        }
    }
    
    // Função para voltar
    const handleBackClick = () => {
        navigate("/tiposimoveis"); 
    };

    if (!form) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p>;

    return (
        <div style={styles.pageContainer}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={styles.title}>✏️ Editar Tipo de Imóvel **#{id}**</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* BOTÃO VOLTAR */}
                <button type="button" onClick={handleBackClick} style={styles.backButton}>
                    ⬅️ Voltar para a Lista de Tipos
                </button>

                {/* Campo Nome */}
                <div>
                    <label style={styles.labelStyle} htmlFor="nome">Nome do Tipo:</label>
                    <input
                        id="nome"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Campo Descrição */}
                <div>
                    <label style={styles.labelStyle} htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        rows="4"
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* BOTÃO DE SUBMISSÃO */}
                <button type="submit" style={styles.submitButton}>
                    💾 Salvar Alterações
                </button>
            </form>
        </div>
    );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Assumindo que você tem esta função configurada em sua API
import { cadastrarTipoImovel } from "../../api"; 

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

        if (!form.nome || !form.descricao) {
            alert("Por favor, preencha o Nome e a Descrição.");
            return;
        }

        try {
            const response = await cadastrarTipoImovel(form);

            if (response.status === 201) {
                alert("Tipo de Imóvel cadastrado com sucesso! 🎉");
                // Navega para a lista de tipos de imóveis
                navigate("/tiposimoveis"); 
            } else {
                // Tenta ler o erro do corpo da resposta, se disponível
                const errorText = await response.text();
                alert(`Erro ao cadastrar Tipo de Imóvel. Status: ${response.status}. Detalhes: ${errorText.substring(0, 100)}`);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro na comunicação com a API.");
        }
    }

    const handleBackClick = () => {
        // Volta para a listagem de tipos de imóveis
        navigate("/tiposimoveis"); 
    };

    return (
        <div style={styles.pageContainer}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={styles.title}>🏡 Cadastrar Novo Tipo de Imóvel</h1>
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
                        placeholder="Ex: Apartamento, Casa, Terreno" 
                        value={form.nome} 
                        onChange={handleChange} 
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Campo Descrição */}
                <div>
                    <label style={styles.labelStyle} htmlFor="descricao">Descrição Detalhada:</label>
                    <textarea
                        id="descricao"
                        name="descricao" 
                        placeholder="Descreva as características principais deste tipo (Ex: Unidade em condomínio, uso residencial, vertical)." 
                        value={form.descricao} 
                        onChange={handleChange}
                        rows="4"
                        required
                        style={styles.inputField}
                    />
                </div>
                
                <button type="submit" style={styles.submitButton}>
                    💾 Cadastrar Tipo
                </button>
            </form>
        </div>
    );
}
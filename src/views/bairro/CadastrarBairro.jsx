// src/pages/CadastrarBairro.jsx
import React, { useState } from "react";
import { cadastrarBairro } from "../../api";
import { useNavigate } from "react-router-dom";

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
        maxWidth: "500px", // Tornando o formulário menor, mais apropriado para dados básicos
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

export default function CadastrarBairro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        cidade: "",
        estado: "",
        cepInicial: "",
        cepFinal: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        // Opcional: Limitar estado a 2 caracteres maiúsculos (ex: SP)
        let finalValue = value;
        if (name === 'estado') {
            finalValue = value.toUpperCase().slice(0, 2);
        }

        setForm({
            ...form,
            [name]: finalValue,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Formata os campos de CEP (se necessário, antes de enviar)
        const formToSend = {
            ...form,
            // Certifica-se de que os CEPs são tratados como string ou números, conforme sua API espera.
            // Se a API espera um número, use: cepInicial: parseInt(form.cepInicial)
        }

        const response = await cadastrarBairro(formToSend);

        if (response.status === 201) {
            alert("Bairro cadastrado com sucesso! 🎉");
            // Redireciona para a lista de bairros
            navigate("/bairros");
        } else {
            alert("Erro ao cadastrar bairro. Verifique se os dados estão corretos e o CEP não se sobrepõe a bairros existentes.");
        }
    }

    const handleBackClick = () => {
        // Redireciona para a rota /home
        navigate("/home"); 
    };

    return (
        <div style={styles.pageContainer}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={styles.title}>📍 Cadastro de Novo Bairro</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* BOTÃO VOLTAR */}
                <button type="button" onClick={handleBackClick} style={styles.backButton}>
                    🏠 Voltar para Home
                </button>

                {/* Input: Nome */}
                <div>
                    <label style={styles.labelStyle} htmlFor="nome">Nome do Bairro:</label>
                    <input
                        name="nome"
                        id="nome"
                        placeholder="Ex: Jardim Paulista"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Input: Cidade */}
                <div>
                    <label style={styles.labelStyle} htmlFor="cidade">Cidade:</label>
                    <input
                        name="cidade"
                        id="cidade"
                        placeholder="Ex: São Paulo"
                        value={form.cidade}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Input: Estado */}
                <div>
                    <label style={styles.labelStyle} htmlFor="estado">Estado (UF):</label>
                    <input
                        name="estado"
                        id="estado"
                        placeholder="Ex: SP"
                        value={form.estado}
                        onChange={handleChange}
                        maxLength="2"
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Input: CEP Inicial */}
                <div>
                    <label style={styles.labelStyle} htmlFor="cepInicial">CEP Inicial (Apenas números):</label>
                    <input
                        name="cepInicial"
                        id="cepInicial"
                        placeholder="Ex: 01000000"
                        value={form.cepInicial}
                        onChange={handleChange}
                        type="text" // Mantido como texto para não forçar pontuação
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Input: CEP Final */}
                <div>
                    <label style={styles.labelStyle} htmlFor="cepFinal">CEP Final (Apenas números):</label>
                    <input
                        name="cepFinal"
                        id="cepFinal"
                        placeholder="Ex: 01099999"
                        value={form.cepFinal}
                        onChange={handleChange}
                        type="text" // Mantido como texto para não forçar pontuação
                        required
                        style={styles.inputField}
                    />
                </div>

                <button type="submit" style={styles.submitButton}>
                    💾 Salvar Bairro
                </button>
            </form>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBairroById, atualizarBairro } from "../../api";

// --- ESTILOS CSS REPLICADOS DE CADASTRARBAIRRO ---
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

export default function EditarBairro() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);

    useEffect(() => {
        async function carregar() {
            const dados = await getBairroById(id);
            if (!dados) {
                alert("Bairro não encontrado");
                navigate("/bairros");
                return;
            }
            
            setForm({
                id: dados.id,
                nome: dados.nome ?? "",
                cidade: dados.cidade ?? "",
                estado: dados.estado ?? "",
                cepInicial: dados.cepInicial ?? "",
                cepFinal: dados.cepFinal ?? "",
            });
        }

        carregar();
    }, [id, navigate]);

    if (!form) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</p>;

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        
        let finalValue = value;
        
        // Ajuste para garantir que o estado seja em maiúsculas e limitado a 2 caracteres
        if (name === 'estado') {
            finalValue = value.toUpperCase().slice(0, 2);
        }

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : finalValue,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault(); // Impede o recarregamento padrão do formulário
        
        // A função atualizarBairro já espera o objeto form completo, incluindo o ID.
        const response = await atualizarBairro(form);

        if (response.ok) {
            alert("Bairro atualizado com sucesso! 🎉");
            navigate("/bairros");
        } else {
            alert("Erro ao atualizar bairro. Verifique os dados e o servidor.");
        }
    }

    const handleBackClick = () => {
        // Volta para a listagem de bairros
        navigate("/bairros"); 
    };

    return (
        <div style={styles.pageContainer}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={styles.title}>✏️ Editar Bairro **#{id}**</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* BOTÃO VOLTAR */}
                <button type="button" onClick={handleBackClick} style={styles.backButton}>
                    ⬅️ Voltar para a Lista de Bairros
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
                    <label style={styles.labelStyle} htmlFor="cepInicial">CEP Inicial:</label>
                    <input
                        name="cepInicial"
                        id="cepInicial"
                        placeholder="Ex: 01000000"
                        value={form.cepInicial}
                        onChange={handleChange}
                        required
                        style={styles.inputField}
                    />
                </div>

                {/* Input: CEP Final */}
                <div>
                    <label style={styles.labelStyle} htmlFor="cepFinal">CEP Final:</label>
                    <input
                        name="cepFinal"
                        id="cepFinal"
                        placeholder="Ex: 01099999"
                        value={form.cepFinal}
                        onChange={handleChange}
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
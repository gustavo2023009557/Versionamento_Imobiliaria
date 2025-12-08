import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 1. IMPORTAÇÃO: Adicionado 'getTiposImovel'
import { getImovelById, atualizarImovel, getBairros, getTipoImovel } from "../../api"; 

// --- ESTILOS CSS REPLICADOS DE CadastrarImoveis (MANTIDOS) ---
const styles = {
    // ... (Seus estilos CSS estão aqui) ...
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
        maxWidth: "900px",
    },
    sectionTitle: {
        borderBottom: "2px solid #0000AA",
        paddingBottom: "5px",
        marginBottom: "20px",
        color: "#007bff",
        marginTop: "30px",
    },
    inputField: {
        padding: "10px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "1em",
        marginBottom: "10px",
        width: "100%",
        boxSizing: "border-box",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "20px",
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
    },
    backButton: {
        padding: "12px 20px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1.1em",
        width: '100%',
        marginBottom: '10px',
    },
    labelStyle: {
        fontWeight: "bold",
        marginBottom: "5px",
        display: "block",
        color: "#343a40",
    },
};

export default function EditarImovel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [bairros, setBairros] = useState([]);
    // 2. ESTADO: Novo estado para armazenar os Tipos de Imóvel
    const [tiposImovel, setTiposImovel] = useState([]); 

    useEffect(() => {
        async function carregar() {
            // 3. CARREGAMENTO: Buscando tipos de imóvel em paralelo
            const [dadosImovel, listaBairros, listaTipos] = await Promise.all([
                getImovelById(id),
                getBairros(),
                getTipoImovel() // Chamada à nova função de API
            ]);

            setBairros(listaBairros || []);
            setTiposImovel(listaTipos || []); // Armazena os tipos

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
                bairro_id: dadosImovel.bairro_id ?? "",
                tipo_imovel_id: dadosImovel.tipo_imovel_id ?? "",
            });
        }

        carregar();
    }, [id, navigate]);

    // 4. VERIFICAÇÃO DE CARREGAMENTO: Espera por todos os dados
    if (!form || bairros.length === 0 || tiposImovel.length === 0) return <p>Carregando...</p>;

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        if (type === "checkbox") {
            newValue = checked;
        } else if (
            name === "precoVenda" || 
            name === "precoAluguel" || 
            name === "areaTotal" || 
            name === "areaConstruida"
        ) {
            newValue = value === "" ? "" : parseFloat(value);
        } 
        // A lógica do parseInt já está correta para 'tipo_imovel_id' e 'bairro_id'
        else if (type === "number" || name === "bairro_id" || name === "tipo_imovel_id") {
            newValue = value === "" ? "" : parseInt(value);
        }
        
        setForm({
            ...form,
            [name]: newValue,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Adiciona verificação para Tipo de Imóvel
        if (!form.bairro_id || !form.tipo_imovel_id) {
            alert("Por favor, selecione um Bairro e um Tipo de Imóvel.");
            return;
        }

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

        // Chama a API passando APENAS o objeto completo (incluindo form.id)
        const response = await atualizarImovel(formToSend);

        if (response.ok || response.status === 200) {
            alert("Imóvel atualizado com sucesso! 🎉");
            navigate("/imoveis");
        } else {
            // Tenta logar a resposta de erro para depuração
            const errorText = await response.text();
            console.error("Erro na atualização:", response.status, errorText);
            alert(`Erro ao atualizar imóvel. Status: ${response.status}. Detalhes no console.`);
        }
    }
    
    const handleBackClick = () => {
        navigate("/imoveis");
    };


    return (
        <div style={styles.pageContainer}>
            <div style={{ width: '100%', maxWidth: '900px' }}>
                <h1 style={{ color: '#0000FF' }}>📝 Editar Imóvel **#{id}**</h1>
            </div>

            <form onSubmit={handleSubmit} style={styles.formContainer}>
                
                {/* BOTÃO VOLTAR */}
                <button type="button" onClick={handleBackClick} style={styles.backButton}>
                    ⬅️ Voltar para a Lista de Imóveis
                </button>

                {/* DADOS ESSENCIAIS (TIPO E LOCALIZAÇÃO) */}
                <h2 style={{ ...styles.sectionTitle, marginTop: '0' }}>Informações Básicas</h2>

                <div style={styles.gridContainer}>
                    {/* 5. SELECT: Substituindo o input disabled pelo Select de Tipo de Imóvel */}
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
                            <option value="" disabled>Escolha o tipo</option>
                            {tiposImovel.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Seleção de Bairro (MANTIDO) */}
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
                            {bairros.map((bairro) => (
                                <option key={bairro.id} value={bairro.id}>
                                    {bairro.nome} ({bairro.cidade}/{bairro.estado})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* RESTO DO FORMULÁRIO (MANTIDO) */}
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

                {/* BOTÃO SALVAR */}
                <button type="submit" style={styles.submitButton}>
                    💾 Salvar Alterações
                </button>
            </form>
        </div>
    );
}
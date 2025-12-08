import React, { useEffect, useState } from "react";
// 1. IMPORTAÇÃO: Adicionado useNavigate
import { useParams, useNavigate } from "react-router-dom"; 
// As funções de API já estão importadas:
import { getImovelById, getBairroById, getTipoImovelById } from "../../api";

// --- ESTILOS CSS PARA DETALHES ---
const styles = {
    pageContainer: {
        padding: "30px",
        backgroundColor: "#f4f7f9", // Fundo suave
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
    },
    detailCard: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "900px",
        marginTop: "30px",
    },
    mainTitle: {
        color: "#0000FF", // Azul forte
        borderBottom: "3px solid #007bff",
        paddingBottom: "10px",
        marginBottom: "25px",
        fontSize: "2.2em",
    },
    sectionTitle: {
        color: "#343a40",
        borderLeft: "5px solid #007bff",
        paddingLeft: "10px",
        marginTop: "30px",
        marginBottom: "15px",
        fontSize: "1.5em",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "20px",
    },
    infoItem: {
        backgroundColor: "#f8f9fa",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid #e9ecef",
    },
    strong: {
        fontWeight: "bold",
        color: "#000000",
        display: "block",
        marginBottom: "3px",
    },
    value: {
        color: "#495057",
        fontSize: "1.05em",
    },
    descriptionBox: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid #ced4da",
        lineHeight: "1.6",
    },
    // NOVO ESTILO: Botão Voltar
    backButton: {
        padding: "10px 15px",
        backgroundColor: "#6c757d", // Cor cinza/secundária
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
        marginBottom: '20px',
        transition: 'background-color 0.3s',
    }
};

export default function ImovelDetalhes() {
    const { id } = useParams();
    // 2. NAVEGAÇÃO: Inicializando useNavigate
    const navigate = useNavigate();
    
    const [imovel, setImovel] = useState(null);
    const [bairroDetalhes, setBairroDetalhes] = useState(null);
    const [tipoImovelDetalhes, setTipoImovelDetalhes] = useState(null);

    useEffect(() => {
        async function carregar() {
            try {
                // ... (lógica de carregamento da API omitida por concisão, mas mantida no código)
                const imovelResponse = await getImovelById(id);
                setImovel(imovelResponse);

                if (imovelResponse) {
                    await Promise.all([
                        (async () => {
                            if (imovelResponse.bairro_id) {
                                const bairroResponse = await getBairroById(imovelResponse.bairro_id);
                                setBairroDetalhes(bairroResponse);
                            }
                        })(),
                        (async () => {
                            if (imovelResponse.tipo_imovel_id) {
                                const tipoResponse = await getTipoImovelById(imovelResponse.tipo_imovel_id);
                                setTipoImovelDetalhes(tipoResponse);
                            }
                        })()
                    ]);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            }
        }
        carregar();
    }, [id]);

    // 3. FUNÇÃO DE CLIQUE: Navega para a rota /imoveis
    const handleBackClick = () => {
        navigate("/imoveis");
    };

    if (!imovel) return <p style={{...styles.pageContainer, alignItems: 'center'}}>Carregando detalhes do Imóvel...</p>;

    const renderInfoItem = (label, value) => (
        <div style={styles.infoItem}>
            <span style={styles.strong}>{label}</span>
            <span style={styles.value}>{value}</span>
        </div>
    );

    return (
        <div style={styles.pageContainer}>
            <div style={styles.detailCard}>

                {/* 4. BOTÃO VOLTAR ADICIONADO AQUI */}
                <button 
                    style={styles.backButton} 
                    onClick={handleBackClick}
                    title="Voltar para a listagem de imóveis"
                >
                    ⬅️ Voltar para a Lista
                </button>

                <h1 style={styles.mainTitle}>Detalhes do Imóvel - **{imovel.titulo}**</h1>
                
                {/* O restante do JSX foi omitido por concisão, mas permanece o mesmo */}
                
                <h2 style={styles.sectionTitle}>ℹ️ Descrição Detalhada</h2>
                <div style={{ marginBottom: "30px" }}>
                    <p style={styles.descriptionBox}>{imovel.descricao}</p>
                </div>

                <h2 style={styles.sectionTitle}>📍 Tipo e Localização</h2>
                <div style={styles.infoGrid}>
                    {tipoImovelDetalhes ? (
                        <>
                            {renderInfoItem("Tipo de Imóvel", tipoImovelDetalhes.nome)}
                            {renderInfoItem("Características do Tipo", tipoImovelDetalhes.descricao)}
                        </>
                    ) : (
                        renderInfoItem("Tipo de Imóvel", `Carregando (ID: ${imovel.tipo_imovel_id})...`)
                    )}
                    {bairroDetalhes ? (
                        <>
                            {renderInfoItem("Bairro", `${bairroDetalhes.nome} (${bairroDetalhes.cidade}/${bairroDetalhes.estado})`)}
                            {renderInfoItem("Faixa de CEP do Bairro", `${bairroDetalhes.cepInicial} a ${bairroDetalhes.cepFinal}`)}
                        </>
                    ) : (
                        renderInfoItem("Bairro", `Carregando (ID: ${imovel.bairro_id})...`)
                    )}
                </div>

                <h2 style={styles.sectionTitle}>🗺️ Endereço Completo</h2>
                <div style={styles.infoGrid}>
                    {renderInfoItem("Logradouro", `${imovel.endereco}, Nº ${imovel.numero}`)}
                    {imovel.complemento && renderInfoItem("Complemento", imovel.complemento)}
                    {renderInfoItem("CEP Informado", imovel.cep)}
                </div>
                
                <h2 style={styles.sectionTitle}>💰 Finanças e Status</h2>
                <div style={styles.infoGrid}>
                    {renderInfoItem("Preço de Venda", `R$ ${imovel.precoVenda}`)}
                    {renderInfoItem("Preço de Aluguel", `R$ ${imovel.precoAluguel}`)}
                    {renderInfoItem("Finalidade", imovel.finalidade)}
                    {renderInfoItem("Status", imovel.status)}
                </div>

                <h2 style={styles.sectionTitle}>🏠 Características</h2>
                <div style={styles.infoGrid}>
                    {renderInfoItem("Dormitórios", imovel.dormitorios)}
                    {renderInfoItem("Banheiros", imovel.banheiros)}
                    {renderInfoItem("Vagas de Garagem", imovel.garagem)}
                    {renderInfoItem("Área Total", `${imovel.areaTotal} m²`)}
                    {renderInfoItem("Área Construída", `${imovel.areaConstruida} m²`)}
                    {renderInfoItem("Destaque no Site", imovel.destaque ? "Sim" : "Não")}
                </div>

                <h2 style={styles.sectionTitle}>✨ Outros Detalhes</h2>
                <p style={styles.descriptionBox}>{imovel.caracteristicas || "Nenhuma característica adicional informada."}</p>

            </div>
        </div>
    );
}
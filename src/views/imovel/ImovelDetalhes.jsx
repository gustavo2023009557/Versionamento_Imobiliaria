import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
// NOVAS IMPORTAÇÕES para Fotos
import { 
    getImovelById, 
    getBairroById, 
    getTipoImovelById,
    getFotosByImovelId, // Listar todas as fotos
    getCapaByImovelId // Buscar foto capa
} from "../../api";

// Constante para a base da URL das imagens (Deve ser a mesma do seu frontend e backend)
const IMAGE_BASE_URL = "http://localhost:8080/fotos/imagem/";

// --- ESTILOS CSS PARA DETALHES ---
const styles = {
    // ... (Estilos existentes) ...
    pageContainer: {
        padding: "30px",
        backgroundColor: "#f4f7f9",
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
        color: "#0000FF",
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
    backButton: {
        padding: "10px 15px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
        marginBottom: '20px',
        transition: 'background-color 0.3s',
    },
    
    // --- NOVOS ESTILOS PARA FOTOS ---
    capaImage: {
        width: '100%',
        maxHeight: '450px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'zoom-in', // Indica que a imagem é a principal/interativa
    },
    galleryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '20px',
    },
    thumbnailContainer: {
        width: '100%',
        height: '100px', // Define a altura para forçar o quadrado (com object-fit cover na img)
        overflow: 'hidden',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '2px solid #ccc',
        transition: 'border-color 0.3s, transform 0.1s',
        '&:hover': {
            transform: 'scale(1.02)'
        }
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }
};

export default function ImovelDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [imovel, setImovel] = useState(null);
    const [bairroDetalhes, setBairroDetalhes] = useState(null);
    const [tipoImovelDetalhes, setTipoImovelDetalhes] = useState(null);
    
    // NOVO ESTADO: Armazena a URL da imagem atualmente exibida em destaque
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [fotos, setFotos] = useState([]);

    useEffect(() => {
        async function carregar() {
            try {
                const imovelId = parseInt(id);

                // 1. Carregar detalhes do Imóvel
                const imovelResponse = await getImovelById(imovelId);
                setImovel(imovelResponse);

                if (imovelResponse) {
                    await Promise.all([
                        // 2. Carregar Capa e Galeria
                        (async () => {
                            const capaResponse = await getCapaByImovelId(imovelId);
                            const fotosResponse = await getFotosByImovelId(imovelId);

                            // Processa fotos
                            fotosResponse.sort((a, b) => {
                                if (a.capa && !b.capa) return -1;
                                if (!a.capa && b.capa) return 1;
                                return (a.ordem || 0) - (b.ordem || 0);
                            });
                            setFotos(fotosResponse || []);

                            // Define a Capa como a primeira imagem selecionada para destaque
                            if (capaResponse) {
                                setSelectedImageUrl(`${IMAGE_BASE_URL}${capaResponse.nomeArquivo}`);
                            } else if (fotosResponse.length > 0) {
                                // Se não houver capa definida, usa a primeira foto
                                setSelectedImageUrl(`${IMAGE_BASE_URL}${fotosResponse[0].nomeArquivo}`);
                            }
                        })(),

                        // 3. Carregar Bairro e Tipo
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
                // Lidar com erros de carregamento aqui, se necessário
            }
        }
        carregar();
    }, [id]);

    const handleBackClick = () => {
        navigate("/imoveis");
    };

    /**
     * Função que define qual imagem será exibida na área de destaque principal
     * @param {string} nomeArquivo O nome do arquivo da foto clicada.
     */
    const handleThumbnailClick = (nomeArquivo) => {
        setSelectedImageUrl(`${IMAGE_BASE_URL}${nomeArquivo}`);
    };

    if (!imovel) return <p style={{...styles.pageContainer, alignItems: 'center'}}>Carregando detalhes do Imóvel...</p>;

    const renderInfoItem = (label, value) => (
        <div style={styles.infoItem}>
            <span style={styles.strong}>{label}</span>
            <span style={styles.value}>{value}</span>
        </div>
    );
    
    // URL da imagem padrão caso nenhuma capa/foto seja encontrada ou haja erro
    const defaultImageUrl = "https://via.placeholder.com/900x450?text=Sem+Foto+Disponível";

    return (
        <div style={styles.pageContainer}>
            <div style={styles.detailCard}>

                <button 
                    style={styles.backButton} 
                    onClick={handleBackClick}
                    title="Voltar para a listagem de imóveis"
                >
                    ⬅️ Voltar para a Lista
                </button>

                <h1 style={styles.mainTitle}>Detalhes do Imóvel - **{imovel.titulo}**</h1>
                
                {/* SEÇÃO DE IMAGEM EM DESTAQUE (Agora dinâmica) */}
                <h2 style={{...styles.sectionTitle, marginTop: '0'}}>🖼️ Imagem em Destaque</h2>
                <img 
                    // Usa a URL da imagem selecionada (ou a padrão)
                    src={selectedImageUrl || defaultImageUrl} 
                    alt={`Imagem em Destaque do Imóvel ${imovel.titulo}`} 
                    style={styles.capaImage} 
                    // Garante que se o arquivo não carregar, exibe o placeholder
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl; }}
                />

                {/* --- RESTANTE DOS DETALHES --- */}
                
                <h2 style={styles.sectionTitle}>ℹ️ Descrição Detalhada</h2>
                <div style={{ marginBottom: "30px" }}>
                    <p style={styles.descriptionBox}>{imovel.descricao}</p>
                </div>
                
                {/* ... (Outras seções de detalhes do seu código) ... */}

                <h2 style={styles.sectionTitle}>📸 Galeria de Fotos ({fotos.length} Imagens)</h2>
                {fotos.length > 0 ? (
                    <div style={styles.galleryGrid}>
                        {fotos.map(foto => {
                            const currentFotoUrl = `${IMAGE_BASE_URL}${foto.nomeArquivo}`;
                            const isSelected = selectedImageUrl === currentFotoUrl;

                            return (
                                <div 
                                    key={foto.id}
                                    style={{
                                        ...styles.thumbnailContainer,
                                        // Destaque para a imagem que está sendo exibida no destaque principal
                                        border: isSelected ? '2px solid #007bff' : '2px solid #ccc'
                                    }}
                                    onClick={() => handleThumbnailClick(foto.nomeArquivo)} // Ação de clique
                                    title={foto.capa ? "Foto de Capa" : `Ordem: ${foto.ordem}`}
                                >
                                    <img 
                                        src={currentFotoUrl} 
                                        alt={`Foto ${foto.ordem || foto.id}`} 
                                        style={styles.thumbnail}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Erro+Foto"; }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>Nenhuma foto cadastrada para este imóvel.</p>
                )}

                {/* --- CONTINUAÇÃO DOS DETALHES (omiti para brevidade) --- */}
                
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
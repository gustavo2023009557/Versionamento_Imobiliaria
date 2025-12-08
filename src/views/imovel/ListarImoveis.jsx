import React, { useEffect, useState } from "react";
import { getImovelByUserId, getCapaByImovelId, deletarImovel } from "../../api"; // Certifique-se que getCapaByImovelId está no seu api.jsx
import { Link, useNavigate } from "react-router-dom";

// Constante para a URL base das imagens (Ajuste se necessário)
const IMAGE_BASE_URL = "http://localhost:8080/fotos/imagem/";

// Componente para renderizar o Card do Imóvel com a foto de capa
function ImovelCardWithCapa({ item, user }) {
    const [capa, setCapa] = useState(null);

    useEffect(() => {
        async function loadCapa() {
            try {
                // Chama a API para buscar a foto capa pelo ID do imóvel
                const capaData = await getCapaByImovelId(item.id);
                setCapa(capaData); // Pode ser um objeto FotoImovelModel ou null/undefined
            } catch (error) {
                // Em caso de erro (como erro de conexão), capa será null
                console.error(`Erro ao carregar capa do Imóvel ${item.id}:`, error);
            }
        }
        loadCapa();
    }, [item.id]);

    const capaUrl = capa ? `${IMAGE_BASE_URL}${capa.nomeArquivo}` : null;
    
    // Estilos para o container principal do card (mantendo os seus estilos)
    const cardStyle = {
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "6px",
        display: 'flex', // NOVO: Para alinhar a imagem ao lado do texto
        gap: '15px',
        alignItems: 'flex-start'
    };

    // Estilos para os botões (mantendo os seus estilos)
    const buttonStyle = {
        display: "inline-block",
        marginTop: "10px",
        padding: "8px 14px",
        borderRadius: "6px",
        textDecoration: "none",
        marginRight: "10px", // Espaço entre botões
    };
    
    const viewButton = { ...buttonStyle, background: "#007bff", color: "#fff" };
    const editButton = { ...buttonStyle, background: "#ffffff", color: "#000000", border: "1px solid #ccc" };
    const deleteButton = { ...buttonStyle, background: "rgb(255,0,0)", color: "#ffffff" };

    return (
        <div style={cardStyle}>
            {/* 1. Imagem de Capa */}
            <div style={{ flexShrink: 0, width: '180px', height: '120px', overflow: 'hidden', borderRadius: '4px' }}>
                {capaUrl ? (
                    <img
                        src={capaUrl}
                        alt={`Capa do Imóvel ${item.titulo}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d',
                        textAlign: 'center',
                        fontSize: '0.8em'
                    }}>
                        Sem Foto Capa
                    </div>
                )}
            </div>

            {/* 2. Detalhes e Botões */}
            <div style={{ flexGrow: 1 }}>
                <h2>{item.titulo}</h2>

                <p><strong>Descrição:</strong> {item.descricao}</p>
                <p><strong>Preço de Venda:</strong> R$ {item.precoVenda}</p>
                <p><strong>Preço de Aluguel:</strong> R$ {item.precoAluguel}</p>

                {/* Botões */}
                <Link to={`/imoveis/${item.id}`} style={viewButton}>
                    Ver detalhes
                </Link>
                <Link to={`/imoveis/editar/${item.id}`} style={editButton}>
                    Editar
                </Link>
                <Link
                    to="/imoveis/deletar" 
                    state={{ userId: user.id, itemId: item.id }}
                    style={deleteButton}
                >
                    Deletar
                </Link>
            </div>
        </div>
    );
}

// Componente principal de Listagem
export default function ListarImoveis() {
    const [imoveis, setImoveis] = useState([]);
    // Tenta carregar o usuário do localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.id) {
            alert("Usuário não logado ou ID ausente.");
            // Redireciona para login, se necessário
            // navigate('/login'); 
            return;
        }

        async function carregar() {
            try {
                const response = await getImovelByUserId(user.id);
                setImoveis(response);
            } catch (error) {
                console.error("Erro ao carregar imóveis:", error);
                alert("Ocorreu um erro ao carregar seus imóveis.");
            }
        }
        carregar();
    }, [user?.id, navigate]); // Depende do ID do usuário

    // Estilos para o botão Voltar (mantendo os seus estilos)
    const backButtonStyle = {
        display: "inline-block",
        marginTop: "10px",
        background: "#007bff",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: "6px",
        textDecoration: "none"
    };

    return (
        <div>
            <h1>Lista de Meus Imóveis</h1>
            <Link to={`/home`} style={backButtonStyle}>
                Voltar
            </Link>

            {imoveis.length === 0 && <p style={{ marginTop: '20px' }}>Nenhum imóvel encontrado para o seu usuário.</p>}

            <div style={{ marginTop: '20px' }}>
                {imoveis.map((item) => (
                    // Utiliza o novo componente para cada item
                    <ImovelCardWithCapa key={item.id} item={item} user={user} />
                ))}
            </div>
        </div>
    );
}
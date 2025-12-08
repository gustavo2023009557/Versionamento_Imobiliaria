import React, { useEffect, useState } from "react";
// 1. IMPORTAÇÃO: Adicionar getCapaByImovelId
import { getImovelByUserId, getCapaByImovelId } from "../../api"; 
import { Link } from "react-router-dom";

// Constante para a URL base das imagens (Ajuste se necessário)
const IMAGE_BASE_URL = "http://localhost:8080/fotos/imagem/"; 

// NOVO Componente para renderizar o card do imóvel com a capa
function ImovelCard({ item }) {
    const [capa, setCapa] = useState(null);

    useEffect(() => {
        async function loadCapa() {
            try {
                // Chama a API para buscar a foto capa pelo ID do imóvel
                const capaData = await getCapaByImovelId(item.id);
                if (capaData) {
                    setCapa(capaData);
                }
            } catch (error) {
                // A falha ao buscar a capa não deve quebrar a aplicação
                console.error(`Erro ao carregar capa do Imóvel ${item.id}:`, error);
            }
        }
        loadCapa();
    }, [item.id]);

    const capaUrl = capa ? `${IMAGE_BASE_URL}${capa.nomeArquivo}` : null;

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "6px",
            display: 'flex', // Usar flexbox para alinhar imagem e texto
            gap: '15px'
        }}>
            {/* Imagem de Capa */}
            <div style={{ flexShrink: 0, width: '150px', height: '100px', overflow: 'hidden', borderRadius: '4px' }}>
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

            {/* Detalhes e Botões (O restante do seu código JSX) */}
            <div style={{ flexGrow: 1 }}>
                <h2>{item.titulo}</h2>
                <p><strong>Descrição:</strong> {item.descricao}</p>
                <p><strong>Preço de Venda:</strong> R$ {item.precoVenda}</p>
                <p><strong>Preço de Aluguel:</strong> R$ {item.precoAluguel}</p>

                <Link
                    to={`/imoveis/${item.id}`}
                    style={{ /* ... estilos ... */ marginRight: "10px" }}
                >
                    Ver detalhes
                </Link>
                <Link
                    to={`/imoveis/editar/${item.id}`}
                    style={{ /* ... estilos ... */ }}
                >
                    Editar Imóvel
                </Link>
            </div>
        </div>
    );
}

export default function VerMeusImoveis() {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    async function carregar() {
      // ATENÇÃO: getImovelByUserId precisa do ID do usuário.
      // Substitua 1 pelo ID do usuário logado (armazenado em contexto/estado global).
      const userId = 1; 
      const response = await getImovelByUserId(userId);
      setImoveis(response);
    }
    carregar();
  }, []);

  return (
    <div>
      <h1>Lista de Imóveis</h1>

      {imoveis.length === 0 && <p>Nenhum imóvel encontrado.</p>}

      {imoveis.map((item) => (
        <ImovelCard key={item.id} item={item} />
      ))}
    </div>
  );
}
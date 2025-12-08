import React, { useEffect, useState } from "react";
// 1. Importado getCapaByImovelId
import { getImoveis, getCapaByImovelId } from "../../api"; 
import { Link } from "react-router-dom";

// 2. Definida a URL base para as imagens (copiado de EditarImovel.jsx)
const IMAGE_BASE_URL = "http://localhost:8080/fotos/imagem/"; 

export default function VerImoveis() {
  // O estado agora armazenará os dados do imóvel, incluindo o nome da capa
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        const listaImoveis = await getImoveis();

        // Mapeia a lista de imóveis e busca a capa para cada um
        const imoveisComFotosPromises = listaImoveis.map(async (imovel) => {
          try {
            // Busca a foto que está marcada como capa para este imóvel
            const capa = await getCapaByImovelId(imovel.id);
            
            // Retorna o objeto do imóvel com o nome do arquivo da capa anexado
            return {
              ...imovel,
              capaNomeArquivo: capa ? capa.nomeArquivo : null,
            };
          } catch (error) {
            console.error(`Erro ao carregar capa do imóvel ${imovel.id}:`, error);
            return { ...imovel, capaNomeArquivo: null };
          }
        });

        // Aguarda que todas as buscas de capa sejam concluídas
        const imoveisComFotos = await Promise.all(imoveisComFotosPromises);

        setImoveis(imoveisComFotos);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
        setImoveis([]);
      }
    }
    carregar();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Imóveis</h1>
      <Link
        to={`/home`}
        style={{
          display: "inline-block",
          marginTop: "10px",
          background: "#007bff",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "6px",
          textDecoration: "none",
          marginBottom: "20px"
        }}
      >
        Voltar
      </Link>
      
      {imoveis.length === 0 && <p>Nenhum imóvel encontrado.</p>}

      {imoveis.map((item) => (
        // CONTÊINER PRINCIPAL: Configurado para usar Flexbox (display: flex)
        <div key={item.id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          display: "flex", // 👈 Habilita layout lado a lado
          gap: "20px",     // 👈 Espaçamento entre a imagem e o texto
          alignItems: "flex-start" // Alinha o conteúdo ao topo
        }}>
            
          {/* CONTÊINER DA IMAGEM: Tamanho Fixo e Quadrado (200x200) */}
          <div style={{ flexShrink: 0, width: '200px', height: '200px', borderRadius: '6px', overflow: 'hidden' }}>
            {item.capaNomeArquivo ? (
              <img 
                src={`${IMAGE_BASE_URL}${item.capaNomeArquivo}`} 
                alt={`Capa do Imóvel ${item.titulo}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', // Garante que a imagem preencha o quadrado sem distorcer
                }}
                // Trata erros de carregamento da imagem
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x200?text=Sem+Foto+Capa"; }}
              />
            ) : (
              // Placeholder para quando não há capa
              <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#e9ecef', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center',
                  color: '#6c757d',
                  padding: '10px',
                  borderRadius: '6px'
              }}>
                  <p>Sem foto de capa cadastrada.</p>
              </div>
            )}
          </div>

          {/* CONTÊINER DOS DETALHES: Ocupa o restante do espaço */}
          <div style={{ flexGrow: 1 }}>
            <h2>{item.titulo}</h2>

            <p><strong>Descrição:</strong> {item.descricao}</p>
            <p><strong>Preço de Venda:</strong> R$ {item.precoVenda}</p>
            <p><strong>Preço de Aluguel:</strong> R$ {item.precoAluguel}</p>

            {/* botão para acessar página do imóvel */}
            <Link
              to={`/imoveis/${item.id}`}
              style={{
                display: "inline-block",
                marginTop: "10px",
                background: "#28a745",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "6px",
                textDecoration: "none"
              }}
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
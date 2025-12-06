import React, { useEffect, useState } from "react";
// ✅ Importação correta
import { getTipoImovel, deletarTipoImovel } from "../../api"; 
import { Link } from "react-router-dom";

// Função auxiliar para obter o ID do usuário (reutilizada de outros componentes)
const getUserId = () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    return user.id || null; 
};

export default function VerTiposImoveis() {
    // ✅ Estado alterado para Tipos de Imóveis
    const [tiposImoveis, setTiposImoveis] = useState([]); 
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function carregar() {
            // ✅ Função da API alterada para Tipos de Imóveis
            const response = await getTipoImovel(); 
            setTiposImoveis(response);
            setUserId(getUserId()); 
        }
        carregar();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            {/* ✅ Título alterado */}
            <h1>Lista de Tipos de Imóveis</h1> 

            <Link
                to={`/home`}
                style={{
                    display: "inline-block",
                    marginBottom: "20px",
                    background: "#007bff",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    textDecoration: "none"
                }}
            >
                Voltar
            </Link>

            {tiposImoveis.length === 0 && <p>Nenhum tipo de imóvel encontrado.</p>}

            {tiposImoveis.map((tipo) => (
                <div
                    key={tipo.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "6px"
                    }}
                >
                    {/* ✅ Exibindo o campo 'nome' do Tipo de Imóvel */}
                    <h2>{tipo.nome}</h2> 

                    {/* ✅ Removidos os campos de CEP, Cidade e Estado, que pertencem a Bairros */}
                    <p><strong>ID do Tipo:</strong> {tipo.id}</p>
                    <p><strong>Descrição:</strong> {tipo.descricao}</p>
                    
                    <Link
                        // ✅ Rota de Edição alterada
                        to={`/tiposimoveis/editar/${tipo.id}`} 
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            background: "#007bff",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            textDecoration: "none"
                        }}
                    >
                        Editar Tipo
                    </Link>
                    
                    <Link
                        // ✅ Rota de Deleção alterada
                        to="/tiposimoveis/deletar"
                        state={{ userId: userId, itemId: tipo.id }} 
                        style={{
                            display: "inline-block",
                            marginTop: "10px",
                            background: "#dc3545",
                            color: "#fff",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            marginLeft: "10px"
                        }}
                    >
                        Deletar Tipo
                    </Link>

                </div>
            ))}
        </div>
    );
}
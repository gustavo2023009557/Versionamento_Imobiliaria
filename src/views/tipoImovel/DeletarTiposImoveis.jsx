import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// ✅ Importação correta: deletarTipoImovel
import { deletarTipoImovel } from "../../api";

export default function DeletarTipoImovel() {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Alterado: Pega o ID do Tipo de Imóvel
    const { itemId: tipoImovelId } = location.state || {};

    const [mensagem, setMensagem] = useState('Processando solicitação...');
    const [isLoading, setIsLoading] = useState(true);

    const handleDeletion = async () => {
        try {
            // 1. Verifica se o ID do Tipo de Imóvel foi fornecido
            if (!tipoImovelId) {
                setMensagem('Erro: ID do Tipo de Imóvel não fornecido.');
                setIsLoading(false);
                return;
            }

            // 2. Chama a função de exclusão do Tipo de Imóvel
            const deleteResponse = await deletarTipoImovel(tipoImovelId);

            // Se deletarTipoImovel não retorna um objeto Response, mas sim true/false ou joga exceção, ajuste o 'if'.
            if (!deleteResponse) {
                setMensagem('Erro ao deletar o Tipo de Imóvel.');
                setIsLoading(false);
                return;
            }

            // Mensagem de sucesso alterada
            setMensagem('Tipo de Imóvel deletado com sucesso! ✅');
            setIsLoading(false);

            // 3. Redirecionar para a lista de Tipos de Imóveis
            setTimeout(() => navigate('/tiposimoveis'), 1500);

        } catch (error) {
            console.error('Erro na deleção do Tipo de Imóvel:', error);
            setMensagem('Erro inesperado ao processar a solicitação.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleDeletion();
    }, [tipoImovelId]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Exclusão de Tipo de Imóvel</h2>
            <p style={{ color: isLoading ? 'blue' : 'black' }}>
                {mensagem}
            </p>
            {isLoading && <p>Carregando...</p>}
        </div>
    );
}
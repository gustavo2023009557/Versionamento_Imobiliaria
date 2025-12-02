import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImovelById, deletarImovel } from "../api";

function DeletarImovelPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, itemId } = location.state || {};

  const [mensagem, setMensagem] = useState('Processando solicitação...');
  const [isLoading, setIsLoading] = useState(true);

  const handleDeletion = async () => {
    try {
      // 1. Verifica se recebeu os IDs
      if (!userId || !itemId) {
        setMensagem('Erro: ID do usuário ou do imóvel não fornecido.');
        setIsLoading(false);
        return;
      }

      // 2. Busca o imóvel no banco
      const imovel = await getImovelById(itemId);
      
      if (!imovel || !imovel.idUsuario) {
        setMensagem('Erro: Imóvel não encontrado.');
        setIsLoading(false);
        return;
      }

      // 3. Verifica se o usuário logado é o dono do imóvel
      if (imovel.idUsuario !== userId) {
        setMensagem('Erro: Você não tem permissão para excluir este imóvel.');
        setIsLoading(false);
        return;
      }

      // 4. Usuário é o dono → deletar o imóvel
      const deleteResponse = await deletarImovel(itemId);

      if (!deleteResponse.ok) {
        setMensagem('Erro ao deletar o imóvel.');
        setIsLoading(false);
        return;
      }

      setMensagem('Imóvel deletado com sucesso!');
      setIsLoading(false);

      // 5. Redirecionar após alguns segundos
      setTimeout(() => navigate('/imoveis'), 1500);

    } catch (error) {
      console.error(error);
      setMensagem('Erro inesperado ao processar a solicitação.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDeletion();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Exclusão de Imóvel</h2>
      <p style={{ color: isLoading ? 'blue' : 'black' }}>
        {mensagem}
      </p>
      {isLoading && <p>Carregando...</p>}
    </div>
  );
}

export default DeletarImovelPage;

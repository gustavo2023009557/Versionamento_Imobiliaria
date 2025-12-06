import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// ✅ Importação correta: deletarBairro
import { deletarBairro } from "../../api"; 

function DeletarBairro() {
  const location = useLocation();
  const navigate = useNavigate();

  // O itemId agora é o ID do Bairro
  const { itemId: bairroId } = location.state || {}; 

  const [mensagem, setMensagem] = useState('Processando solicitação...');
  const [isLoading, setIsLoading] = useState(true);

  const handleDeletion = async () => {
    try {
      // 1. Verifica se o ID do Bairro foi fornecido
      if (!bairroId) {
        setMensagem('Erro: ID do Bairro não fornecido.');
        setIsLoading(false);
        return;
      }

      // 2. Chama a função de exclusão do Bairro (sem lógica de propriedade de usuário)
      const deleteResponse = await deletarBairro(bairroId);

      // Assumindo que a função deletarBairro retorna um objeto com propriedade 'ok' (como um fetch Response)
      if (deleteResponse && !deleteResponse.ok) {
        setMensagem('Erro ao deletar o Bairro. (Pode haver Imóveis associados!)');
        setIsLoading(false);
        return;
      }

      // Se deletarBairro não retorna um objeto Response, mas sim true/false ou joga exceção, ajuste o 'if'.
      if (!deleteResponse) {
          setMensagem('Erro ao deletar o Bairro.');
          setIsLoading(false);
          return;
      }

      setMensagem('Bairro deletado com sucesso! ✅');
      setIsLoading(false);

      // 3. Redirecionar para a lista de Bairros após alguns segundos
      setTimeout(() => navigate('/bairros'), 1500);

    } catch (error) {
      console.error('Erro na deleção do Bairro:', error);
      setMensagem('Erro inesperado ao processar a solicitação.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDeletion();
  }, [bairroId]); // Adicionado bairroId para evitar loop infinito em alguns casos

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Exclusão de Bairro</h2>
      <p style={{ color: isLoading ? 'blue' : 'black' }}>
        {mensagem}
      </p>
      {isLoading && <p>Carregando...</p>}
    </div>
  );
}

export default DeletarBairro;
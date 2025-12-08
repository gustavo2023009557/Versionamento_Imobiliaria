import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersByEmailAndSenha } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const response = await getUsersByEmailAndSenha(email, senha);

    if (response.status === 401) {
      alert("Email ou senha incorretos!");
      return;
    }

    const user = await response.json();

    // Salvar usuário logado no navegador
    localStorage.setItem("user", JSON.stringify(user));

    // Redirecionar
    navigate("/home");
  }

  // --- Estilos para o container principal (fundo azul e centralização) ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',    // Centraliza horizontalmente
    minHeight: '100vh',      // Garante que ocupe a altura total da tela
    backgroundColor: '#0000CC', // Azul
    padding: '20px',
    boxSizing: 'border-box'
  };

  // --- Estilos para o formulário (card centralizado) ---
  const formContainerStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px', // Define uma largura máxima para não ficar muito largo
    textAlign: 'center'
  };

  // --- Estilos para os inputs e botão ---
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box' // Importante para o padding não aumentar a largura total
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    margin: '15px 0 0 0',
    backgroundColor: '#6c757d', // Cinza
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  };
  
  // Estilo para o hover (opcional, melhora a UX)
  const buttonHoverStyle = {
    backgroundColor: '#5a6268'
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1>
          Bem-Vindo! Faça seu login.
        </h1>
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} // Aplicando o estilo do input
          />

          <input 
            type="password" 
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={inputStyle} // Aplicando o estilo do input
          />

          <button 
            type="submit"
            style={buttonStyle} // Aplicando o estilo do botão
            // Você pode adicionar um evento onMouseOver/onMouseOut para o hover, mas é mais fácil com CSS puro
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
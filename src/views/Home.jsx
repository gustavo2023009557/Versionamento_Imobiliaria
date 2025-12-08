import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Dados do usuário logado
  const user = JSON.parse(localStorage.getItem("user"));

  // Função de logout
  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  // --- Estilos CSS (Mantidos e Ajustados) ---

  const mainContainerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0000CC", // Azul Escuro
    padding: "0",
    color: "white",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#0000AA",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const userSectionStyle = {
    display: "flex",
    alignItems: "center",
  };

  const userPhotoStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#CCCCCC",
    marginLeft: "15px",
    border: "2px solid white",
  };

  const contentStyle = {
    padding: "20px",
  };

  const navListStyle = {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
  };

  // Estilo para os itens de navegação (Fundo Branco/Cinza)
  const navItemStyle = (isAdminOption = false) => ({
    backgroundColor: isAdminOption ? "#E9ECEF" : "white", // Cinza claro para Admin, Branco para normal
    margin: "10px 0",
    padding: "15px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: 'flex', 
    alignItems: 'center',
  });

  // Estilo para os links de navegação (Inclui espaço para o ícone)
  const linkStyle = (isAdminOption = false) => ({
    textDecoration: "none",
    color: isAdminOption ? "#0000A0" : "#333",
    fontWeight: "bold",
    display: "block",
    marginLeft: '10px', // Espaço entre o ícone e o texto do link
  });

  const logoutButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#FF5733",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  // --- Mapeamento dos Ícones (Símbolos Unicode Padrão) ---
  const iconMap = {
    verImoveis: '🔍', // Lupa (Pesquisar/Visualizar)
    cadastrarImovel: '➕', // Sinal de Adição (Cadastrar)
    meusImoveis: '🏠',    // Casa (Meus Itens)
    cadastrarBairro: '➕', // Sinal de Adição (Cadastrar)
    editarBairro: '⚙️',     // Engrenagem (Editar/Configurações)
    cadastrarTipo: '➕',  // Sinal de Adição (Cadastrar)
    editarTipo: '⚙️',      // Engrenagem (Editar/Configurações)
    adminTitle: '🛠️'     // Ferramentas (Administração)
  };

  return (
    <div style={mainContainerStyle}>
      {/* HEADER: Nome do Usuário, Foto e Botão Sair */}
      <div style={headerStyle}>

        {/* Informação do Usuário */}
        <div style={userSectionStyle}>
          <span>Bem-vindo, **{user.nome}**</span>
          <div style={userPhotoStyle} title="Foto do Usuário">
            {/* Placeholder para a foto do usuário */}
          </div>
        </div>

        <button onClick={logout} style={logoutButtonStyle}>
          Sair
        </button>

      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={contentStyle}>
        <h1>Informações da Conta</h1>

        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Tipo:</b> {user.tipo}
        </p>

        <hr />

        <h2>📌 Navegação Rápida</h2>

        <ul style={navListStyle}>
          {/* Opções Normais (Fundo Branco) */}
          <li style={navItemStyle(false)}>
            <span>{iconMap.verImoveis}</span>
            <Link to="/imoveis" style={linkStyle(false)}>Ver Imóveis</Link>
          </li>
          <li style={navItemStyle(false)}>
            <span>{iconMap.cadastrarImovel}</span>
            <Link to="/imoveis/cadastrar" style={linkStyle(false)}>Cadastrar Imóvel</Link>
          </li>
          <li style={navItemStyle(false)}>
            <span>{iconMap.meusImoveis}</span>
            <Link to="/imoveis/listar" style={linkStyle(false)}>Ver Meus Imóveis</Link>
          </li>

          {/* Opções apenas para ADMIN (Fundo Cinza) */}
          {user.tipo === "admin" && (
            <>
              <div style={{ marginTop: '20px', color: 'white' }}>
                <h3>{iconMap.adminTitle} Administração</h3>
              </div>

              <li style={navItemStyle(true)}>
                <span>{iconMap.cadastrarBairro}</span>
                <Link to="/bairros/cadastrar" style={linkStyle(true)}>Cadastrar Bairro</Link>
              </li>
              <li style={navItemStyle(true)}>
                <span>{iconMap.editarBairro}</span>
                <Link to="/bairros" style={linkStyle(true)}>Editar Bairro</Link>
              </li>
              <li style={navItemStyle(true)}>
                <span>{iconMap.cadastrarTipo}</span>
                <Link to="/tiposimoveis/cadastrar" style={linkStyle(true)}>Cadastrar Tipo de Imóvel</Link>
              </li>
              <li style={navItemStyle(true)}>
                <span>{iconMap.editarTipo}</span>
                <Link to="/tiposimoveis" style={linkStyle(true)}>Editar Tipo de Imóvel</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
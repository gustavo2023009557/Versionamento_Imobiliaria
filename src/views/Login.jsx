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

  return (
    <div>
      <h1>Login</h1>
      
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password" 
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

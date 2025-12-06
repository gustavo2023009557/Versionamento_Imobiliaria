// src/pages/CadastrarBairro.jsx
import React, { useState } from "react";
// Certifique-se de que o caminho para a sua função cadastrarBairro está correto
import { cadastrarBairro } from "../../api";
import { useNavigate } from "react-router-dom";

export default function CadastrarBairro() {
    const navigate = useNavigate();

    // 1. Inicializa o estado com os campos do BairroModel
    const [form, setForm] = useState({
        nome: "",
        cidade: "",
        estado: "",
        cepInicial: "",
        cepFinal: "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // 2. Chama a função de cadastro com os dados do formulário
        const response = await cadastrarBairro(form);

        // 3. O BairroController retorna o status 201 (Created) para sucesso
        if (response.status === 201) {
            alert("Bairro cadastrado com sucesso!");
            // Altere a rota de redirecionamento para a página de listagem de bairros
            navigate("/bairros");
        } else {
            alert("Erro ao cadastrar bairro");
        }
    }

    return (
        <div className="container mt-4">
            <h1>Cadastrar Bairro</h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxWidth: "400px",
                }}
            >
                {/* Input: Nome */}
                <input
                    name="nome"
                    placeholder="Nome do Bairro"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />

                {/* Input: Cidade */}
                <input
                    name="cidade"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    required
                />

                {/* Input: Estado */}
                <input
                    name="estado"
                    placeholder="Estado (ex: SP, RJ)"
                    value={form.estado}
                    onChange={handleChange}
                    required
                />

                {/* Input: CEP Inicial */}
                <input
                    name="cepInicial"
                    placeholder="CEP Inicial"
                    value={form.cepInicial}
                    onChange={handleChange}
                    required
                />

                {/* Input: CEP Final */}
                <input
                    name="cepFinal"
                    placeholder="CEP Final"
                    value={form.cepFinal}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Salvar Bairro</button>
            </form>
        </div>
    );
}
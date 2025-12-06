import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBairroById, atualizarBairro } from "../../api";

export default function EditarBairro() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Inicializando com null para exibir 'Carregando...'
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function carregar() {
            const dados = await getBairroById(id);
            if (!dados) {
                alert("Bairro não encontrado");
                navigate("/bairros");
                return;
            }
            
            // ✅ INCLUSÃO DE TODOS OS CAMPOS DO MODELO DE BAIRRO
            setForm({
                id: dados.id,
                nome: dados.nome ?? "",
                cidade: dados.cidade ?? "",
                estado: dados.estado ?? "",
                cepInicial: dados.cepInicial ?? "",
                cepFinal: dados.cepFinal ?? "",
            });
        }

        carregar();
    }, [id, navigate]);

    if (!form) return <p>Carregando...</p>;

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    async function salvar() {
        const response = await atualizarBairro(form);

        if (response.ok) {
            alert("Bairro atualizado!");
            navigate("/bairros");
        } else {
            alert("Erro ao atualizar bairro. Verifique os dados e o servidor.");
        }
    }

    return (
        <div>
            <h1>Editar Bairro #{id}</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>

                <label>Nome do Bairro:</label>
                <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                />

                <label>Cidade:</label>
                <input
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                />

                <label>Estado:</label>
                <input
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                />

                <label>CEP Inicial:</label>
                <input
                    name="cepInicial"
                    value={form.cepInicial}
                    onChange={handleChange}
                />

                <label>CEP Final:</label>
                <input
                    name="cepFinal"
                    value={form.cepFinal}
                    onChange={handleChange}
                />

                <button onClick={salvar}>Salvar alterações</button>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    getImovelById, 
    atualizarImovel, 
    getBairros, 
    getTipoImovel, 
    getFotosByImovelId,
    getCapaByImovelId,
    cadastrarFotoImovel,
    deletarFotoImovel,
    setFotoCapa
} from "../../api"; 

// Constante para a base da URL das imagens
const IMAGE_BASE_URL = "http://localhost:8080/fotos/imagem/";

// --- ESTILOS CSS PARA EDIÇÃO ---
const styles = {
    pageContainer: {
        padding: "30px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    formContainer: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "800px",
    },
    mainTitle: {
        color: "#007bff",
        textAlign: "center",
        marginBottom: "30px",
        borderBottom: "2px solid #007bff",
        paddingBottom: "10px",
        width: "100%",
    },
    sectionTitle: {
        borderBottom: "2px solid #ced4da",
        paddingBottom: "5px",
        marginBottom: "20px",
        color: "#495057",
        marginTop: "30px",
    },
    labelStyle: {
        fontWeight: "bold",
        display: "block",
        marginTop: "10px",
        marginBottom: "5px",
        color: "#343a40",
    },
    inputField: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        boxSizing: "border-box",
    },
    textArea: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        boxSizing: "border-box",
        minHeight: "100px",
        resize: "vertical",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "15px",
    },
    submitButton: {
        padding: "12px 20px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
        marginTop: "20px",
        width: "100%",
        transition: 'background-color 0.3s',
    },
    requiredSelect: {
        width: "100%",
        padding: "10px",
        border: "1px solid #007bff",
        borderRadius: "4px",
        boxSizing: "border-box",
        backgroundColor: "#e7f0ff",
    },
    // --- ESTILOS DE FOTO ---
    uploadBox: {
        padding: '15px',
        border: '1px dashed #007bff',
        borderRadius: '5px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    galleryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '20px',
    },
    photoCard: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
    },
    photoImage: {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
        display: 'block'
    },
    photoActions: {
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    capaBadge: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '3px',
        fontSize: '0.8em',
        fontWeight: 'bold',
    },
    actionButton: (color, isCapa = false) => ({
        padding: '8px',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        backgroundColor: isCapa ? '#6c757d' : color,
        color: 'white',
        fontSize: '0.9em',
        transition: 'background-color 0.2s',
    })
};

export default function EditarImovel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [bairros, setBairros] = useState([]);
    const [tiposImovel, setTiposImovel] = useState([]); 
    
    // ESTADOS PARA FOTOS
    const [fotos, setFotos] = useState([]); 
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null); 
    const imovelId = parseInt(id);

    // FUNÇÃO PARA RECARREGAR FOTOS
    const refreshFotos = async () => {
        const listaFotos = await getFotosByImovelId(imovelId);
        const capaFoto = await getCapaByImovelId(imovelId);

        let fotosComCapa = listaFotos.map(foto => ({
            ...foto,
            capa: capaFoto && foto.id === capaFoto.id
        }));
        
        fotosComCapa.sort((a, b) => {
             if (a.capa && !b.capa) return -1;
             if (!a.capa && b.capa) return 1;
             return (a.ordem || 0) - (b.ordem || 0);
        });
        
        setFotos(fotosComCapa || []);
    };
    
    // --- FUNÇÕES DE HANDLER ---

    const handleFileChange = (e) => {
        setArquivoSelecionado(e.target.files[0]);
    };
    
    // FUNÇÃO CORRIGIDA PARA NÃO RECEBER O EVENTO E CHAMADA PELO BOTÃO
    const handleUploadFoto = async () => {
        if (!arquivoSelecionado) {
            alert("Selecione um arquivo de imagem para upload.");
            return;
        }

        try {
            const dadosFoto = {
                imovelId: imovelId,
                // O backend deve definir 'capa' e 'ordem'
            };

            const response = await cadastrarFotoImovel(arquivoSelecionado, dadosFoto); 

            if (response.ok) {
                alert("Foto carregada com sucesso! Lembre-se de definir a ordem e/ou capa.");
                setArquivoSelecionado(null);
                document.getElementById('file-upload-input').value = null; // Limpa o input manualmente
                await refreshFotos();
            } else {
                const errorText = await response.text();
                alert(`Erro ao carregar foto: ${errorText || response.statusText}`);
            }
        } catch (error) {
            alert("Erro de comunicação ao carregar a foto.");
            console.error(error);
        }
    };
    
    const handleDeleteFoto = async (fotoId, isCapa) => {
        if (isCapa && fotos.length > 1) {
             alert("A foto de capa não pode ser deletada diretamente se houver outras fotos. Por favor, defina outra foto como capa primeiro.");
             return;
        }

        if (!window.confirm("Tem certeza que deseja DELETAR esta foto? Esta ação é irreversível.")) return;

        try {
            await deletarFotoImovel(fotoId); //
            alert("Foto deletada com sucesso!");
            await refreshFotos();
        } catch (error) {
            alert(`Erro ao deletar foto.`);
            console.error(error);
        }
    };
    
    const handleSetCapa = async (fotoId) => {
        try {
            await setFotoCapa(fotoId, imovelId); //
            alert("Nova foto de capa definida!");
            await refreshFotos();
        } catch (error) {
            alert(`Erro ao definir foto como capa. Certifique-se de que a foto existe.`);
            console.error(error);
        }
    };
    
    // --- EFEITO DE CARREGAMENTO ---

    useEffect(() => {
        async function carregar() {
            try {
                const [dadosImovel, listaBairros, listaTipos] = await Promise.all([
                    getImovelById(imovelId), //
                    getBairros(), //
                    getTipoImovel() //
                ]);

                setBairros(listaBairros || []);
                setTiposImovel(listaTipos || []); 

                if (!dadosImovel) {
                    alert("Imóvel não encontrado");
                    navigate("/imoveis");
                    return;
                }

                setForm({
                    id: dadosImovel.id,
                    titulo: dadosImovel.titulo ?? "",
                    descricao: dadosImovel.descricao ?? "",
                    precoVenda: dadosImovel.precoVenda ?? "",
                    precoAluguel: dadosImovel.precoAluguel ?? "",
                    finalidade: dadosImovel.finalidade ?? "",
                    status: dadosImovel.status ?? "",
                    dormitorios: dadosImovel.dormitorios ?? "",
                    banheiros: dadosImovel.banheiros ?? "",
                    garagem: dadosImovel.garagem ?? "",
                    areaTotal: dadosImovel.areaTotal ?? "",
                    areaConstruida: dadosImovel.areaConstruida ?? "",
                    endereco: dadosImovel.endereco ?? "",
                    numero: dadosImovel.numero ?? "",
                    complemento: dadosImovel.complemento ?? "",
                    cep: dadosImovel.cep ?? "",
                    caracteristicas: dadosImovel.caracteristicas ?? "",
                    destaque: dadosImovel.destaque ?? false,
                    bairro_id: dadosImovel.bairro_id ?? "",
                    tipo_imovel_id: dadosImovel.tipo_imovel_id ?? "" 
                });
                
                await refreshFotos();

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Ocorreu um erro ao carregar os dados para edição.");
            }
        }

        carregar();
    }, [id, navigate]);

    if (!form || bairros.length === 0 || tiposImovel.length === 0) return (
        <div style={styles.pageContainer}>
            <p style={{ marginTop: '50px' }}>Carregando dados do Imóvel para Edição...</p>
        </div>
    );

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        if (
            type === "number" || 
            name === "bairro_id" || 
            name === "tipo_imovel_id" || 
            name === "dormitorios" || 
            name === "banheiros" || 
            name === "garagem"
        ) {
            newValue = value === "" ? "" : parseInt(value);
        }

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : newValue,
        });
    }

    // ✅ FUNÇÃO SALVAR CORRIGIDA PARA INJETAR O ID DO USUÁRIO DA SESSÃO
// ✅ FUNÇÃO SALVAR CORRIGIDA PARA INJETAR O ID DO USUÁRIO DA SESSÃO
async function salvar(e) {
    e.preventDefault(); 
    
    // 🔑 1. LÊ O ID DIRETAMENTE DO localStorage CONFORME SOLICITADO
    let userId = null;
    try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const user = JSON.parse(userJson);
            userId = user.id; // Pega o ID do objeto user
        }
    } catch (error) {
        console.error("Erro ao ler ou parsear o usuário do localStorage:", error);
        alert("Erro na sessão do usuário. Por favor, faça login novamente.");
        return;
    }

    if (!userId) {
        alert("Erro: ID do usuário não encontrado na sessão. Não é possível salvar.");
        return;
    }

    if (!form.bairro_id || !form.tipo_imovel_id) {
        alert("Por favor, selecione um Bairro e um Tipo de Imóvel.");
        return;
    }
    
    // 2. CRIA UM NOVO OBJETO INJETANDO O usuario_id
    const imovelParaSalvar = {
        ...form,
        usuario_id: userId, // Garante que o ID do dono seja enviado
    };

    try {
        // 3. PASSA O OBJETO CORRIGIDO PARA A API
        const response = await atualizarImovel(imovelParaSalvar); 

        if (response.ok) {
            alert("Imóvel atualizado com sucesso!");
            navigate("/imoveis");
        } else {
            const errorText = await response.text();
            alert(`Erro ao atualizar imóvel: ${errorText || response.statusText}`);
        }
    } catch (error) {
        console.error("Erro na requisição de atualização:", error);
        alert("Ocorreu um erro de comunicação ao tentar salvar as alterações.");
    }
}

    // --- RENDERIZAÇÃO DO COMPONENTE ---
    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.mainTitle}>✏️ Editar Imóvel #{id}</h1>

            {/* FORMULÁRIO PRINCIPAL */}
            <div style={styles.formContainer}>
                <form onSubmit={salvar}>
                    
                    <h2 style={styles.sectionTitle}>📍 Localização e Tipo</h2>
                    
                    <div style={styles.gridContainer}>
                        <div>
                            <label htmlFor="bairro_id" style={styles.labelStyle}>Bairro:</label>
                            <select
                                id="bairro_id"
                                name="bairro_id"
                                value={form.bairro_id || ""}
                                onChange={handleChange}
                                style={styles.requiredSelect}
                                required
                            >
                                <option value="" disabled>Escolha um bairro</option>
                                {bairros.map((bairro) => (
                                    <option key={bairro.id} value={bairro.id}>
                                        {bairro.nome} ({bairro.cidade}/{bairro.estado})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="tipo_imovel_id" style={styles.labelStyle}>Tipo de Imóvel:</label>
                            <select
                                id="tipo_imovel_id"
                                name="tipo_imovel_id"
                                value={form.tipo_imovel_id || ""}
                                onChange={handleChange}
                                style={styles.requiredSelect}
                                required
                            >
                                <option value="" disabled>Escolha um tipo</option>
                                {tiposImovel.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <h2 style={styles.sectionTitle}>ℹ️ Detalhes Básicos</h2>
                    
                    <label htmlFor="titulo" style={styles.labelStyle}>Título:</label>
                    <input name="titulo" id="titulo" placeholder="Título que aparece na listagem" value={form.titulo} onChange={handleChange} style={styles.inputField} required />

                    <label htmlFor="descricao" style={styles.labelStyle}>Descrição Completa:</label>
                    <textarea name="descricao" id="descricao" placeholder="Descrição detalhada do imóvel" value={form.descricao} onChange={handleChange} style={styles.textArea} required />

                    <h2 style={styles.sectionTitle}>💰 Valores e Finalidade</h2>
                    
                    <div style={styles.gridContainer}>
                        <div>
                            <label htmlFor="precoVenda" style={styles.labelStyle}>Preço de Venda (R$):</label>
                            <input type="number" name="precoVenda" id="precoVenda" placeholder="0.00" value={form.precoVenda} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="precoAluguel" style={styles.labelStyle}>Preço de Aluguel (R$):</label>
                            <input type="number" name="precoAluguel" id="precoAluguel" placeholder="0.00" value={form.precoAluguel} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="finalidade" style={styles.labelStyle}>Finalidade:</label>
                            <input name="finalidade" id="finalidade" placeholder="Venda/Aluguel/Ambos" value={form.finalidade} onChange={handleChange} style={styles.inputField} required />
                        </div>
                        <div>
                            <label htmlFor="status" style={styles.labelStyle}>Status:</label>
                            <input name="status" id="status" placeholder="Disponível/Vendido/Alugado" value={form.status} onChange={handleChange} style={styles.inputField} required />
                        </div>
                    </div>
                    
                    <h2 style={styles.sectionTitle}>🏠 Características</h2>
                    
                    <div style={styles.gridContainer}>
                        <div>
                            <label htmlFor="dormitorios" style={styles.labelStyle}>Dormitórios:</label>
                            <input type="number" name="dormitorios" id="dormitorios" value={form.dormitorios} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="banheiros" style={styles.labelStyle}>Banheiros:</label>
                            <input type="number" name="banheiros" id="banheiros" value={form.banheiros} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="garagem" style={styles.labelStyle}>Vagas de Garagem:</label>
                            <input type="number" name="garagem" id="garagem" value={form.garagem} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="areaTotal" style={styles.labelStyle}>Área Total (m²):</label>
                            <input type="number" name="areaTotal" id="areaTotal" value={form.areaTotal} onChange={handleChange} style={styles.inputField} />
                        </div>
                        <div>
                            <label htmlFor="areaConstruida" style={styles.labelStyle}>Área Construída (m²):</label>
                            <input type="number" name="areaConstruida" id="areaConstruida" value={form.areaConstruida} onChange={handleChange} style={styles.inputField} />
                        </div>
                    </div>
                    
                    <h2 style={styles.sectionTitle}>🗺️ Endereço</h2>

                    <label htmlFor="endereco" style={styles.labelStyle}>Logradouro (Rua, Avenida, etc.):</label>
                    <input name="endereco" id="endereco" placeholder="Rua Exemplo" value={form.endereco} onChange={handleChange} style={styles.inputField} required />

                    <div style={styles.gridContainer}>
                        <div>
                            <label htmlFor="numero" style={styles.labelStyle}>Número:</label>
                            <input name="numero" id="numero" placeholder="Nº" value={form.numero} onChange={handleChange} style={styles.inputField} required />
                        </div>
                        <div>
                            <label htmlFor="complemento" style={styles.labelStyle}>Complemento (Opcional):</label>
                            <input name="complemento" id="complemento" placeholder="Apto, Bloco, etc." value={form.complemento} onChange={handleChange} style={styles.inputField} />
                        </div>
                    </div>
                    
                    <label htmlFor="cep" style={styles.labelStyle}>CEP:</label>
                    <input name="cep" id="cep" placeholder="00000-000" value={form.cep} onChange={handleChange} style={styles.inputField} required />
                    
                    <h2 style={styles.sectionTitle}>✨ Outras Informações</h2>

                    <label htmlFor="caracteristicas" style={styles.labelStyle}>Detalhes Adicionais/Características:</label>
                    <textarea name="caracteristicas" id="caracteristicas" placeholder="Piscina, churrasqueira, porteiro 24h..." value={form.caracteristicas} onChange={handleChange} style={styles.textArea} />
                    
                    <div style={{ marginTop: '15px' }}>
                        <label style={{ ...styles.labelStyle, display: 'inline-flex', alignItems: 'center' }}>
                            Destaque no Site:
                            <input
                                name="destaque"
                                type="checkbox"
                                checked={form.destaque}
                                onChange={handleChange}
                                style={{ marginLeft: "10px", width: 'auto' }}
                            />
                        </label>
                    </div>

                    {/* ---------------------------------------------------------------------- */}
                    <h2 style={styles.sectionTitle}>📸 Gerenciamento de Fotos</h2>

                    {/* Área de Upload */}
                    <div style={styles.uploadBox}>
                        <label htmlFor="file-upload-input" style={{...styles.labelStyle, marginTop: 0}}>Carregar Nova Foto:</label>
                        <input 
                            id="file-upload-input" // Adicionado ID para limpar o campo
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={styles.inputField}
                        />
                        <button 
                            // O botão chama a função no click e tem type="button" para não submeter o formulário principal
                            onClick={handleUploadFoto} 
                            type="button" 
                            style={styles.actionButton("#007bff")} 
                            disabled={!arquivoSelecionado}
                        >
                            📤 Fazer Upload
                        </button>
                    </div>
                    
                    {/* Galeria de Fotos */}
                    <h3 style={{...styles.labelStyle, marginTop: '20px'}}>Fotos Cadastradas ({fotos.length})</h3>
                    <div style={styles.galleryGrid}>
                        {fotos.length === 0 ? (
                            <p style={{ gridColumn: '1 / -1' }}>Nenhuma foto cadastrada. Faça o upload acima.</p>
                        ) : (
                            fotos.map(foto => (
                                <div key={foto.id} style={styles.photoCard}>
                                    <img 
                                        src={`${IMAGE_BASE_URL}${foto.nomeArquivo}`} 
                                        alt={`Foto ${foto.id}`} 
                                        style={styles.photoImage} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Erro"; }}
                                    />
                                    {foto.capa && <span style={styles.capaBadge}>CAPA</span>}
                                    
                                    <div style={styles.photoActions}>
                                        <button 
                                            onClick={() => handleSetCapa(foto.id)}
                                            style={styles.actionButton("#28a745", foto.capa)}
                                            disabled={foto.capa}
                                        >
                                            {foto.capa ? "É CAPA" : "Definir como Capa"}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteFoto(foto.id, foto.capa)}
                                            style={styles.actionButton("#dc3545")} 
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* ---------------------------------------------------------------------- */}

                    {/* BOTÃO SALVAR ALTERAÇÕES GERAIS */}
                    <button type="submit" style={styles.submitButton}>
                        💾 Salvar Alterações (Dados do Imóvel)
                    </button>
                </form>
            </div>
        </div>
    );
}
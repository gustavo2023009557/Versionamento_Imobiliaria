//
//USUARIO
//

//listar todos os usuários do sistema
export async function getUsers() {
  const response = await fetch("http://localhost:8080/users");
  return await response.json();
}

//get users by id
export async function getUserById(id) {
  const response = await fetch("http://localhost:8080/users/" + id);
  return await response.json();
}

//get user by email and senha (login)
export async function getUsersByEmailAndSenha(email, senha) {
  return await fetch("http://localhost:8080/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
}
//
//IMOVEL
//

//Pegar todos os imóveis
export async function getImoveis() {
  const response = await fetch("http://localhost:8080/imoveis");
  return await response.json();
}

//Pegar um imóvel por seu id
export async function getImovelById(id) {
  const response = await fetch(`http://localhost:8080/imoveis/${id}`);
  return response.json();
}

//Pegar um imóvel pelo id do usuário
export async function getImovelByUserId(id) {
  const response = await fetch(`http://localhost:8080/imoveis/meusimoveis/${id}`);
  return response.json();
}

//Cadastrar imóvel
export async function cadastrarImovel(imovel) {
  return fetch("http://localhost:8080/imoveis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imovel),
  });
}

//Atualizae um imóvel
export async function atualizarImovel(imovel) {
  return fetch(`http://localhost:8080/imoveis/${imovel.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imovel),
  });
}

//Deletar Imovel
export async function deletarImovel(id) {
  return fetch(`http://localhost:8080/imoveis/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//
//BAIRRO
//
//Pegar todos os bairros
export async function getBairros() {
  const response = await fetch("http://localhost:8080/bairros");
  return await response.json();
}

//cadastrar um bairro no sistema
export async function cadastrarBairro(bairro) {
  return fetch("http://localhost:8080/bairros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bairro),
  });
}

//Pegar um bairro por seu id
export async function getBairroById(id) {
  const response = await fetch(`http://localhost:8080/bairros/${id}`);
  return response.json();
}

//Atualizar bairro
export async function atualizarBairro(bairro) {
  return fetch(`http://localhost:8080/bairros/${bairro.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bairro),
  });
}

//Deletar um Bairro
export async function deletarBairro(id) {
  return fetch(`http://localhost:8080/bairros/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}


//
//TIPOIMOVELCONTROLLER
//
//Pegar todos os tipo de imovel
export async function getTipoImovel() {
  const response = await fetch("http://localhost:8080/tiposimoveis");
  return await response.json();
}

//cadastrar um tipo de imovel no sistema
export async function cadastrarTipoImovel(tipoImovel) {
  return fetch("http://localhost:8080/tiposimoveis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tipoImovel),
  });
}

//Pegar um tipo de imovel por seu id
export async function getTipoImovelById(id) {
  const response = await fetch(`http://localhost:8080/tiposimoveis/${id}`);
  return response.json();
}

//Atualizar um tipo de imovel
export async function atualizarTipoImovel(tipoImovel) {
  return fetch(`http://localhost:8080/tiposimoveis/${tipoImovel.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tipoImovel),
  });
}

//Deletar um tipo de imovel
export async function deletarTipoImovel(id) {
  return fetch(`http://localhost:8080/tiposimoveis/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//
//FOTOIMOVELCONTROLLER
//

// Listar todas as fotos de um imóvel pelo ID do imóvel
// GET /fotos/imovel/{id}
export async function getFotosByImovelId(imovelId) {
  const response = await fetch(`http://localhost:8080/fotos/imovel/${imovelId}`);
  return await response.json();
}

// Buscar a foto marcada como CAPA de um imóvel pelo ID do imóvel
// GET /fotos/capa/{id}
export async function getCapaByImovelId(imovelId) {
  const response = await fetch(`http://localhost:8080/fotos/capa/${imovelId}`);

  // Retorna null ou um objeto de erro se não for encontrado (404)
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar a foto capa: ${response.statusText}`);
  }

  return await response.json();
}

// Cadastrar uma nova foto (Upload de arquivo + metadados JSON)
// POST /fotos (Consumes: multipart/form-data)
/**
 * @param {File} arquivo - O arquivo de imagem (objeto File).
 * @param {object} dados - Objeto JSON contendo os metadados (FotoImovelDTO, ex: {imovelId: 1, capa: false, ordem: 1}).
 * @returns {Promise<Response>}
 */
export async function cadastrarFotoImovel(arquivo, dados) {
  const formData = new FormData();

  // Adiciona o arquivo
  formData.append("arquivo", arquivo);

  // Adiciona os metadados (converte o objeto JSON em uma string JSON)
  formData.append("dados", JSON.stringify(dados));

  // Nota: Não defina o cabeçalho 'Content-Type' manualmente para 'multipart/form-data'. 
  // O navegador se encarrega de configurá-lo corretamente, incluindo o boundary necessário,
  // quando um objeto FormData é passado no corpo (body).

  return fetch("http://localhost:8080/fotos", {
    method: "POST",
    body: formData,
  });
}

// DELETE /fotos/{id}
export async function deletarFotoImovel(id) {
    const response = await fetch(`http://localhost:8080/fotos/${id}`, {
        method: "DELETE",
    });
    // O backend retorna 204 No Content para sucesso
    if (!response.ok) {
        throw new Error(`Falha ao deletar a foto: ${response.statusText}`);
    }
    return true;
}

export async function setFotoCapa(fotoId, imovelId) {
    const response = await fetch(`http://localhost:8080/fotos/${fotoId}/capa/${imovelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
        throw new Error(`Falha ao definir foto ${fotoId} como capa para o imóvel ${imovelId}.`);
    }
    return response.json(); // Retorna a foto que se tornou capa
}


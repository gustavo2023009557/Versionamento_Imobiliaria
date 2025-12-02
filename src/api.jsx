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
  const response = await fetch("http://localhost:8080/users/"+id);
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

//Cadastrar imóvel
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



//
//TIPOIMOVELCONTROLLER
//



//
//FOTOIMOVELCONTROLLER
//



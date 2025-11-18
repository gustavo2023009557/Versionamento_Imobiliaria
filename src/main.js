import { getUsers } from "./api.js";

async function carregarUsuarios() {
  const users = await getUsers();
  const container = document.querySelector("#app");

  container.innerHTML = `
    <h1>Lista de Usuários</h1>
    <ul>
      ${users.map(u => `
        <li>
          <strong>${u.nome}</strong> – ${u.email ?? "sem email"} – ${u.tipo}
        </li>
      `).join("")}
    </ul>
  `;
}

carregarUsuarios();
export async function getUsers() {
  const response = await fetch("http://localhost:8080/users");
  return await response.json();
}
// Copia de app.js adaptada para pruebas rápidas desde Django
'use strict';
const API_BASE_URL = "http://localhost:8001/api";
const TOKEN_KEY = 'museo_token';
const USER_KEY = 'museo_user';

const state = { user: null, token: null };

async function apiRegister(name, age, course, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, username: email.split('@')[0], password })
  });
  if (!res.ok) throw new Error('Registro fallido');
  return await res.json();
}
async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error('Login fallido');
  const data = await res.json(); state.token = data.access; localStorage.setItem(TOKEN_KEY, state.token);
}
async function apiGetProfile() {
  const res = await fetch(`${API_BASE_URL}/users/me/`, { headers: { 'Authorization': `Bearer ${state.token}` } });
  return await res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-enter').addEventListener('click', async () => {
    const name = document.getElementById('inp-name').value || 'UI Test';
    const age = parseInt(document.getElementById('inp-age').value) || 25;
    const course = document.getElementById('inp-course').value || '';
    const email = `ui_${Date.now()}@museo.test`;
    const password = `UiPass${Date.now().toString().slice(-4)}!`;
    try {
      await apiRegister(name, age, course, email, password);
      await apiLogin(email, password);
      const profile = await apiGetProfile();
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      alert('Registro y login OK — token guardado.');
    } catch (e) {
      alert('Error UI: ' + e.message);
    }
  });
});

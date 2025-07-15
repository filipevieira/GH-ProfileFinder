const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/buscar', async (req, res) => {
  const usuario = req.body.usuario;
  const perfilURL = `https://api.github.com/users/${usuario}`;
  const reposURL = `https://api.github.com/users/${usuario}/repos`;

  try {
    const perfilResp = await fetch(perfilURL);
    const perfil = await perfilResp.json();

    const reposResp = await fetch(reposURL);
    const repos = await reposResp.json();

    if (perfil.message === "Not Found") {
      res.send(`<h2>Usuário não encontrado</h2><a href="/">Voltar</a>`);
      return;
    }

    let reposList = repos.map(r => `<li><a href="${r.html_url}" target="_blank">${r.name}</a></li>`).join('');
    if (!reposList) reposList = "<li>Nenhum repositório público</li>";

    res.send(`
      <h2>${perfil.login}</h2>
      <img src="${perfil.avatar_url}" alt="Foto de perfil" width="150"/>
      <h3>Repositórios:</h3>
      <ul>${reposList}</ul>
      <a href="/">Buscar outro usuário</a>
    `);
  } catch (err) {
    res.send(`<h2>Erro ao buscar dados</h2><a href="/">Voltar</a>`);
  }
});

app.listen(3000, () => {
  console.log('App rodando em http://localhost:3000');
});
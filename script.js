document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api-animes-git-main-lelebs-projects-ee4de47a.vercel.app/animes.js')
    .then(response => response.json())
    .then(animes => {
      const animeListContainer = document.getElementById('anime-list');
      animes.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
          <img src="${anime.capa}" alt="${anime.nome}">
          <h3>${anime.nome}</h3>
          <p><strong>Data de Lançamento:</strong> ${anime.dados}</p>
          <p><strong>Avaliação:</strong> ${anime.avaliacao}</p>
        `;
        animeListContainer.appendChild(animeCard);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os dados dos animes:', error);
    });
});

// script.js

const animeListEl = document.getElementById('anime-list');
const counterEl = document.getElementById('counter');
const loadingEl = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');

let temporadas = [];
let episodios = [];

async function carregarDados() {
    try {
        loadingEl.style.display = 'block';
        animeListEl.innerHTML = '';
        counterEl.textContent = '';

        const [tempRes, epiRes] = await Promise.all([
            fetch('https://anime-aniverso.vercel.app/temporadas.json'),
            fetch('https://anime-aniverso.vercel.app/episodios.json')
        ]);

        temporadas = await tempRes.json();
        episodios = await epiRes.json();

        // Junta temporadas com seus episódios
        const temporadasComEpisodios = temporadas.map(temp => {
            const eps = episodios.filter(ep => String(ep.temporada_id) === String(temp.id));
            return {
                ...temp,
                totalEpisodios: eps.length,
                episodios: eps
            };
        });

        temporadas = temporadasComEpisodios;
        exibirAnimes(temporadas);
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        animeListEl.innerHTML = '<p>Erro ao carregar os dados.</p>';
    } finally {
        loadingEl.style.display = 'none';
    }
}

function exibirAnimes(lista) {
    animeListEl.innerHTML = '';

    lista.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';

        card.innerHTML = `
            <img src="${anime.capa || 'https://via.placeholder.com/200x300?text=Sem+Capa'}" alt="${anime.nome}">
            <h3>${anime.nome}</h3>
            <p><strong>ID:</strong> ${anime.id}</p>
            <p><strong>Número:</strong> ${anime.numero}</p>
            <p><strong>Ano:</strong> ${anime.ano || 'Desconhecido'}</p>
            <p>${anime.descricao || ''}</p>
            <p><strong>Episódios:</strong> ${anime.totalEpisodios}</p>
        `;

        // Abre modal ao clicar
        card.addEventListener('click', () => {
            abrirModal(anime);
        });

        animeListEl.appendChild(card);
    });

    counterEl.textContent = `Total: ${lista.length} animes`;
}

// Modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const episodeList = document.getElementById('episode-list');
const modalClose = document.getElementById('modal-close');

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

function abrirModal(anime) {
    modalTitle.textContent = `${anime.nome} - Episódios`;
    episodeList.innerHTML = '';

    if (anime.episodios.length === 0) {
        episodeList.innerHTML = '<li>Sem episódios disponíveis</li>';
    } else {
        anime.episodios.forEach(ep => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${ep.link}" target="_blank">${ep.nome || 'Episódio sem título'}</a>`;
            episodeList.appendChild(li);
        });
    }

    modal.style.display = 'block';
}

// Busca por ID
searchBtn.addEventListener('click', () => {
    const termo = searchInput.value.trim();
    if (!termo) return;

    const resultado = temporadas.filter(anime => String(anime.id) === termo);
    exibirAnimes(resultado);
});

// Limpar busca
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    exibirAnimes(temporadas);
});

carregarDados();

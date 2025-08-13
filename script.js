let animesData = [];

function criarCardAnime(anime) {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.setAttribute('data-id', anime.id);  // <-- adiciona o atributo data-id

    const img = document.createElement('img');
    img.src = anime.capa || 'https://via.placeholder.com/140x210?text=Sem+Imagem';
    img.alt = anime.nome;

    const info = document.createElement('div');
    info.className = 'anime-info';

    const title = document.createElement('div');
    title.className = 'anime-title';
    title.textContent = anime.nome;

    const status = document.createElement('div');
    status.className = 'anime-status';
    status.textContent = anime.status || '';

    const genre = document.createElement('div');
    genre.className = 'anime-genre';
    genre.textContent = anime.genero || '';

    info.append(title, status, genre);
    card.append(img, info);

    return card;
}

function mostrarAnimes(lista) {
    const listEl = document.getElementById('anime-list');
    listEl.innerHTML = '';
    lista.forEach(anime => listEl.appendChild(criarCardAnime(anime)));
    document.getElementById('counter').textContent = `Animes exibidos: ${lista.length}`;
}

// Função para copiar texto e mostrar feedback simples
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        // Pode trocar o alert por uma mensagem melhor no futuro
        alert(`ID "${texto}" copiado para a área de transferência!`);
    }).catch(err => {
        alert('Erro ao copiar o ID: ' + err);
    });
}

// Delegação de evento para clique em cards dentro do container anime-list
document.getElementById('anime-list').addEventListener('click', e => {
    const card = e.target.closest('.anime-card');
    if (card) {
        const id = card.getAttribute('data-id');
        if (id) copiarTexto(id);
    }
});

async function fetchAnimes() {
    try {
        const res = await fetch('https://anime-aniverso.vercel.app/animes.json');
        if (!res.ok) throw new Error('Erro ao buscar dados');
        animesData = await res.json();
        document.getElementById('loading').style.display = 'none';
        mostrarAnimes(animesData);
    } catch (e) {
        document.getElementById('loading').textContent = 'Erro ao carregar animes.';
        console.error(e);
    }
}

function filtrarPorID(idBusca) {
    const busca = idBusca.trim().toLowerCase();
    if (!busca) return mostrarAnimes(animesData);
    const filtrados = animesData.filter(anime =>
        String(anime.id).toLowerCase().includes(busca)
    );
    mostrarAnimes(filtrados);
}

document.getElementById('search-btn').addEventListener('click', () =>
    filtrarPorID(document.getElementById('search-input').value)
);

document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    mostrarAnimes(animesData);
});

document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') filtrarPorID(e.target.value);
});

fetchAnimes();

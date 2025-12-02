document.addEventListener('DOMContentLoaded', () => {
    // --- Dados Simulados (Mock Data) ---
    const mockTracks = [
        { id: '1', title: 'Midnight City', artist: 'M83' },
        { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
        { id: '3', title: 'Lovely Day', artist: 'Bill Withers' },
        { id: '4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper' },
        { id: '5', title: 'Bohemian Rhapsody', artist: 'Queen' },
        { id: '6', title: 'Levitating', artist: 'Dua Lipa' },
    ];
    
    // Dados Simulados para o Perfil (NOVO/Recuperado)
    const mockProfileData = {
        artists: [
            { id: 1, name: "The Weeknd", icon: "Mic" },
            { id: 2, name: "Lady Gaga", icon: "Mic" },
            { id: 3, name: "Queen", icon: "Mic" },
            { id: 4, name: "Dua Lipa", icon: "Mic" }
        ],
        users: [
            { id: 10, name: "Maria_S", icon: "User" },
            { id: 11, name: "Ricardo.M", icon: "User" },
            { id: 12, name: "MusicLover", icon: "User" }
        ],
        playlists: [
            { id: 20, name: "Hits dos Anos 80", icon: "ListMusic" },
            { id: 21, name: "Chill Vibes", icon: "ListMusic" },
            { id: 22, name: "Rock Clássico", icon: "ListMusic" },
            { id: 23, name: "Treino", icon: "ListMusic" }
        ]
    };

    // --- Estado & Elementos DOM ---
    let currentPlaylist = [];
    let playlistName = document.getElementById('playlist-name').value;
    let currentSearchTerm = ''; // Variável para o termo de busca

    // Elementos de Playlist/Busca
    const musicResultsEl = document.getElementById('music-results');
    const currentPlaylistEl = document.getElementById('current-playlist');
    const musicItemTemplate = document.getElementById('music-item-template');
    const playlistItemTemplate = document.getElementById('playlist-item-template');
    const playlistNameInput = document.getElementById('playlist-name');
    const playlistTitleDisplay = document.getElementById('playlist-title-display');
    const savePlaylistButton = document.getElementById('save-playlist');
    const musicSearchInput = document.getElementById('music-search'); 
    
    // Elementos de Navegação e Perfil
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const profileCardTemplate = document.getElementById('profile-card-template');
    const followedArtistsEl = document.getElementById('followed-artists');
    const followedUsersEl = document.getElementById('followed-users');
    const userPlaylistsEl = document.getElementById('user-playlists');


    // --- Funções de Navegação e View ---

    /**
     * Alterna a view principal e a navegação ativa.
     */
    function switchView(viewId) {
        views.forEach(view => {
            if (view.id === `${viewId}-view`) {
                view.classList.remove('hidden-view');
                view.classList.add('active-view');
            } else {
                view.classList.remove('active-view');
                view.classList.add('hidden-view');
            }
        });

        navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Renderiza o perfil se for a view correta, ou atualiza a lista de músicas
        if (viewId === 'profile') {
            renderProfile();
        } else {
             updateUI(); 
        }
    }


    // --- Funções de Renderização de Perfil (REUTILIZADAS) ---

    /**
     * Cria e retorna um card de perfil (Artista, Usuário, Playlist).
     */
    function createProfileCard(item, iconName) {
        const clone = profileCardTemplate.content.cloneNode(true);
        clone.querySelector('.card-name').textContent = item.name;
        
        const cardIcon = clone.querySelector('.card-icon');
        // Usa a API Lucide para injetar o ícone SVG
        cardIcon.innerHTML = `<i data-lucide="${iconName}"></i>`; 
        
        // Renderiza o ícone
        lucide.createIcons(); 
        
        return clone;
    }

    /**
     * Renderiza todos os dados na view de Perfil.
     */
    function renderProfile() {
        followedArtistsEl.innerHTML = '';
        mockProfileData.artists.forEach(artist => {
            followedArtistsEl.appendChild(createProfileCard(artist, 'Mic'));
        });

        followedUsersEl.innerHTML = '';
        mockProfileData.users.forEach(user => {
            followedUsersEl.appendChild(createProfileCard(user, 'User')); 
        });

        userPlaylistsEl.innerHTML = '';
        mockProfileData.playlists.forEach(playlist => {
            userPlaylistsEl.appendChild(createProfileCard(playlist, 'ListMusic'));
        });
    }

    // --- Funções de Renderização e Atualização (Playlist e Busca) ---

    /**
     * Renderiza o item de música na lista de resultados.
     */
    function renderMusicItem(track) {
        const clone = musicItemTemplate.content.cloneNode(true);
        const addButton = clone.querySelector('.add-btn');

        clone.querySelector('.track-title').textContent = track.title;
        clone.querySelector('.track-artist').textContent = track.artist;
        
        addButton.setAttribute('data-track-id', track.id);
        
        addButton.addEventListener('click', () => addTrackToPlaylist(track.id));
        
        musicResultsEl.appendChild(clone);
    }

    /**
     * Renderiza o item de música na playlist.
     */
    function renderPlaylistItem(track) {
        const clone = playlistItemTemplate.content.cloneNode(true);
        const removeButton = clone.querySelector('.remove-btn');

        clone.querySelector('.track-title').textContent = track.title;
        clone.querySelector('.track-artist').textContent = track.artist;
        
        removeButton.setAttribute('data-track-id', track.id);

        removeButton.addEventListener('click', () => removeTrackFromPlaylist(track.id));
        
        currentPlaylistEl.appendChild(clone);
    }
    
    /**
     * Atualiza a exibição da lista de resultados (com filtro) e da playlist.
     */
    function updateUI() {
        // 1. Atualiza o nome da playlist
        playlistTitleDisplay.textContent = playlistName;

        // 2. Limpa e renderiza a lista de resultados (AGORA FILTRADA)
        musicResultsEl.innerHTML = '';
        
        // Lógica de filtragem
        const filteredTracks = mockTracks.filter(track => {
            if (!currentSearchTerm) return true; 
            
            const term = currentSearchTerm.toLowerCase();
            const title = track.title.toLowerCase();
            const artist = track.artist.toLowerCase();
            
            return title.includes(term) || artist.includes(term);
        });

        filteredTracks.forEach(renderMusicItem); 

        // 3. Limpa e renderiza a playlist
        currentPlaylistEl.innerHTML = '';
        currentPlaylist.forEach(trackId => {
            const track = mockTracks.find(t => t.id === trackId);
            if (track) {
                renderPlaylistItem(track);
            }
        });
        
        // 4. Atualiza o estado dos botões "Adicionar"
        document.querySelectorAll('.add-btn').forEach(btn => {
            const trackId = btn.getAttribute('data-track-id');
            if (currentPlaylist.includes(trackId)) {
                btn.disabled = true;
                btn.textContent = 'Adicionado';
            } else {
                 btn.disabled = false;
                 btn.innerHTML = '<i data-lucide="plus"></i> Adicionar';
                 lucide.createIcons(); 
            }
        });
    }

    // --- Funções de Lógica (Playlist) ---

    function addTrackToPlaylist(trackId) {
        if (!currentPlaylist.includes(trackId)) {
            currentPlaylist.push(trackId);
            updateUI();
        } else {
            alert('Esta música já está na playlist!');
        }
    }

    function removeTrackFromPlaylist(trackId) {
        currentPlaylist = currentPlaylist.filter(id => id !== trackId);
        updateUI();
    }

    // --- Event Listeners Globais ---
    
    // 1. Listener para o nome da playlist
    playlistNameInput.addEventListener('input', (e) => {
        playlistName = e.target.value.trim() || 'Playlist Sem Nome';
        if (e.target.value.trim() === "") {
            playlistTitleDisplay.textContent = "Playlist Sem Nome";
        } else {
            playlistTitleDisplay.textContent = playlistName;
        }
    });

    // 2. Listener para o campo de busca (Filtro em tempo real)
    musicSearchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        switchView('home'); // Garante que a view de busca esteja ativa ao digitar
    });


    // 3. Simulação do botão Salvar
    savePlaylistButton.addEventListener('click', () => {
        const finalName = playlistName.trim();
        if (currentPlaylist.length > 0 && finalName) {
            const trackDetails = currentPlaylist.map(id => {
                const track = mockTracks.find(t => t.id === id);
                return `${track.title} por ${track.artist}`;
            }).join('\n - ');

            alert(`✅ Playlist "${finalName}" salva com sucesso! \n\nTotal de ${currentPlaylist.length} faixas:\n - ${trackDetails}`);
        } else if (currentPlaylist.length === 0) {
            alert('❌ Sua playlist está vazia. Adicione algumas músicas!');
        } else {
             alert('⚠️ Por favor, dê um nome à sua playlist antes de salvar.');
        }
    });
    
    // 4. Listeners para Navegação
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });


    // --- Inicialização ---
    updateUI(); 
    switchView('home'); 
});
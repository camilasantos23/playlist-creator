document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados de músicas
    const mockTracks = [
        { id: '1', title: 'Midnight City', artist: 'M83' },
        { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
        { id: '3', title: 'Lovely Day', artist: 'Bill Withers' },
        { id: '4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper' },
        { id: '5', title: 'Bohemian Rhapsody', artist: 'Queen' },
        { id: '6', title: 'Levitating', artist: 'Dua Lipa' },
    ];

    let currentPlaylist = [];
    let playlistName = document.getElementById('playlist-name').value;

    const musicResultsEl = document.getElementById('music-results');
    const currentPlaylistEl = document.getElementById('current-playlist');
    const musicItemTemplate = document.getElementById('music-item-template');
    const playlistItemTemplate = document.getElementById('playlist-item-template');
    const playlistNameInput = document.getElementById('playlist-name');
    const playlistTitleDisplay = document.getElementById('playlist-title-display');
    const savePlaylistButton = document.getElementById('save-playlist');


    // --- Funções de Renderização e Atualização ---

    /**
     * Renderiza o item de música na lista de resultados.
     */
    function renderMusicItem(track) {
        const clone = musicItemTemplate.content.cloneNode(true);
        const addButton = clone.querySelector('.add-btn');

        clone.querySelector('.track-title').textContent = track.title;
        clone.querySelector('.track-artist').textContent = track.artist;
        
        addButton.setAttribute('data-track-id', track.id);
        
        // Adicionar o evento de clique para adicionar à playlist
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

        // Adicionar o evento de clique para remover da playlist
        removeButton.addEventListener('click', () => removeTrackFromPlaylist(track.id));
        
        currentPlaylistEl.appendChild(clone);
    }
    
    /**
     * Atualiza a exibição da lista de resultados e da playlist.
     */
    function updateUI() {
        // 1. Atualiza o nome da playlist
        playlistTitleDisplay.textContent = playlistName;

        // 2. Limpa e renderiza a lista de resultados (simulada)
        musicResultsEl.innerHTML = '';
        mockTracks.forEach(renderMusicItem);

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
                 // O texto deve ser definido como HTML para que o ícone funcione
                 btn.innerHTML = '<i data-lucide="plus"></i> Adicionar';
                 // Re-inicializa os ícones após alterar o innerHTML
                 lucide.createIcons(); 
            }
        });
    }

    // --- Funções de Lógica ---

    /**
     * Adiciona uma música à playlist.
     */
    function addTrackToPlaylist(trackId) {
        if (!currentPlaylist.includes(trackId)) {
            currentPlaylist.push(trackId);
            console.log(`Música ${trackId} adicionada.`);
            updateUI();
        } else {
            alert('Esta música já está na playlist!');
        }
    }

    /**
     * Remove uma música da playlist.
     */
    function removeTrackFromPlaylist(trackId) {
        currentPlaylist = currentPlaylist.filter(id => id !== trackId);
        console.log(`Música ${trackId} removida.`);
        updateUI();
    }

    // --- Event Listeners Globais ---
    
    // 1. Listener para o nome da playlist (Atualiza em tempo real)
    playlistNameInput.addEventListener('input', (e) => {
        playlistName = e.target.value.trim() || 'Playlist Sem Nome';
        // Limitar a exibição do nome se o input estiver vazio
        if (e.target.value.trim() === "") {
            playlistTitleDisplay.textContent = "Playlist Sem Nome";
        } else {
            playlistTitleDisplay.textContent = playlistName;
        }
    });


    // 2. Simulação do botão Salvar
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

    // Inicializa a UI
    updateUI();
});
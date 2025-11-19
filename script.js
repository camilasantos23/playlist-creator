document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados de músicas
    const mockTracks = [
        { id: '1', title: 'Midnight City', artist: 'M83' },
        { id: '2', title: 'Blinding Lights', artist: 'The Weeknd' },
        { id: '3', title: 'Lovely Day', artist: 'Bill Withers' },
        { id: '4', title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper' },
        { id: '5', title: 'Bohemian Rhapsody', artist: 'Queen' },
    ];

    let currentPlaylist = [];

    const musicResultsEl = document.getElementById('music-results');
    const currentPlaylistEl = document.getElementById('current-playlist');
    const musicItemTemplate = document.getElementById('music-item-template');
    const playlistItemTemplate = document.getElementById('playlist-item-template');

    // --- Funções de Renderização ---

    /**
     * Renderiza o item de música na lista de resultados.
     */
    function renderMusicItem(track) {
        // Clonar o template
        const clone = musicItemTemplate.content.cloneNode(true);
        const musicItem = clone.querySelector('.music-item');
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
        // Clonar o template
        const clone = playlistItemTemplate.content.cloneNode(true);
        const listItem = clone.querySelector('li');
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
        // 1. Limpa e renderiza a lista de resultados (simulada)
        musicResultsEl.innerHTML = '';
        mockTracks.forEach(renderMusicItem);

        // 2. Limpa e renderiza a playlist
        currentPlaylistEl.innerHTML = '';
        currentPlaylist.forEach(trackId => {
            const track = mockTracks.find(t => t.id === trackId);
            if (track) {
                renderPlaylistItem(track);
            }
        });
        
        // 3. Atualiza o estado dos botões "Adicionar"
        document.querySelectorAll('.add-btn').forEach(btn => {
            const trackId = btn.getAttribute('data-track-id');
            if (currentPlaylist.includes(trackId)) {
                btn.disabled = true;
                btn.textContent = 'Adicionado';
                // Para simplificar, desabilitamos, mas você pode querer mudar a aparência
            } else {
                 btn.disabled = false;
                 btn.innerHTML = '<i data-lucide="plus"></i> Adicionar';
                 lucide.createIcons(); // Re-renderiza o ícone (Lucide JS)
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
    
    // Simulação do botão Salvar
    document.getElementById('save-playlist').addEventListener('click', () => {
        if (currentPlaylist.length > 0) {
            alert(`Playlist salva com sucesso! Total de ${currentPlaylist.length} músicas.`);
        } else {
            alert('Sua playlist está vazia.');
        }
    });

    // Inicializa a UI
    updateUI();
});
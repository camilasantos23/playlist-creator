// --- No seu login.js ---

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const feedbackMessage = document.getElementById('feedback-message');

    // ⭐️ MUDANÇA AQUI: Removemos as variáveis fixas de usuário/senha.
    // Elas serão carregadas do localStorage (simulação de "banco de dados").

    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `login-feedback ${type}`;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const usernameOrEmail = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!usernameOrEmail || !password) {
            showFeedback('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // ⭐️ NOVO: Carrega os usuários salvos
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Encontra o usuário por nome de usuário OU email
        const foundUser = users.find(user => 
            (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
        );

        // 2. Simulação de autenticação
        if (foundUser) {
            showFeedback('Login bem-sucedido! Redirecionando...', 'success');
            
            // Salva o token de login para proteção do index.html
            localStorage.setItem('userToken', 'logado'); 
            
            // Ação de Sucesso: Redireciona
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500); 
            
        } else {
            // Ação de Erro: Feedback visual
            showFeedback('Credenciais inválidas. Tente novamente.', 'error');
            passwordInput.value = ''; 
        }
    });
});
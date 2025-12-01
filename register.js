document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const emailInput = document.getElementById('new-email');
    const usernameInput = document.getElementById('new-username');
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const feedbackMessage = document.getElementById('feedback-message');

    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        // O login.css já possui as classes .error e .success
        feedbackMessage.className = `login-feedback ${type}`; 
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 1. Validação de Senha
        if (password !== confirmPassword) {
            showFeedback('As senhas não coincidem. Por favor, tente novamente.', 'error');
            passwordInput.value = '';
            confirmPasswordInput.value = '';
            return;
        }

        // 2. Validação de Comprimento
        if (password.length < 6) {
             showFeedback('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        // 3. Simulação de Salvamento do Usuário no localStorage
        
        // Vamos usar o localStorage para simular um "banco de dados" de usuários
        // Na vida real, isso seria enviado a um servidor.
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verifica se o usuário ou email já existem
        const userExists = users.some(user => user.username === username || user.email === email);
        
        if (userExists) {
            showFeedback('Este email ou nome de usuário já está em uso.', 'error');
            return;
        }

        // Cria o novo usuário
        const newUser = {
            email: email,
            username: username,
            // ⚠️ NOTA: Na prática real, NUNCA armazene senhas sem criptografia!
            // Aqui é apenas uma simulação didática.
            password: password 
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // 4. Sucesso e Redirecionamento
        showFeedback('🎉 Conta criada com sucesso! Redirecionando para o login...', 'success');
        
        setTimeout(() => {
            // Redireciona o usuário para a tela de login
            window.location.href = 'login.html'; 
        }, 2000); 
    });
});
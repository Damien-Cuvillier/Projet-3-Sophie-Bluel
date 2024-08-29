document.addEventListener('DOMContentLoaded', () => {
    // Gestion du formulaire de connexion
    const form = document.getElementById('login-form');
    if (form) {
        const errorMessage = document.getElementById('error-message');
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    window.location.href = 'index.html';
                } else {
                    errorMessage.textContent = 'Identifiants incorrects. Veuillez réessayer.';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Erreur:', error);
                errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Gestion du mode édition et autres éléments spécifiques
    const loginBtn = document.getElementById('btn-login');
    const editMode = document.getElementById('mode-edition');
    const categoryMenu = document.querySelector('.category-menu');
    const btnModal = document.querySelector('.js-modal');
    const token = localStorage.getItem('authToken');

    if (loginBtn) {
        if (token) {
            loginBtn.innerText = 'logout';
            loginBtn.href = '#';
            if (editMode) editMode.style.display = 'flex';
            if (categoryMenu) categoryMenu.style.display = 'none';
            if (btnModal) btnModal.style.display = 'flex';

            loginBtn.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            });
        } else {
            loginBtn.href = 'login.html';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email');
        const password = document.getElementById('password');

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
                // Sauvegarde du token d'authentification
                localStorage.setItem('authToken', data.token);

                // Redirection vers la page d'accueil
                window.location.href = 'index.html';
            } else {
                // Affichage du message d'erreur
                errorMessage.textContent = 'Identifiants incorrects. Veuillez réessayer.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur:', error);
            errorMessage.textContent = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
            errorMessage.style.display = 'block';
        }
    });
});

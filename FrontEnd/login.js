document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('btn-login');

    // Vérifie si le token d'authentification est stocké
    const token = localStorage.getItem('authToken');
    if (token) {
 // Si l'utilisateur est connecté, changer le texte du bouton à "logout"
        loginBtn.innerText = 'logout';
        loginBtn.href = '#';  // Empêche la redirection vers la page de login

 // Ajouter un gestionnaire d'événement pour déconnecter l'utilisateur
        loginBtn.addEventListener('click', (event) => {
            event.preventDefault();  // Empêche l'action par défaut du lien
            localStorage.removeItem('authToken');  // Supprime le token d'authentification
            window.location.href='index.html';  // Renvoi a la page d'index après la déconnection
        });
    } else {
    // Si l'utilisateur n'est pas connecté, s'assurer que le bouton renvoie à la page de login
        loginBtn.href = 'login.html';
}
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
                //convertit les données en Json
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Sauvegarde du token d'authentification
                localStorage.setItem('authToken', data.token);

                // Redirection vers la page du mode édition
                window.location.href = 'edit.html';
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

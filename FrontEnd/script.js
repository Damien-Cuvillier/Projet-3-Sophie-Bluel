document.addEventListener('DOMContentLoaded', () => {
    const gallery=document.querySelector('.gallery');

// Fonction pour créer un élément d'image pour chaque projet
    const creerProjetImage = (projet)=>{
        const figure =document.createElement('figure');
        const img = document.createElement('img');
        img.src=projet.imageUrl;
        img.alt=projet.title;

        const imgLegende =document.createElement('imgLegende');
        imgLegende.textContent = projet.title;

        figure.appendChild(img);
        figure.appendChild(imgLegende);
        return figure;
}
// Fonction pour afficher les projets dans la galerie
    const afficherProjet = (projets) => {
        gallery.innerHTML='';
        projets.forEach(projet =>{
            const projetFigure = creerProjetImage(projet);
            gallery.appendChild(projetFigure);
        })
    }
    // Fonction pour récupérer les projets depuis l'API
    const fetchProjets = async () => {
        try {
            const reponse = await fetch('http://localhost:5678/api/works')
            if (!reponse.ok){
                throw new error (`Erreur HTTP status: ${reponse.status}`);
            }
            const projets = await reponse.json(); 
            afficherProjet(projets);
            return projets;
    } catch (error){
        console.error('Erreur lors de la récupération des catégories:', error);
        }
    }
    fetchProjets();
})


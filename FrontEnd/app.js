let modal = null;
const focusableSelector= 'submit, button'           
let focusables=[] //stock les elements focusables
let previousyFocusedElement = null
//fonction pour ouvrir la modal
const openModal = (e) => {
    e.preventDefault();
    modal = document.querySelector(e.currentTarget.getAttribute('href'));
    focusables= Array.from(modal.querySelectorAll(focusableSelector))
    previousyFocusedElement = document.querySelector(':focus')
    focusables[0].focus()
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);

    displayModalGallery();
};
//fonction pour afficher la galerie de photo dans la modal
const displayModalGallery = () => {
    const modalGallery = document.querySelector('.gallery-modal');
    modalGallery.innerHTML = ''; // On vide la galerie avant de la remplir

    allProjects.forEach(project => {
        const projectFigure = createProjectFigure(project, false, true); // false pour cacher les titres des images, true pour afficher l'icone corbeille en modale
        modalGallery.appendChild(projectFigure);
    });
 
}  
//fonction pour supprimer un élément de la modale
const handleDeleteProject = async (projectId) => {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
    if (!confirmation) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du projet');
        }

        alert('Projet supprimé avec succès');
        fetchProjects();
        displayModalGallery();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite lors de la suppression du projet');
    }
};

//Fonction pour fermer la modal
const closeModal = (e) => {
    if (modal === null) return;
    if(previousyFocusedElement !==null) previousyFocusedElement.focus()
    e.preventDefault();
 
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);
    const hideModal = function () {
        modal.style.display = "none";
        modal.removeEventListener('animationend', hideModal)
        modal = null;
    }
    modal.addEventListener('animationend', hideModal)
};
//Fonction qui stoppe la propagation (ex= empecher de fermer a modal au clique sur le contenu de la modal)
const stopPropagation = (e) => {
    e.stopPropagation();
};
// Focus des éléments 
const focusInModal = (e) => {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    index++;
    if(e.shiftKey === true){
        index--
    }
    else{
        index++
    }
    if (index >= focusables.length){
        index=0
    }
    if(index <0 ){
        index=focusables.lenght - 1
    }
    focusables[index].focus()
}
//On selectionne tous les element avec la class js-modal et on écoute le click pour chaque element
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

//On écoute les pressions des touches de claviers 
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc"){
        closeModal(e)
    }
    //ecoute le comportement de TAB
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

//Vidéo graphikart stoppé a 23min33
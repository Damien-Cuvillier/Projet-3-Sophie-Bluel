let modal = null;
const focusableSelector= 'img'
let focusables=[] //stock les elements focusables

//fonction pour ouvrir la modal
const openModal = (e) => {
    e.preventDefault();
    modal = document.querySelector(e.currentTarget.getAttribute('href'));
    focusabes= Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation);
};
//Fonction pour fermer la modal
const closeModal = (e) => {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation);
    modal = null;
};
//Fonction qui stoppe la propagation (ex= empecher de fermer a modal au clique sur le contenu de la modal)
const stopPropagation = (e) => {
    e.stopPropagation();
};
// Focus des éléments (ici les photos)
const focusInModal = (e) => {
    e.preventDefault()
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
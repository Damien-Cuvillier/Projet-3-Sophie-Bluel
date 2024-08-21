let modal = null;
const focusableSelector= 'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'     
let focusables=[] //stock les elements focusables
let previousyFocusedElement = null
const btnAddPhoto = document.getElementById('btn-add-photo');
const btnBack = document.getElementById('btn-back');
const viewGallery = document.getElementById('view-gallery');
const viewAddPhoto = document.getElementById('view-add-photo');
const formAddPhoto = document.getElementById('form-add-photo');
const photoUploadInput = document.getElementById('photo-upload');
const imagePreview = document.getElementById('image-preview');
const btnSubmit = document.querySelector('.btn-container')
const txt = document.getElementById('txt-info')
const iconeImg = document.querySelector('.fa-image')
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
        const projectFigure = createProjectFigure(project, false, true); // false pour cacher les titres des images, true pour afficher l'icône corbeille en modale
        modalGallery.appendChild(projectFigure);
    });
};

//afficher la vue "Ajout photo"
btnAddPhoto.addEventListener('click', () => {
    viewGallery.style.display = 'none';
    viewAddPhoto.style.display = 'block';
   
});
// Revenir à la vue "Galerie photo"
btnBack.addEventListener('click', () => {
    viewAddPhoto.style.display = 'none';
    viewGallery.style.display = 'block';
});

 // Prévisualisation de l'image  Input pour uploader l'image, qui déclenche une prévisualisation dans l'élément imagePreview.
 photoUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'flex';

            btnSubmit.classList.add('hidden');
            txt.classList.add('hidden')
            iconeImg.classList.add('hidden')
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
    }
});
// Soumettre le formulaire d'ajout de photo
formAddPhoto.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formAddPhoto); //récupère les données du formulaire
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                
            },
            body: formData
        });
        if (response.ok) {
            alert('Photo ajoutée avec succès !');
            viewAddPhoto.style.display = 'none';
            viewGallery.style.display = 'block';
            fetchProjects(); //recharge la galerie
        } else {
            const errorText = await response.text();
            console.error('Erreur du serveur:', errorText);
            alert('Erreur lors de l\'ajout de la photo');
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error.message);
        console.error('Détails complets:', error);
        alert('Erreur lors de la soumission du formulaire. Veuillez vérifier la console pour plus de détails.');
    }
});
//remplissage des catégories dans la vue Ajout photo
const fetchCategoriesForm = async () =>{
    try{
        const response = await fetch('http://localhost:5678/api/categories')
        const categories = await response.json()

        const categorySelect = document.getElementById('category')
        categories.forEach(category =>{
            const option = document.createElement('option')
            option.value = category.id
            option.textContent = category.name
            categorySelect.appendChild(option)
        })
    } catch(error) {
        console.error('Erreur lors de la récupération des catégories', error)
    }
}
// Appelle cette fonction lors du passage à la vue "Ajout photo"
btnAddPhoto.addEventListener('click', ()=>{
    viewGallery.style.display = 'none'
    viewAddPhoto.style.display = 'block'
    fetchCategoriesForm();
})
//fonction pour supprimer un élément de la modale
const handleDeleteProject = async (projectId, projectElement, event) => {
    event.preventDefault(); // Empêche le comportement par défaut
    event.stopPropagation(); // Empêche la propagation de l'événement

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

        // Supprime le projet du DOM
        projectElement.remove(); 

        // Actualiser la liste des projets dans la modal sans fermer la modal
        allProjects = allProjects.filter(project => project.id !== projectId);
        displayModalGallery(); // Mise à jour de la galerie modale

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
    openModal()
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


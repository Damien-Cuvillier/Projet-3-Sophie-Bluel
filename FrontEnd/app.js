let modal = null;
const focusableSelector= 'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'     
let focusables=[] //stock les elements focusables
let previousyFocusedElement = null
//Récupération des éléments du html
const btnAddPhoto = document.getElementById('btn-add-photo');
const btnBack = document.getElementById('btn-back');
const viewGallery = document.getElementById('view-gallery');
const viewAddPhoto = document.getElementById('view-add-photo');
const formAddPhoto = document.getElementById('form-add-photo');
const photoUploadInput = document.getElementById('photo-upload');
const imagePreview = document.getElementById('image-preview');
const btnSubmit = document.querySelector('.btn-container')
const infotxt = document.getElementById('txt-info');
const iconeImg = document.querySelector('.fa-image');
const photoTitleInput = document.getElementById('photo-title');
const categorySelect = document.getElementById('category');
const submitBtn = document.querySelector('.btn-submit');

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
        displayProjects(allProjects);
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite lors de la suppression du projet');
    }
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

// gestion du click pour passage à la vue "Ajout photo"
btnAddPhoto.addEventListener('click', ()=>{
    viewGallery.style.display = 'none'
    viewAddPhoto.style.display = 'block'
    fetchCategoriesForm();
})

 // Prévisualisation de l'image pour uploader l'image, qui déclenche une prévisualisation dans l'élément imagePreview.
 photoUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'flex';

            if (iconeImg) {
                iconeImg.classList.add('hidden');; // Masquer l'icône
            }
            if (infotxt) {
                infotxt.classList.add('hidden') // Masquer le texte
            }
            if (btnSubmit) {
                btnSubmit.classList.add('hidden') ; // Masquer le bouton
            }
        };
        reader.readAsDataURL(file); // Lire le fichier comme une URL de données

    } else {
        // Si aucun fichier n'est sélectionné, réafficher l'icône et le texte
        imagePreview.style.display = 'none'; // Masquer l'image prévisualisée
        if (iconeImg) {
            iconeImg.classList.remove('hidden'); // Afficher l'icône
        }
        if (infotxt) {
            infotxt.classList.remove('hidden'); // Afficher le texte
        }
        if (btnSubmit) {
            btnSubmit.classList.remove('hidden'); // Afficher le bouton
        }
    }
});

//remplissage des catégories dans la vue Ajout photo
const fetchCategoriesForm = async () =>{
    try{
        const response = await fetch('http://localhost:5678/api/categories')
        const categories = await response.json()
        // Vider les options existantes avant de les remplir à nouveau
        categorySelect.innerHTML = ''; 
        const defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = '';
        categorySelect.appendChild(defaultOption);

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

//Fonction pour vérifier si toutes les conditions sont remplies pour le btn submit
const validateForm = () =>{
    const imageIsSelected = photoUploadInput.files.length > 0
    const titleIsSelected = photoTitleInput.value.trim() !== '';
    const categoryIsSelected = categorySelect.value !== '';
    
    // Activer le bouton si toutes les conditions sont remplies
    if(imageIsSelected && titleIsSelected && categoryIsSelected) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
        submitBtn.classList.add('valid');
    } else {
        btnSubmit.disabled = true;
        submitBtn.classList.remove('valid');
        submitBtn.classList.add('disabled');
    }
}

// Vérifier la validité du formulaire à chaque modification
photoUploadInput.addEventListener('change', validateForm);
photoTitleInput.addEventListener('input', validateForm);
categorySelect.addEventListener('change', validateForm);
validateForm();

//fonction pour reset le formulaire après le submit
const resetFormFields = () => {
    // Réinitialiser la prévisualisation de l'image
    if (imagePreview) {
        imagePreview.src = ''; // Effacer la source de l'image
        imagePreview.style.display = 'none'; // Masquer l'image de prévisualisation
    }

    // Réinitialiser l'input file
    if (photoUploadInput) {
        photoUploadInput.value = ''; // Effacer la sélection de fichier
    }

    // Réinitialiser le titre et la catégorie
    if (photoTitleInput) {
        photoTitleInput.value = ''; // Effacer le titre
    }
    if (categorySelect) {
        categorySelect.selectedIndex = 0; // Réinitialiser la sélection
    }

    // Réafficher le bouton "+ Ajouter photo" et le texte d'information
    if (iconeImg) {
        iconeImg.classList.remove('hidden'); // Réafficher l'icône
    }
    if (infotxt) {
        infotxt.classList.remove('hidden'); // Réafficher le texte
    }
    if (btnSubmit) {
        btnSubmit.classList.remove('hidden'); // Réafficher le bouton "+ Ajouter photo"
    }
};

//fonction pour envoyer le formulaire
const handleSubmitForm = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log("Formulaire soumis");

    const formData = new FormData(formAddPhoto);
    console.log('Données du formulaire:', Array.from(formData.entries())); // Affiche les données dans la console

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });
        console.log('Réponse du serveur:', await response.text());
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du projet');
        }
        
        alert('Projet ajouté avec succès');
        
        // Réinitialiser le formulaire
        resetFormFields(); 
        
        // Mettre à jour la galerie
        await fetchProjects(); //fetchProjects est bien défini et accessible
        displayModalGallery(); // Met à jour la galerie dans la modale

    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite lors de l\'ajout du projet');
    }
};

// Attacher le gestionnaire à l'événement submit du formulaire
console.log("Attachement du gestionnaire d'événement");
formAddPhoto.addEventListener('submit', handleSubmitForm);

//Fonction pour fermer la modal
const closeModal = (e) => {
    if (modal === null) return;
    if(previousyFocusedElement !==null) previousyFocusedElement.focus()
    e.preventDefault();
 //reset le formulaire d'ajout de photo quand on ferme la modal
    resetFormFields();

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

//On selectionne tous les element avec la class js-modal et on écoute le click pour chaque element
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
    openModal()
});

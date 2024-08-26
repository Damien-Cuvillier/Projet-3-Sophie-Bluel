//lien pour le swagger http://localhost:5678/api-docs/
let allProjects = []; // Stocker tous les projets ici

// Fonction pour créer un élément de figure pour chaque projet et description = true pour afficher ou non les titres des images pareil pour les icones
const createProjectFigure = (project, description = true, deleteIcon = false) => {
    const figure = document.createElement('figure');
    figure.dataset.id = project.id; // Ajoutez l'ID du projet au dataset pour le retrouver plus tard
    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title;

    figure.appendChild(img);
// Boucle afficher le titre des images dans la galerie et ne pas l'afficher dans la modal
    if (description) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = project.title;
        figure.appendChild(figcaption);
    }
// Boucle ne pas afficher l'icone corbeille des images dans la galerie et l'afficher dans la modal
    if (deleteIcon) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'fa fa-trash delete-icon';
        deleteButton.type = 'button'; // Assurez-vous que ce n'est pas un bouton de type submit
        deleteButton.addEventListener('click', (event) => {
            handleDeleteProject(project.id, figure, event); // Passe l'élément à supprimer avec l'ID
        });
        figure.appendChild(deleteButton);
    }

    return figure;
};

    const gallery = document.querySelector('.gallery');
    const categoryMenu = document.querySelector('.category-menu');
    

    // Fonction pour afficher les projets dans la galerie
    const displayProjects = (projects) => {
        gallery.innerHTML = '';// Nettoyer la galerie avant de la remplir
        projects.forEach(project => {
            const projectFigure = createProjectFigure(project);
            gallery.appendChild(projectFigure);
        });
    };

    // Fonction pour récupérer les projets depuis l'API
    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error(`Erreur HTTP! status: ${response.status}`);
            }
            const projects = await response.json();
            allProjects = projects; // Stocker les projets récupérés
            displayProjects(projects);
            displayModalGallery(); // Mettre à jour la galerie dans la modal si nécessaire
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        }
    };

    // Fonction pour récupérer les catégories depuis l'API
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error(`Erreur HTTP! status: ${response.status}`);
            }
            const categories = await response.json();
            createCategoryMenu(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    };

    // Fonction pour créer le menu des catégories
    const createCategoryMenu = (categories) => {
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => {
            displayProjects(allProjects); // Afficher tous les projets
        });
        categoryMenu.appendChild(allButton);

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.addEventListener('click', () => {
                filterProjectsByCategory(category.id);
            });
            categoryMenu.appendChild(button);
        });
    };
    //Fonction pour trier les projets 
    const filterProjectsByCategory= (categoryID) =>{
        const filtredProjects= allProjects.filter(project => project.category.id === categoryID)
           displayProjects(filtredProjects)
        }
    
    // Initialiser la galerie et le menu des catégories
    document.addEventListener('DOMContentLoaded', () => {
        fetchProjects();
        fetchCategories();
    });
   
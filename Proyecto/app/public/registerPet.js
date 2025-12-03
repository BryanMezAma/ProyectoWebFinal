/**
 * registerPet.js - Script para registrar mascotas
 */

const API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar que hay sesión activa
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
        alert('Debes iniciar sesión para registrar una mascota');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userData);

    // Verificar que es dueño de mascotas
    if (user.role !== 'PET_OWNER') {
        alert('Solo los dueños pueden registrar mascotas');
        window.location.href = 'home.html';
        return;
    }

    // Configurar formulario
    const form = document.getElementById('form-mascota');
    if (form) {
        form.addEventListener('submit', registerPet);
    }

    // Cargar mascotas del usuario
    loadUserPets(user._id);
});

async function registerPet(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const petData = {
        name: document.getElementById('nombre').value,
        age: parseInt(document.getElementById('edad').value),
        breed: document.getElementById('raza').value,
        description: document.getElementById('descripcion').value,
        species: document.getElementById('especie') ? document.getElementById('especie').value : 'Perro',
        sex: document.getElementById('sexo') ? document.getElementById('sexo').value : 'M',
        imageurl: document.getElementById('imagen') ? document.getElementById('imagen').value : 'https://via.placeholder.com/300x200?text=Mascota',
        owner: userData._id
    };

    try {
        const response = await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify(petData)
        });

        if (response.ok) {
            const savedPet = await response.json();
            alert(`¡Mascota ${savedPet.name} registrada exitosamente!`);
            
            // Limpiar formulario
            document.getElementById('form-mascota').reset();
            
            // Recargar lista de mascotas
            loadUserPets(userData._id);
        } else {
            const errorText = await response.text();
            alert('Error al registrar mascota: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

async function loadUserPets(ownerId) {
    const petsContainer = document.getElementById('mis-mascotas');
    if (!petsContainer) return;

    try {
        const response = await fetch(`${API_URL}/pets`);
        if (response.ok) {
            const pets = await response.json();
            const userPets = pets.filter(pet => pet.owner === ownerId);
            
            if (userPets.length === 0) {
                petsContainer.innerHTML = '<p class="text-muted">No tienes mascotas registradas aún.</p>';
                return;
            }

            petsContainer.innerHTML = userPets.map(pet => `
                <div class="pet-card" data-uuid="${pet.uuid}">
                    <img src="${pet.imageurl}" alt="${pet.name}" onerror="this.src='https://via.placeholder.com/150?text=Sin+imagen'">
                    <div class="pet-info">
                        <h5>${pet.name}</h5>
                        <p>${pet.breed} - ${pet.age} años</p>
                        <span class="badge ${pet.isAdopted ? 'badge-success' : 'badge-warning'}">
                            ${pet.isAdopted ? 'Adoptado' : 'Disponible'}
                        </span>
                    </div>
                    <div class="pet-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editPet('${pet.uuid}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletePet('${pet.uuid}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar mascotas:', error);
    }
}

async function deletePet(uuid) {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/pets/${uuid}`, {
            method: 'DELETE',
            headers: {
                'x-auth': token
            }
        });

        if (response.ok) {
            alert('Mascota eliminada correctamente');
            const userData = JSON.parse(localStorage.getItem('userData'));
            loadUserPets(userData._id);
        } else {
            alert('Error al eliminar la mascota');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function editPet(uuid) {
    // Redirigir a página de edición o abrir modal
    window.location.href = `editPet.html?uuid=${uuid}`;
}

// Exportar funciones
window.registerPet = registerPet;
window.loadUserPets = loadUserPets;
window.deletePet = deletePet;
window.editPet = editPet;


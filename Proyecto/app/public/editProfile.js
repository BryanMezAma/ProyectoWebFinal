/**
 * editProfile.js - Script para editar el perfil del usuario
 */

const API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar que hay sesión activa
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
        alert('Debes iniciar sesión para editar tu perfil');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userData);
    loadUserData(user);

    // Configurar formulario de edición
    document.getElementById('confirmEdit').addEventListener('click', saveChanges);
});

function loadUserData(user) {
    // Cargar datos en los campos
    document.getElementById('nameEdit').value = user.name || '';
    document.getElementById('addressEdit').value = user.address || '';
    document.getElementById('phoneEdit').value = user.phone || '';

    // Mostrar email (solo lectura) si existe el elemento
    const emailDisplay = document.getElementById('emailDisplay');
    if (emailDisplay) {
        emailDisplay.textContent = user.email;
    }

    // Mostrar campos adicionales según el rol
    if (user.role === 'ADOPTER') {
        showAdopterFields(user);
    }
}

function showAdopterFields(user) {
    const container = document.getElementById('edit-container');
    const buttonsDiv = container.querySelector('.buttons');

    // Crear campos adicionales para adoptantes
    const additionalFields = `
        <label for="ageEdit">Edad:</label>
        <div class="input-group mb-3">
            <input type="number" name="ageEdit" id="ageEdit" class="form-control" placeholder="Tu edad" value="${user.age || ''}">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
        </div>

        <label for="hasPetsEdit">¿Tienes mascotas?</label>
        <div class="input-group mb-3">
            <select name="hasPetsEdit" id="hasPetsEdit" class="form-control">
                <option value="">Selecciona una opción</option>
                <option value="si" ${user.hasPets === 'si' ? 'selected' : ''}>Sí</option>
                <option value="no" ${user.hasPets === 'no' ? 'selected' : ''}>No</option>
            </select>
        </div>

        <label for="petPreferencesEdit">Preferencia de mascota:</label>
        <div class="input-group mb-3">
            <select name="petPreferencesEdit" id="petPreferencesEdit" class="form-control">
                <option value="">Selecciona una opción</option>
                <option value="perro" ${user.petPreferences === 'perro' ? 'selected' : ''}>Perro</option>
                <option value="gato" ${user.petPreferences === 'gato' ? 'selected' : ''}>Gato</option>
                <option value="ambos" ${user.petPreferences === 'ambos' ? 'selected' : ''}>Ambos</option>
            </select>
        </div>

        <label for="sizePreferencesEdit">Preferencia de tamaño:</label>
        <div class="input-group mb-3">
            <select name="sizePreferencesEdit" id="sizePreferencesEdit" class="form-control">
                <option value="">Selecciona una opción</option>
                <option value="pequeno" ${user.sizePreferences === 'pequeno' ? 'selected' : ''}>Pequeño</option>
                <option value="mediano" ${user.sizePreferences === 'mediano' ? 'selected' : ''}>Mediano</option>
                <option value="grande" ${user.sizePreferences === 'grande' ? 'selected' : ''}>Grande</option>
            </select>
        </div>

        <label for="commentsEdit">Comentarios adicionales:</label>
        <div class="input-group mb-3">
            <textarea name="commentsEdit" id="commentsEdit" class="form-control" rows="3" placeholder="Cuéntanos más sobre ti...">${user.comments || ''}</textarea>
        </div>
    `;

    // Insertar antes de los botones
    buttonsDiv.insertAdjacentHTML('beforebegin', additionalFields);
}

async function saveChanges() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));

    const updates = {
        name: document.getElementById('nameEdit').value,
        address: document.getElementById('addressEdit').value,
        phone: document.getElementById('phoneEdit').value
    };

    // Campos adicionales para adoptantes
    if (userData.role === 'ADOPTER') {
        const ageField = document.getElementById('ageEdit');
        const hasPetsField = document.getElementById('hasPetsEdit');
        const petPreferencesField = document.getElementById('petPreferencesEdit');
        const sizePreferencesField = document.getElementById('sizePreferencesEdit');
        const commentsField = document.getElementById('commentsEdit');

        if (ageField) updates.age = parseInt(ageField.value) || undefined;
        if (hasPetsField && hasPetsField.value) updates.hasPets = hasPetsField.value;
        if (petPreferencesField && petPreferencesField.value) updates.petPreferences = petPreferencesField.value;
        if (sizePreferencesField && sizePreferencesField.value) updates.sizePreferences = sizePreferencesField.value;
        if (commentsField) updates.comments = commentsField.value;
    }

    // Campos adicionales para dueños
    if (userData.role === 'PET_OWNER') {
        const commentsField = document.getElementById('commentsEdit');
        if (commentsField) updates.comments = commentsField.value;
    }

    try {
        const response = await fetch(`${API_URL}/users/${userData.email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            // Actualizar datos en localStorage
            const updatedUser = { ...userData, ...updates };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            
            alert('¡Perfil actualizado correctamente!');
            
            // Redirigir según el rol
            if (userData.role === 'ADOPTER') {
                window.location.href = 'adopterHome.html';
            } else {
                window.location.href = 'adopterHome.html';
            }
        } else {
            const errorText = await response.text();
            alert('Error al actualizar: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}


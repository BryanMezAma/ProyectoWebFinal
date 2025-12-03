"use strict"

// Guardar mascotas
function guardarMascota(mascota) {
    let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
    mascotas.push(mascota);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

// Mostrar mascotas
function mostrarMascotas() {
    const container = document.getElementById('mascotas-container');
    if (!container) return;
    let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
    container.innerHTML = mascotas.map((m, i) => `
        <div class="mascota">
            <h3>${m.nombre}</h3>
            <p>Edad: ${m.edad} | Raza: ${m.raza}</p>
            <p>${m.descripcion}</p>
        </div>
    `).join('');
}

// Registrar mascota
const formMascota = document.getElementById('form-mascota');
if(formMascota) {
    formMascota.addEventListener('submit', e => {
        e.preventDefault();
        const mascota = {
            nombre: document.getElementById('nombre').value,
            edad: document.getElementById('edad').value,
            raza: document.getElementById('raza').value,
            descripcion: document.getElementById('descripcion').value
        };
        guardarMascota(mascota);
        alert('Mascota registrada!');
        formMascota.reset();
    });
}

// Guardar solicitud
function guardarSolicitud(solicitud) {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    solicitudes.push(solicitud);
    localStorage.setItem('solicitudes', JSON.stringify(solicitud));
}

// Mostrar solicitudes
function mostrarSolicitudes() {
    const container = document.getElementById('solicitudes-container');
    if (!container) return;
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    container.innerHTML = solicitudes.map(s => `
        <div class="solicitud">
            <p>Nombre: ${s.nombre}</p>
            <p>Correo: ${s.correo}</p>
            <p>Mascota de interés: ${s.mascota}</p>
        </div>
    `).join('');
}

// Registrar interesado
const formAdopcion = document.getElementById('form-adopcion');
if(formAdopcion) {
    // Llenar select con mascotas
    const select = document.getElementById('mascota-interes');
    let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
    select.innerHTML = mascotas.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('');

    formAdopcion.addEventListener('submit', e => {
        e.preventDefault();
        const solicitud = {
            nombre: document.getElementById('nombre-interesado').value,
            correo: document.getElementById('correo-interesado').value,
            mascota: select.value
        };
        let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
        solicitudes.push(solicitud);
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
        alert('Solicitud enviada!');
        formAdopcion.reset();
    });
}

// Ejecutar funciones de renderizado si corresponde
mostrarMascotas();
mostrarSolicitudes();

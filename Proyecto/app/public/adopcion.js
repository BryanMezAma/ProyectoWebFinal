/////Archivo para da en adopcion una mascota
//funcion para dar en adopcion
//poder subir una imagen
//poder dar una descripcion del animal, como otros datos

// adopcion.js — enviar mascota al backend (dar en adopción)

"use strict"

document.getElementById("formAdopcion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const petData = {
        name: document.getElementById("nombre").value,
        age: Number(document.getElementById("edad").value),
        species: document.getElementById("especie").value,
        breed: document.getElementById("raza").value,
        sex: document.getElementById("sexo").value,
        description: document.getElementById("descripcion").value,
        imageurl: document.getElementById("imagen").value   // si usas URL
    };

    try {
        const response = await fetch("http://localhost:3000/mascotas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(petData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Mascota registrada con éxito");
            console.log("Nueva mascota:", result);
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error("Error al dar en adopción:", err);
        alert("Error en el servidor");
    }
});

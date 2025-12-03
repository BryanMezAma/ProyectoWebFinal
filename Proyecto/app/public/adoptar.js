////archico js para adoptar una mascota
//funcion para adoptar
//funcion para marcar en favoritos, entre otros

"use strict"

async function adopt(uuid) {
    const adopterInfo = {
        name: document.getElementById("nombreAdoptante").value,
        phone: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
    };

    try {
        const response = await fetch(
            `http://localhost:3000/mascotas/${uuid}/adoptar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adopterInfo),
            }
        );

        const result = await response.json();

        if (response.ok) {
            alert("Mascota adoptada con éxito");
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error("Error al adoptar:", err);
        alert("Error en el servidor");
    }
}

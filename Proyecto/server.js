"use strict";

process.env.TOKEN_KEY = "ABC123#";

const express = require("express");
const path = require("path");
const router = require("./app/Controllers/router");
const app = express();
const port = process.env.PORT || 3000;

// Conexion a la base de datos
require("./app/db/connection");

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "app/views")));
app.use("/js", express.static(path.join(__dirname, "app/public")));

// Rutas de la API
app.use("/api", router);

// Ruta principal - redirigir a home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "app/views/home.html"));
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.log(`Páginas disponibles:`);
    console.log(`  - http://localhost:${port}/home.html`);
    console.log(`  - http://localhost:${port}/login.html`);
    console.log(`  - http://localhost:${port}/register.html`);
    console.log(`  - http://localhost:${port}/editProfile.html`);
    console.log(`  - http://localhost:${port}/registerPet.html`);
});

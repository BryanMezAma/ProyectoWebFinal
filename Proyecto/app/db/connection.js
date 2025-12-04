"use strict";


const mongoose = require("mongoose");

 
const petsDB = process.env.PETS_DB;//"mongodb+srv://Ejemplo:ejemplo@cluster0.l7qmfac.mongodb.net/PetsDB";
const usersDB = process.env.USERS_DB;//"mongodb+srv://Ejemplo:ejemplo@cluster0.l7qmfac.mongodb.net/UsersDB";

 
const petsConnection = mongoose.createConnection(petsDB);
const usersConnection = mongoose.createConnection(usersDB);

 
petsConnection.once("open", () => console.log("MongoDB PetsDB conectado"));
petsConnection.on("error", (err) => console.error("PetsDB connection error:", err));

usersConnection.once("open", () => console.log("MongoDB UsersDB conectado"));
usersConnection.on("error", (err) => console.error("UsersDB connection error:", err));

// Exportar las conexiones
module.exports = {
    petsConnection,
    usersConnection,
};

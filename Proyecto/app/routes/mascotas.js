"use strict";

const express = require("express");
const router = express.Router();
const dataHandler = require("../Controllers/data_handler");

router.get("/", (req, res) => {
    dataHandler.getPets(req, res);
});

router.get("/:uuid", (req, res) => {
    dataHandler.getPetById(req, res);
});

router.post("/", (req, res) => {
    dataHandler.createPet(req, res);
});

router.put("/:uuid", (req, res) => {
    dataHandler.updatePet(req, res);
});

router.delete("/:uuid", (req, res) => {
    dataHandler.deletePet(req, res);
});

module.exports = router;

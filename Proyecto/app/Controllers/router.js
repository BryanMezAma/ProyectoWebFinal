"use strict"

const express = require("express");
const router = express.Router();
const mascotasRouter = require('../routes/mascotas.js');
const usersRouter = require('../routes/users.js')

router.use("/pets", mascotasRouter);
router.use('/users', usersRouter);

router.get("/", (req, res) => {
    res.send("Proyecto mascotas");
});

module.exports = router;

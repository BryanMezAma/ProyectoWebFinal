"use strict";

const express = require("express");
const router = express.Router();
const dataHandler = require("../Controllers/data_handler");
const tokenUtils = require('../Controllers/token_utils');

router.route("/login")
.post((req, res) => dataHandler.login(req, res));

router.get("/", (req, res) => {
    dataHandler.getUsers(req, res);
});

router.post("/", (req, res) => {
    dataHandler.createUser(req, res);
});


router.use('/:email', tokenUtils.verifyToken);



router
    .route("/:email")
    .get((req, res) => {
        dataHandler.getUserByEmail(req, res);
    })
    .put((req, res) => {
        dataHandler.updateUser(req, res);
    })
    .delete((req, res) => {
        dataHandler.deleteUser(req, res);
    });


module.exports = router;

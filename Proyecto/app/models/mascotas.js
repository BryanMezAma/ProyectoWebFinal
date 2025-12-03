"use strict";

const mongoose = require("mongoose");
const { generateUUID } = require("../Controllers/utils");
const { usersConnection, petsConnection } = require("../db/connection");

const petSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: () => generateUUID(),
        immutable: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    age: {
        type: Number,
        required: true,
        min: 0,
    },

    imageurl: {
        type: String,
        required: true,
        trim: true,
    },

    breed: {
        type: String,
        required: true,
        trim: true,
    },

    sex: {
        type: String,
        enum: ["M", "F"],
        required: true,
    },

    species: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    isAdopted: {
        type: Boolean,
        default: false,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Pet = petsConnection.model("Pet", petSchema);

module.exports = Pet;

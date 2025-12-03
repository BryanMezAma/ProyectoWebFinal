"use strict";

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersConnection } = require("../db/connection");

let privateKey = process.env.TOKEN_KEY;

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    address: {
        type: String,
        trim: true,
    },

    phone: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 0,
    },

    hasPets: {
        type: String,
        enum: ["si", "no"],
    },

    petPreferences: {
        type: String,
        enum: ["perro", "gato", "ambos"],
    },

    sizePreferences: {
        type: String,
        enum: ["pequeno", "mediano", "grande"],
    },

    comments: {
        type: String,
        trim: true,
    },

    role: {
        type: String,
        enum: ["ADOPTER", "PET_OWNER"],
        required: true,
    },

    profilePicture: String,
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.generateToken = function (password) {
    let user = this;
    let payload = { id: user._id, role: user.role };
    let options = { expiresIn: 60 * 60 };
    if (bcrypt.compareSync(password, user.password)) {
        try {
            return jwt.sign(payload, privateKey, options);
        } catch (err) {
            console.log(err);
        }
    }
};

const User = usersConnection.model("User", userSchema);

module.exports = User;

"use strict";

const User = require("../models/users");
const Pet = require("../models/mascotas");

function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        email: `${email}`,
    })

        .then((user) => {
            let token = user.generateToken(password);
            if (token != undefined) {
                res.status(200);
                res.type("text/plain");
                res.send(token);
            } else {
                res.status(401);
                res.type("text/plain");
                res.send("Wrong email or password");
            }
        })
        .catch((err) => {
            res.status(401);
            res.type("text/plain");
            res.send("Wrong email or password");
        });
}

function getUsers(req, res) {
    return User.find({})
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(400).send(err));
}

function getUserByEmail(req, res) {
    let email = req.params.email;

    return User.find({
        email: `${email}`,
    })
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(400).send(err));
}

function createUser(req, res) {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name || !phone || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const user = new User({ email, password, name, phone, role });

    user.save()
        .then((savedUser) => {
            res.status(201).json({
                message: `User ${savedUser.name} was created`,
                user: {
                    id: savedUser._id,
                    email: savedUser.email,
                    name: savedUser.name,
                    role: savedUser.role,
                },
            });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
}

function updateUser(req, res) {
    const email = req.params.email;
    const updates = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) return res.status(404).send("User not found");

            let allowedFields = [];
            if (user.role === "ADOPTER") {
                allowedFields = [
                    "name",
                    "phone",
                    "address",
                    "age",
                    "hasPets",
                    "petPreferences",
                    "sizePreferences",
                    "comments",
                    "profilePicture",
                ];
            } else if (user.role === "PET_OWNER") {
                allowedFields = [
                    "name",
                    "phone",
                    "address",
                    "profilePicture",
                    "comments",
                ];
            }

            const filteredUpdates = {};
            for (let i = 0; i < allowedFields.length; i++) {
                const field = allowedFields[i];
                if (updates[field] !== undefined) {
                    filteredUpdates[field] = updates[field];
                }
            }

            return User.findOneAndUpdate({ email }, filteredUpdates, {
                new: true,
            });
        })
        .then((updatedUser) => {
            if (!updatedUser) return;
            res.status(200)
                .type("text/plain")
                .send(`User ${updatedUser.name} was updated`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Server error");
        });
}

function deleteUser(req, res) {
    let email = req.params.email;

    User.findOneAndDelete({
        email: `${email}`,
    })
        .then((user) => {
            res.type("text/plain")
                .status(200)
                .send(`User ${user.name} was deleted`);
        })
        .catch((err) => res.status(400).send(err));
}

function getPets(req, res) {
    return Pet.find({})
        .then((pets) => res.status(200).json(pets))
        .catch((err) => res.status(400).send(err));
}

function getPetById(req, res) {
    let uuid = req.params.uuid;

    return Pet.find({
        uuid: `${uuid}`,
    })
        .then((pet) => res.status(200).json(pet))
        .catch((err) => res.status(400).send(err));
}

function createPet(req, res) {
    const petData = req.body;

    if (!petData.owner) {
        return res.status(400).send("Missing owner ID");
    }

    const newPet = new Pet({
        name: petData.name,
        age: petData.age,
        imageurl: petData.imageurl,
        breed: petData.breed,
        sex: petData.sex,
        species: petData.species,
        description: petData.description,
        owner: petData.owner,
    });

    newPet
        .save()
        .then((savedPet) => {
            res.status(201).type("application/json").send(savedPet);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Error creating pet");
        });
}

function updatePet(req, res) {
    const uuid = req.params.uuid;
    const data = req.body;

    const allowedFields = [
        "name",
        "age",
        "imageurl",
        "breed",
        "sex",
        "species",
        "description",
        "isAdopted",
    ];

    const updates = {};

    for (let i = 0; i < allowedFields.length; i++) {
        const field = allowedFields[i];
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    }

    Pet.findOneAndUpdate({ uuid: uuid }, updates, { new: true })
        .then((updatedPet) => {
            if (!updatedPet) {
                return res.status(404).send("Pet not found");
            }

            res.status(200).type("application/json").send(updatedPet);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Error updating pet");
        });
}

function deletePet(req, res) {
    const uuid = req.params.uuid;

    Pet.findOneAndDelete({ uuid: uuid })
        .then((deletedPet) => {
            if (!deletedPet) {
                return res.status(404).send("Pet not found");
            }

            res.status(200)
                .type("text/plain")
                .send(`Pet ${deletedPet.name} was deleted`);
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Error deleting pet");
        });
}

exports.login = login;
exports.getUsers = getUsers;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getPets = getPets;
exports.getPetById = getPetById;
exports.createPet = createPet;
exports.updatePet = updatePet;
exports.deletePet = deletePet;

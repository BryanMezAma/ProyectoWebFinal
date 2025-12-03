"use strict"

const utils = require('./utils');

class ProductException {
    constructor(message) {
        this.errorMessage = message;
    }
}

class Mascotas {
    constructor(name, age, imageurl, breed, sex, species, description,  uuid = null, isAdopted = false) {
        this._uuid = uuid || utils.generateUUID();
        this._name = name;
        this._age = age;
        this._imageurl = imageurl;
        this._breed = breed;
        this._sex = sex;
        this._species = species;
        this._description = description;
        this._isAdopted = isAdopted;

        this._fixSetters();
    }

    get uuid(){ 
        return this._uuid; 
    }
    set uuid(_){ throw new ProductException("UUID cannot be changed"); 

    }

    get name(){ 
        return this._name; 
    }
    set name(v){
        if (!v.trim()) throw new ProductException("Name invalid");
        this._name = v;
    }

    get age(){ 
        return this._age; 
    }

    set age(v) {
        if (typeof v !== "number" || v < 0) throw new ProductException("Age invalid");
        this._age = v;
    }

    get imageurl(){ 
        return this._imageurl; 
    }
    set imageurl(v){
        if (!v.trim()) throw new ProductException("Image URL invalid");
        this._imageurl = v;
    }

    get breed(){ 
        return this._breed; 
    }
    set breed(v) {
        if (!v.trim()) throw new ProductException("Breed invalid");
        this._breed = v;
    }

    get sex(){ 
        return this._sex; 
    }

    set sex(v){
        if (!v.trim()) throw new ProductException("Sex invalid");
        this._sex = v;
    }

    get species(){ 
        return this._species; 
    }
    set species(v){
        if (!v.trim()) throw new ProductException("Species invalid");
        this._species = v;
    }

    get description(){ 
        return this._description; 
    }
    set description(v) {
        if (!v.trim()) throw new ProductException("Description invalid");
        this._description = v;
    }

    get isAdopted(){ 
        return this._isAdopted; 
    }
    set isAdopted(v){ 
        this._isAdopted = Boolean(v); 
    }

    _fixSetters() {
        this._name = this._name || "";
        this._imageurl = this._imageurl || "";
        this._description = this._description || "";
        this._species = this._species || "";
        this._age = this._age || 0;
        this._sex = this._sex || "";
        this._breed = this._breed || "";
    }

    toJSON() {
        return {
            uuid: this._uuid,
            name: this._name,
            age: this._age,
            species: this._species,
            description: this._description,
            imageurl: this._imageurl,
            sex: this._sex,
            breed: this._breed,
            isAdopted: this._isAdopted
        };
    }

    static cleanObject(obj) {
        const allowed = ["_uuid", "_name", "_age", "_species", "_description", "_imageurl", "_sex", "_breed", "_isAdopted"];
        for (let k in obj) {
            if (!allowed.includes(k)) delete obj[k];
        }
    }

    static createFromObject(obj) {
        this.cleanObject(obj);
        const pet = new Mascotas(
            obj._name,
            obj._age,
            obj._imageurl,
            obj._breed,
            obj._sex,
            obj._species,
            obj._description,
            obj._uuid,       // ahora sí se pasa correctamente
            obj._isAdopted
        );
        if (obj._uuid) pet._uuid = obj._uuid;
        if (obj._isAdopted) pet._isAdopted = obj._isAdopted;
        return pet;
    }
}

module.exports = Mascotas;
module.exports.ProductException = ProductException;

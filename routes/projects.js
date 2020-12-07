const express = require('express');
const _ = require("lodash");

const Category = require('../database/models/category');
const Timer = require("../database/models/timer");
const User = require("../database/models/user");

const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();


// Get all Projects (Categories) with extra informations

router.get('/', auth(), async (req, res) => {
  try {
    const categories = await Category.find();
    let result = [];
    for(let category of categories){
        const timers = await Timer.find({category}).sort([['started_at',1]]);

        total_time = 0;
        first_entry = null;
        last_entry = null;

        for(let timer of timers){
            if(!first_entry){ first_entry = timer.started_at; }
            last_entry = timer.started_at;
            total_time += timer.stopped_at.getTime() - timer.started_at.getTime();
        }

        result.push({
            id: category.id,
            name: category.name,
            description: category.description,
            total_time: total_time,
            first_entry: first_entry,
            last_entry: last_entry
        });
    }

    return res.send(result);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// Get Project Timers by ID

router.get('/:id/timers', auth(), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const timers = await Timer.find({category}).sort([['started_at',1]]);
        return res.send(timers);
    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: e.message });
    }
});


// Get Project by ID

router.get('/:id', auth(), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const timers = await Timer.find({category}).sort([['started_at',1]]);

        total_time = 0;
        first_entry = null;
        last_entry = null;

        for(let timer of timers){
            if(!first_entry){ first_entry = timer.started_at; }
            last_entry = timer.started_at;
            total_time += timer.stopped_at.getTime() - timer.started_at.getTime();
        }

        result = {
            id: category.id,
            name: category.name,
            description: category.description,
            total_time: total_time,
            first_entry: first_entry,
            last_entry: last_entry
        };
        return res.send(result);
    } catch (e) {
        console.log(e);
        return res.status(500).send({ error: e.message });
    }
});


module.exports = router;


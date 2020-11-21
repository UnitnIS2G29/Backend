const express = require('express');
const _ = require("lodash");

const Department = require('../database/models/department');
const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

router.get('/', auth(), async (req, res) => {
    try {
        const departments = await Department.find();
        res.send(departments);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

router.get('/:id', auth(), async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        res.send(department);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

router.post('/', [
    auth("supervisor"),
    check('name').notEmpty().isString(),
    check('description').isString(),
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty())
        res.status(400).send({errors: errors.array()});

    try {
        let department = new Department({..._.pick(req.body, ["name", "description"]), ...{employees: []}});
        department = await department.save();
        res.status(201).send(department);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

router.put('/:id', [
    auth("supervisor"),
    check('name').notEmpty().isString(),
    check('description').isString()
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty())
        res.status(400).send({errors: errors.array()});

    try {
        let department = await Department.updateOne({_id: req.params.id}, _.pick(req.body, ["name", "description"]));
        res.status(201).send(department);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }});

router.delete('/:id', auth("admin"), async (req, res) => {
    try {
        const id = req.params.id;
        let department = await Department.findById(id);
        department = await department.remove();
        res.send(department);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;


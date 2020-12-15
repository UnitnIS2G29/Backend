const express = require('express');
const _ = require("lodash");

const Department = require('../database/models/department');
const User = require('../database/models/user');
const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

/**
 * Get Departments
 * Returns all the saved departments
 */
router.get('/', auth(), async (req, res) => {
    try {
        const departments = await Department.find();
        res.send(departments);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

/**
 * Get Departments
 * Returns every department where the logged user is an employee
 */
router.get('/self', auth(), async (req, res) => {
    try {
        let departments = await Department.find({employees: {_id: req.user}})
        res.send(departments)
    } catch (e) {
        console.log(e);
        res.status(500).send({error: e.message});
    }
});

/**
 * Get a particular Department
 * Returns the requested department
 */
router.get('/:id', auth(), async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        res.send(department);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

/**
 * Get employees of a department
 * Returns list the of employees in the requested department
 */
router.get('/:id/employees', auth(), async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        console.log(department)
        console.log(department.employees)
        res.send(department.employees);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

/**
 * Add a new Department
 * Create and insert in the database a new department
 * Returns the newly created department
 */
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

/**
 * Add a new employee to the Department
 * Returns the modified Department
 */
router.post('/:id/employees',
    [
        auth("admin"),
        check("user").notEmpty().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findById(req.body.user);
            let department = await Department.findById(req.params.id);
            department.employees.push(user);
            department = await department.save();
            res.status(201).send(department);

        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    })

/**
 * Modify a Department
 * Returns the modified department
 */
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

/**
 * Delete department
 * Returns the deleted department
 */
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


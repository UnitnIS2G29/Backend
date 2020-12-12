const express = require('express');
const _ = require("lodash");

const Category = require('../database/models/category');
const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

// Get all Categories

router.get('/', auth(), async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// Get Category by ID

router.get('/:id', auth(), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).send(category);
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
});

// Add new Category

router.post('/', [
  auth("supervisor"),
  check('name').notEmpty().isString(),
  check('description').isString(),
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty())
    return res.status(400).send({errors: errors.array()});

  try {
    let category = new Category(_.pick(req.body, ["name", "description"]));
    category = await category.save();
    return res.status(201).send(category);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// Modify a category given the id

router.put('/:id', [
  auth("supervisor"),
  check('name').notEmpty().isString(),
  check('description').isString()
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty())
    return res.status(400).send({errors: errors.array()});

  try {
    let category = await Category.updateOne({_id: req.params.id}, _.pick(req.body, ["name", "description"]));
    return res.status(201).send(category);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }});

// Delete a category

router.delete('/:id', auth("supervisor"), async (req, res) => {
  try {
    const id = req.params.id;
    let category = await Category.findById(id);
    category = await category.remove();
    res.status(200).send(category);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

module.exports = router;


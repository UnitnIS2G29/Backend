const express = require('express');
const _ = require("lodash");

const Category = require('../database/models/category');
const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

router.get('/', auth(), async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

router.get('/:id', auth(), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (e) {
    debugDB(e);
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
    let category = new Category(_.pick(req.body, ["name", "description"]));
    category = await category.save();
    res.status(201).send(category);
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
    let category = await Category.updateOne({_id: req.params.id}, _.pick(req.body, ["name", "description"]));
    res.status(201).send(category);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }});

router.delete('/:id', auth("admin"), async (req, res) => {
  try {
    const id = req.params.id;
    let category = await Category.findById(id);
    category = await category.remove();
    res.send(category);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;


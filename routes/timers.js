const express = require('express');
const {
  check,
  validationResult
} = require('express-validator');
const _ = require('lodash');
const router = express.Router();

const auth = require('../middlewares/auth');

const Timer = require("../database/models/timer");
const User = require("../database/models/user");
const Category = require("../database/models/category");


router.get('/',[auth()], async (req, res) => {
  try {
    const timers = await Timer.$where('User.id').equals(req.user.id);
    res.status(200).send(timers);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', [
  check('started_at').notEmpty(),
  check('stopped_at').exists(),
  auth()
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    let timer = new Timer(
      _.pick(req.body, ['started_at', 'stopped_at'])
    );

    timer.user = req.user;

    if (req.body.category && req.body.category.id) {
      let category = Category.findById(req.body.category.id);
      if (!category) {
        return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
      }
      timer.category = category;
    }

    if (!timer.stopped_at) {
      const timers = await Timer.$where('User.id').equals(req.user.id).$where('stopped_at').equals(null);
      timers.forEach((data) => {
        data.stopped_at = new Date;
      });
    }

    timer.description = req.body.description;

    timer = await timer.save();

    timer.status(201).send(timer);

  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'User.id': req.user.id,
      'stopped_at': null
    });
    res.status(200).send(timer);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'User.id': req.user.id,
      'stopped_at': null
    });

    if (req.body.started_at) {
      timer.started_at = new Date(req.body.started_at);
    }

    if (req.body.stopped_at) {
      timer.stopped_at = new Date(req.body.stopped_at);
    }

    if(req.body.description){
      timer.description = req.body.description;
    }

    if (req.body.category && req.body.category.id) {
      let category = Category.findById(req.body.category.id);
      if (!category) {
        return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
      }
      timer.category = category;
    }

    timer.save();

    res.status(200).send(timer);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/self',[auth()], async(req, res) => {
  try {
    let timer = await Timer.findOne({
      'User.id': req.user.id,
      'stopped_at': null
    });
    if(timer){
      timer.delete();
    }
    res.status(200).send(timer);
  }catch(e){
    res.status(500).send(e);
  }
});

router.post('/self',[auth()], async (req, res) => {
  try {
    let timer = Timer.create();

    if (req.body.started_at) {
      timer.started_at = new Date(req.body.started_at);
    }

    if (req.body.stopped_at) {
      timer.stopped_at = new Date(req.body.stopped_at);
    }else{
      const timers = await Timer.$where('User.id').equals(req.user.id).$where('stopped_at').equals(null);
      timers.forEach((data) => {
        data.stopped_at = new Date;
      });
    }

    if(req.body.description){
      timer.description = req.body.description;
    }

    if (req.body.category && req.body.category.id) {
      let category = Category.findById(req.body.category.id);
      if (!category) {
        return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
      }
      timer.category = category;
    }

    timer.save();

    res.status(200).send(timer);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'User.id': req.user.id,
      'stopped_at': null
    });

    if(timer){
      timer.stopped_at = new Date();
      timer.save();
      res.status(200).send(timer);
    }else{
      return res.status(400).send(new Error("TIMER NOT FOUND"));
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user.id == req.user.id){
      res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    res.status(500).send(e);
  }
});

router.put('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user.id == req.user.id){

      if (req.body.started_at) {
        timer.started_at = new Date(req.body.started_at);
      }
  
      if (req.body.stopped_at) {
        timer.stopped_at = new Date(req.body.stopped_at);
      }
  
      if(req.body.description){
        timer.description = req.body.description;
      }
  
      if (req.body.category && req.body.category.id) {
        let category = Category.findById(req.body.category.id);
        if (!category) {
          return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
        }
        timer.category = category;
      }
  
      res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user.id == req.user.id){
      timer.delete();
      res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
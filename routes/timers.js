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


/**
 * GET TIMERS
 * Returns full list of timers associated to the currently logged in user
 */
router.get('/',[auth()], async (req, res) => {
  try {
    const timers = await Timer.find({user: req.user}).sort([['started_at',-1]]).populate('category');
    return res.status(200).send(timers);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/**
 * POST TIMERS
 * Creates a new timer entry for the currently logged in user
 */
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
      _.pick(req.body, ['started_at', 'stopped_at','category'])
    );

    timer.user = req.user;


    if (!timer.stopped_at) {
      const timers = await Timer.find({stopped_at: null,user: req.user}).populate('category');;
      timers.forEach((data) => {
        data.stopped_at = new Date;
        data.save();
      });
      timer.stopped_at = null;
    }

    timer.description = req.body.description;

    timer = await timer.save();

    return res.status(201).send(timer);

  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/**
 * GET CURRENTLY RUNNING TIMER
 * Gets the currently running timer (if exists).
 */
router.get('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'user': req.user,
      'stopped_at': null
    }).populate('category');;
    return res.status(200).send(timer);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * EDIT THE CURRENTLY RUNNING TIMER
 * Edits the currently running timer (if exists).
 */
router.put('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'user': req.user,
      'stopped_at': null
    }).populate('category');;

    if(!timer){
      return res.status(404).send("NO RUNNING TIMER");
    }

    if (req.body.started_at) {
      timer.started_at = new Date(req.body.started_at);
    }

    if (req.body.stopped_at) {
      timer.stopped_at = new Date(req.body.stopped_at);
    }

    if(req.body.description){
      timer.description = req.body.description;
    }

    if (req.body.category && req.body.category) {
      let category = await Category.findById(req.body.category._id);
      if (!category) {
        return res.status(400).send(new Error("INVALID CATEGORY PROVIDED"));
      }
      timer.category = category;
    }

    timer.save();

    return res.status(200).send(timer);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * DELETE THE CURRENTLY RUNNING TIMER
 * Deletes the currently running timer (if exists).
 */
router.delete('/self',[auth()], async(req, res) => {
  try {
    let timer = await Timer.findOne({
      'user': req.user,
      'stopped_at': null
    }).populate('category');;
    if(timer){
      timer.delete();
    }
    return res.status(200).send(timer);
  }catch(e){
    return res.status(500).send(e);
  }
});

/**
 * STARTS A NEW RUNNING TIMER
 * Starts a new timer stopping the currently running timer (if exists).
 */
router.post('/self',[auth()], async (req, res) => {
  try {
    let timer = new Timer({stopped_at: null,user: req.user});

    if (req.body.started_at) {
      timer.started_at = new Date(req.body.started_at);
    }

    if (req.body.stopped_at) {
      timer.stopped_at = new Date(req.body.stopped_at);
    }else{
      const timers = await Timer.find({stopped_at: null,user: req.user}).populate('category');;
      timers.forEach((data) => {
        data.stopped_at = new Date;
        data.save();
      });
    }

    if(req.body.description){
      timer.description = req.body.description;
    }

    if (req.body.category && req.body.category) {
      let category = await Category.findById(req.body.category._id);
      if (!category) {
        return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
      }
      timer.category = category;
    }

    timer.save();

    return res.status(200).send(timer);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});


/**
 * STOPS THE NEW RUNNING TIMER
 * Stops the currently running timer
 */
router.patch('/self',[auth()], async (req, res) => {
  try {
    let timer = await Timer.findOne({
      'user': req.user,
      'stopped_at': null
    }).populate('category');;

    if(timer){
      timer.stopped_at = new Date();
      timer.save();
      return res.status(200).send(timer);
    }else{
      return res.status(400).send(new Error("TIMER NOT FOUND"));
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * GET A TIMER BY ID
 * Gets the timer by its id
 */
router.get('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user == req.user.id){
      return res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * EDIT A TIMER BY ID
 * Edits a timer by its id
 */
router.put('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user == req.user.id){

      if (req.body.started_at) {
        timer.started_at = new Date(req.body.started_at);
      }
  
      if (req.body.stopped_at) {
        timer.stopped_at = new Date(req.body.stopped_at);
      }
  
      if(req.body.description){
        timer.description = req.body.description;
      }
  
      if (req.body.category && req.body.category) {
        let category = await Category.findById(req.body.category._id);
        if (!category) {
          return res.status(400).send(new Error("INVALID CATEGORY-ID PROVIDED"));
        }
        timer.category = category;
      }
  
      return res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * DELETES A TIMER BY ID
 * Deletes a timer by id
 */
router.delete('/:id',[auth()], async (req, res) => {
  try {
    const timer = await Timer.findById(req.params.id);
    if(timer && timer.user == req.user.id){
      timer.delete();
      return res.status(200).send(timer); 
    }
    return res.status(400).send(new Error("TIMER ID NOT FOUND"));
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
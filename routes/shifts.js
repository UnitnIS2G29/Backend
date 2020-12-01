const express = require('express');
const _ = require("lodash");
const {check, validationResult} = require('express-validator');

const auth = require('../middlewares/auth');
const Shift = require('../database/models/shift');
const router = express.Router();


//GET ALL SHIFTS

router.get('/', auth("supervisor"), async (req, res) => {
    try {
      const shift = await Shift.find().populate('user').populate('category');
      res.send(shift);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//CREATE A SHIFT FOR A SPECIFIED USER
router.post('/', [
    auth("supervisor"),
    check('user').isMongoId(),
    check('day').isRFC3339(),
    check('timeBegin').isRFC3339(),
    check('timeEnd').isRFC3339(),
    check('category').isMongoId()
    ],
    async (req, res) => {
    const errors = validationResult(req);
      
    if(!errors.isEmpty()){
        res.status(400).send({errors: errors.array()});
        return;
    }
    try {
        let shift = new Shift(_.pick(req.body, ["user","day", "timeBegin","timeEnd","reason","category"]));
        shift = await shift.save();

        res.status(201).send(shift);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

//GET THE SHIFTS OF THE CURRENTLY LOGGED IN USER

router.get('/self', auth(), async (req, res) => {
    try {
      const shift = await Shift.find({
        'user': req.user
      });
      res.send(shift);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//GET A SHIFT BY ID

router.get('/:shiftId', auth(), async (req, res) => {
    try {
      const shift = await Shift.findById(req.params.shiftId);
      res.send(shift);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});


//MODIFY A SHIFT BY ID

router.put('/:shiftId',  [
    auth("supervisor"),
    check('user').optional().isMongoId(),
    check('day').optional().isRFC3339(),
    check('timeBegin').optional().isRFC3339(),
    check('timeEnd').optional().isRFC3339(),
    check('category').optional().isMongoId()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).send({errors: errors.array()});
        return;
    }
    try {
        let shift = await Shift.updateOne({_id: req.params.shiftId}, _.pick(req.body, ["user","day","timeBegin","timeEnd","category"]));
        res.status(201).send(shift);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


//DELETE A SHIFT BY ID
 
router.delete('/:shiftId', auth("admin"), async (req, res) => {
    try {
        let shift = await Shift.findByIdAndDelete(req.params.shiftId);
        res.send(shift);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
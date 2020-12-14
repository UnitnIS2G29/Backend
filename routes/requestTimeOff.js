const express = require('express');
const _ = require("lodash");
const {check, validationResult} = require('express-validator');

const auth = require('../middlewares/auth');
const RequestTimeOff = require('../database/models/requestTimeOff');
const { RequestTypes } = require('../utils/requestTypes');
const router = express.Router();


//GET ALL REQUESTS FOR TIME OFF

router.get('/', auth("supervisor"), async (req, res) => {
    try {
      const requestTimeOff = await RequestTimeOff.find().populate('user');;
      res.send(requestTimeOff);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//CREATE A REQUEST FOR TIME OFF FOR THE CURRENTLY LOGGED IN USER

router.post('/', [
    auth(),
    check('day').isRFC3339(),
    check('day').custom((value, { req }) => {
      if(new Date(value) <= new Date()) {
          throw new Error ('day is before today');
      }
      return true;
    }),
    check('timeBegin').isRFC3339(),
    check('timeBegin').custom((value, { req }) => {
      if(new Date(value) <= new Date()) {
          throw new Error ('timeBegin is before now');
      }
      return true;
    }),
    check('timeEnd').isRFC3339(),
    check('timeEnd').custom((value, { req }) => {
      if(new Date(value) <= new Date()) {
          throw new Error ('timeEnd is before now');
      }
      return true;
    }),
    check('timeEnd').custom((value, { req }) => {
      if(new Date(value) <= new Date(req.body.timeBegin)) {
          throw new Error ('timeBegin is before timeEnd');
      }
      return true;
    }),
    check('reason').optional({nullable:true}).isString(),
    check('category').isIn(RequestTypes),
    check('reviewed').optional({nullable:true}).isBoolean(),
    check('accepted').optional({nullable:true}).isBoolean()
    ],
    async (req, res) => {
    const errors = validationResult(req);
      
    if(!errors.isEmpty()){
        res.status(400).send({errors: errors.array()});
        return;
    }
    try {
        let requestTimeOff = new RequestTimeOff(_.pick(req.body, ["day", "timeBegin","timeEnd","reason","category","accepted"]));
        requestTimeOff.user = req.user;
        requestTimeOff.reviewed = 0;
        requestTimeOff = await requestTimeOff.save();

        res.status(201).send(requestTimeOff);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

//GET ALL REQUESTS FOR TIME OFF OF THE CURRENTLY LOGGED IN USER

router.get('/self', auth(), async (req, res) => {
    try {
      const requestTimeOff = await RequestTimeOff.find({
        'user': req.user
      });
      res.send(requestTimeOff);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//GET A REQUEST FOR TIME OFF BY ID

router.get('/:requestTimeOffId', auth(), async (req, res) => {
    try {
      const requestTimeOff = await RequestTimeOff.findById(req.params.requestTimeOffId);
      res.send(requestTimeOff);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//APPROVE OR DENY A REQUEST FOR TIME OFF BY ID

router.put('/:requestTimeOffId',  [
    auth("supervisor"),
    check('accepted').isBoolean()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).send({errors: errors.array()});
        return;
    }
    try {
        let requestTimeOff = await RequestTimeOff.updateOne({_id: req.params.requestTimeOffId}, _.pick(req.body, ["accepted","reviewed"]));
        res.status(201).send(requestTimeOff);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


//DELETE A REQUEST FOR TIME OFF BY ID
 
router.delete('/:requestTimeOffId', auth("admin"), async (req, res) => {
    try {
        let requestTimeOff = await RequestTimeOff.findByIdAndDelete(req.params.requestTimeOffId);
        res.send(requestTimeOff);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
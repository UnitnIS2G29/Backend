const express = require('express');
const _ = require("lodash");
const {check, validationResult} = require('express-validator');

const auth = require('../middlewares/auth');
const RequestTimeOff = require('../database/models/requestTimeOff');
const { RequestTypes } = require('../utils/requestTypes');
const router = express.Router();


//REQUESTS

router.get('/', auth(), async (req, res) => {
    try {
      const requestTimeOff = await RequestTimeOff.find();
      res.send(requestTimeOff);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

router.post('/', [
    auth(),
    check('day').isRFC3339(),
    check('timeBegin').isRFC3339(),
    check('timeEnd').isRFC3339(),
    check('reason').isString(),
    check('category').isIn(RequestTypes),
    check('accepted').isBoolean()
    ],
    async (req, res) => {
    const errors = validationResult(req);
      
    if(!errors.isEmpty()){
        res.status(400).send({errors: errors.array()});
        return;
    }
    try {
        let requestTimeOff = new RequestTimeOff(_.pick(req.body, ["day", "timeBegin","timeEnd","reason","category","accepted"]));
        requestTimeOff = await requestTimeOff.save();

        res.status(201).json({
            message: 'POST Request is OK!',
            requestTimeOff: requestTimeOff
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});


//REQUESTS BY Id

router.get('/:requestTimeOffId', auth(), async (req, res) => {
    try {
      const requestTimeOff = await RequestTimeOff.findById(req.params.requestTimeOffId);
      res.send(requestTimeOff);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
});

//approve requests
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
        let requestTimeOff = await RequestTimeOff.updateOne({_id: req.params.requestTimeOffId}, _.pick(req.body, ["accepted"]));
        res.status(201).send(requestTimeOff);
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

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
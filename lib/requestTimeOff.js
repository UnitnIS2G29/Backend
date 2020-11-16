const express = require('express');
const router = express.Router();

//Import schema
const RequestTimeOff = require('../models/requestTimeOff');

//Requests
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET Request is OK!'
    });
});

router.post('/', (req, res, next) => {
    const requestTimeOff = new RequestTimeOff({
        //_id: new mongoose.Types.ObjectId(),
        day: req.body.day,
        timeBegin: req.body.timeBegin,
        timeEnd: req.body.timeEnd,
        reason: req.body.reason,
        category: req.body.category,
        accepted: req.body.accepted
    });

    requestTimeOff.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));


    res.status(201).json({
        message: 'POST Request is OK!',
        requestTimeOff: requestTimeOff
    });
});

//Requests by Id
router.get('/:requestTimeOffId', (req, res, next) => {
    const id = req.params.requestTimeOffId;

    res.status(200).json({
        message: 'GET Request by Id is OK!',
        id: id
    });
});

router.put('/:requestTimeOffId', (req, res, next) => {
    const id = req.params.requestTimeOffId;

    res.status(200).json({
        message: 'PUT Request by Id is OK!',
        id: id
    });
});

router.delete('/:requestTimeOffId', (req, res, next) => {
    const id = req.params.requestTimeOffId;

    res.status(200).json({
        message: 'DELETE Request by Id is OK!',
        id: id
    });
});

module.exports = router;
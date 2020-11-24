const express = require('express');
const _ = require("lodash");

const CheckIn = require('../database/models/check-in');
const auth = require('../middlewares/auth');
const {check, validationResult} = require('express-validator');

const router = express.Router();

/*
    Performs a checkin of the logged user at the current time. The checkin expire at midnight
 */
router.get('/', auth(), async (req, res) => {
    try {
        const now = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(now.getDate() + 1)
        tomorrow.setHours(0,0,0,0)
        const checkin = new CheckIn({user: req.user, entrance: {time: now, expiry:tomorrow}})
        checkin.save(function (err, checkin) {
            if (err) throw Error('Failed to save data in DB, ' + err)
        });
        res.send(now)
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

module.exports = router
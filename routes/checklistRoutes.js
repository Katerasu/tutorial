const express = require('express');
const Task = require('../models/model');
const router = express.Router();

//________________ Routing _____________ 

//Get request for checklist page
router.get('/', (req, res) => {
    Task.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'Checklist', tasks: result })
        })
        .catch((err) => console.log(err));
});

//Get request to task detail
router.get('/:taskid', (req, res) => {
    const id = req.params.taskid;
    Task.findById(id)
        .then((result) => res.render('details', { title: 'Task Details', task: result }))
        .catch((err) => console.log(err));
});

//Delete request
router.delete('/:taskid', (req, res) => {
    const id = req.params.taskid;
    Task.findByIdAndDelete(id)
        .then((result) => res.json({ redirect: '/' })) //Cannot do redirect here as this is an AJAX request so need to do redirect from FE
        .catch((err) => console.log(err));
});

//Post request 
router.post('/', (req, res) => {
    req.body.status = 'Pending';
    console.log(req.body);
    const task = new Task(req.body);
    task.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => console.log(err));
});

module.exports = router;
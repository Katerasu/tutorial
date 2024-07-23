//Controller to make code easier to read and maintain
const express = require('express');
const Task = require('../models/model');

//------------------------------------------------------
// To be in this controller file:
// task_index, get all the task and inject them to index view
const task_index = (req, res) => {
    Task.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'Checklist', tasks: result })
    })
    .catch((err) => console.log(err));
};

// task_details, get details of a task and inject them to task details view
const task_details = (req, res) => {
    const id = req.params.taskid;
    Task.findById(id)
        .then((result) => res.render('details', { title: 'Task Details', task: result }))
        .catch((err) => console.log(err));
};

// task_create_get, get request to get the form view
const task_create_get = (req, res) => {
    res.render('create', { title: 'Create' });
};

// task_create_post, post request to add new data to db
const task_create_post = (req, res) => {
    req.body.status = 'Pending';
    console.log(req.body);
    const task = new Task(req.body);
    task.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => console.log(err));
};

// task_delete, to delete task
const task_delete = (req, res) => {
    const id = req.params.taskid;
    Task.findByIdAndDelete(id)
        .then((result) => res.json({ redirect: '/' })) //Cannot do redirect here as this is an AJAX request so need to do redirect from FE
        .catch((err) => console.log(err));
};

const checklist_about = (req, res) => {
    res.render('about', { title: 'About' });
}

module.exports = {
    task_index,
    task_details,
    task_create_get,
    task_create_post,
    task_delete,
    checklist_about
};
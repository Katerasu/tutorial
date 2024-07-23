const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const checklistRoutes = require('./routes/checklistRoutes')
const { render } = require('ejs');
const { appendFile } = require('fs');


//________________Set up______________
//Set up express
const app = express();


//Connect to mongodb
const dbURI = 'mongodb://localhost:27017/node-tut';
mongoose.connect(dbURI)
    .then(() => app.listen(6969))
    .catch((err) => console.log(err));

//Set up view engine (To modify html)
app.set('view engine', 'ejs');
app.set('views', 'html_templates'); //Setting dir for views

// Set up static file serving
app.use(express.static(path.join(__dirname, 'html_templates'))); // For css
app.use(express.static(path.join(__dirname, 'html_templates', 'style'))); //For icon and images


//Listen for request
//app.listen(3000); Move to mongodb connection

//________________ Middleware _____________ 

//Middleware is a kind of function run inbetween server
app.use(morgan('common')); //This middleware is to print out request details
app.use(express.urlencoded({ extended: true })); //This middleware is for post request


//________________ Addtional functions _____________ 
//mongoose and mongo routes
//Create new task
app.get('/create-task', (req, res) => {
    //Create new data
    const task = new Task({
        taskName: 'Set up torque',
        dueDate: '2024-10-24',
        status: 'Pending'
    });
    //Save new data to db
    task.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
})

//Getting all the tasks
app.get('/all-tasks', (req, res) => {
    Task.find()
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
});
//Get specific task
app.get('/get-task', (req, res) => {
    Task.findById('6697e61d029c256419cf53be')
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
});

//________________ Routing _____________ 
//Get request for homepage
app.get('/', (req, res) => {
    res.redirect('/checklist')
});

//Other routes
app.use('/checklist', checklistRoutes);

// //Redirect - FYI only
// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// });

//404 page - If nothing match above then go to this
app.use((req, res) => {
    // res.status(404).sendFile('./html_templates/404.html', {root: __dirname});
    res.status(404).render('404', { title: '404' });
});
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Task = require('./models/model');
const { render } = require('ejs');

//________________Set up______________
//Set up express
const app = express();


//Connect to mongodb
const dbURI = 'mongodb://localhost:27017/node-tut';
mongoose.connect(dbURI)
    .then(() => app.listen(6969))
    .catch((err) => console.log(err));

//Listen for request
//app.listen(3000); Move to mongodb connection

//Middleware is a kind of function run inbetween server
// //This is a middleware to print out request details
// app.use((req, res, next) => {
//     console.log('New request made:');
//     console.log('Host:', req.hostname);
//     console.log('Path:', req.path);
//     console.log('Method:', req.method);
//     console.log('-------------------');
//     next(); //So server can move on else will hang
// }); --> Replaced by morgan
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true })); //This middleware is for post request

//Set up view engine (To modify html)
app.set('view engine', 'ejs');
app.set('views', 'html_templates'); //Setting dir for views

// Set up static file serving
app.use(express.static(path.join(__dirname, 'html_templates'))); // For css
app.use(express.static(path.join(__dirname, 'html_templates', 'style'))); //For icon and images

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

//________________Routing_____________ 
//Get request for homepage
app.get('/', (req, res) => {
    // res.send('<p>home page</p>') //Similar to res.write but auto set header content type
    // res.sendFile('./html_templates/index.html', {root: __dirname})
    //Dummy data
    // const tasks = [
    //     {taskName: 'Task 1', taskGroup: 'Spare Part', dueDate: '20-10-2024', status: 'Pending'},
    //     {taskName: 'Task 2', taskGroup: 'PSI', dueDate: '20-11-2024', status: 'Completed'},
    //     {taskName: 'Task 3', taskGroup: 'Cost', dueDate: '20-08-2024', status: 'Pending'}
    // ];
    // res.render('index', {title: 'Home', tasks});
    res.redirect('/checklist')
});

//Get request for checklist page
app.get('/checklist', (req, res) => {
    Task.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'Checklist', tasks: result })
        })
        .catch((err) => console.log(err));
});

//Get request to task detail
app.get('/checklist/:taskid', (req, res) => {
    const id = req.params.taskid;
    Task.findById(id)
        .then((result) => res.render('details', { title: 'Task Details', task: result }))
        .catch((err) => console.log(err));
});

//Delete request
app.delete('/checklist/:taskid', (req, res) => {
    const id = req.params.taskid;
    Task.findByIdAndDelete(id)
        .then((result) => res.json({ redirect: '/checklist' })) //Cannot do redirect here as this is an AJAX request so need to do redirect from FE
        .catch((err) => console.log(err));
});

//Post request 
app.post('/checklist', (req, res) => {
    req.body.status = 'Pending';
    console.log(req.body);
    const task = new Task(req.body);
    task.save()
        .then((result) => {
            res.redirect('/checklist');
        })
        .catch((err) => console.log(err));
});

//Get request for about page
app.get('/about', (req, res) => {
    // res.send('<p>about page</p>') //Similar to res.write but auto set header content type
    // res.sendFile('./html_templates/about.html', {root: __dirname})
    res.render('about', { title: 'About' });
});

//Get request for create new task page
app.get('/create', (req, res) => {
    res.render('create', { title: 'Create' });
});

// //Redirect - FYI only
// app.get('/about-us', (req, res) => {
//     res.redirect('/about');
// });

//404 page - If nothing match above then go to this
app.use((req, res) => {
    // res.status(404).sendFile('./html_templates/404.html', {root: __dirname});
    res.status(404).render('404', { title: '404' });
});
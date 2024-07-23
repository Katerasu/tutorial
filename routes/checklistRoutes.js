const taskController = require('../controllers/taskController');
const express = require('express');
const router = express.Router();

//________________ Routing _____________ 

//Get request for checklist page
router.get('/', taskController.task_index);

//Get request for about page
router.get('/about', taskController.checklist_about);

//Get request for create new task page
router.get('/create', taskController.task_create_get);

//Get request to task detail
router.get('/:taskid', taskController.task_details);

//Delete request
router.delete('/:taskid', taskController.task_delete);

//Post request 
router.post('/', taskController.task_create_post);

//Export for app.js to use
module.exports = router;
const express = require('express');
var cors = require('cors');
const bodyParser = require("body-parser");

const DAO = require('./dao');

const UserRepository = require('./repo/UserRepository');
const TaskRepository = require('./repo/TaskRepository');
const PhotoRepository = require('./repo/PhotoRepository');

// Server port
const HTTP_PORT = 8000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const dao = new DAO('./db/tbox.sqlite3');
const userRepository = new UserRepository(dao);
const taskRepository = new TaskRepository(dao);
const photoRepository = new PhotoRepository(dao);

userRepository.createTable()
    .then(() => taskRepository.createTable()
    .then(() => photoRepository.createTable()));

// Start server
app.listen(HTTP_PORT, () => {
    console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});

// Root endpoint
app.get('/', (req, res, next) => {
    console.log('/');
    res.json({ 'message': 'Ok' });
});

app.post('/api/user', (req, res, next) => {
    console.log('/api/user');
    var errors = [];

    if (!req.body.username) {
        errors.push('No username specified');
    }
    if (!req.body.email) {
        errors.push('No username specified');
    }
    if (!req.body.password) {
        errors.push('No password specified');
    }
    if (!req.body.picture) {
        req.body.picture = '';
    }

    if (errors.length) {
        console.log(errors.join());
            res.status(400).json({ 'error': errors.join() });
            return;
    }

    userRepository.create(req.body.username, req.body.email, req.body.password, req.body.picture)
        .then((data) => {
            res.json({
                'message': 'success',
                'id': data.id
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
            res.status(400).json({ 'error': err.message })
            return;
        });
});

app.post('/api/task', (req, res, next) => {
    console.log('api/task');
    var errors = [];

    if (!req.body.userId) {
        errors.push('No userId specified');
    }
    if (!req.body.note) {
        errors.push('No note specified');
    }

    if (errors.length) {
        console.log(errors.join());
            res.status(400).json({ 'error': errors.join() });
            return;
    }

    taskRepository.create(req.body.userId, req.body.note)
        .then((data) => {
            res.json({
                'message': 'success',
                'id': data.id
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
            res.status(400).json({ 'error': err.message })
            return;
        });
});

app.post('/api/photo', (req, res, next) => {
    console.log('/api/photo');
    var errors = [];

    if (!req.body.userId) {
        errors.push('No userId specified');
    }
    if (!req.body.photo) {
        errors.push('No photo specified');
    }

    if (errors.length) {
        console.log(errors.join());
        res.status(400).json({ 'error': errors.join() });
        return;
    }

    photoRepository.create(req.body.userId, req.body.photo)
        .then((data) => {
            res.json({
                'message': 'success',
                'id': data.id
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
            res.status(400).json({ 'error': err.message })
            return;
        });
});

app.patch('/api/task/:id', (req, res, next) => {
    console.log('/api/task/:id');
    var errors = [];

    if (!req.params.id) {
        errors.push('No id specified');
    }
    if (!req.body.status) {
        errors.push('No status specified');
    }

    if (errors.length) {
        console.log(errors.join());
        res.status(400).json({ 'error': errors.join() });
        return;
    }

    taskRepository.update(req.params.id, req.body.status)
        .then((data) => {
            res.json({
                'message': 'success',
                'changes': data.changes
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
            res.status(400).json({ 'error': err.message })
            return;
        });
});

app.post('/api/authenticate', (req, res, next) => {
    console.log('/api/authenticate');
    var errors = [];

    if (!req.body.username) {
        errors.push('No username specified');
    }
    if (!req.body.password) {
        errors.push('No password specified');
    }

    if (errors.length) {
        console.log(errors.join());
        res.status(400).json({ 'error': errors.join() });
        return;
    }

    userRepository.getByUsernameAndPassword(req.body.username, req.body.password)
        .then((user) => {
            res.json({
                'message': 'success',
                'user': user
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
            res.status(400).json({ 'error': err.message })
            return;
        });
});

// Default response for any other request
app.use(function(req, res, next){
    res.status(404);
});

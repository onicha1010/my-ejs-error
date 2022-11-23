const e = require('express'); // คืออะไรอ่ะ??
let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

// display new page
router.get('/', (req,res, next) => {
    let sql = 'select * from new_healthcare order by id desc'
    dbCon.query(sql, (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('new', { data: '' });
        } else {
            res.render('new', { data: rows });
        }
    })
})

// display add new page
router.get('/add', (req, res, next) => {
    res.render('new/add', {
        name: '',
        author: '',
        details: ''
    })
})


//add a new New
router.post('/add', (req, res, next) => {
    let name = req.body.name;
    let author = req.body.author;
    let details = req.body.datails;
    console.log(details);
    let errors = false;

    if (name.length === 0 || author.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', 'Please enter name, author and details');
        // render to add.ejs with flash message
        res.render('new/add', {
            name: name,
            author: author,
            details: details
        })
    }

    // if no error // สร้าง obj และเก็บข้อมูลเป็น obj
    if (!errors) {
        let form_data = {
            name: name,
            author: author,
            details: details
        }

        // console.log(form_data.details);
        // console.log(form_data.name);
        // console.log(form_data.author);

        // insert query
        dbCon.query('INSERT INTO new_healthcare SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err)

                res.render('new/add', {
                    name: form_data.name,
                    author: form_data.author,
                    details: form_data.details
                })
            } else {
                req.flash('success', 'News successfully added');
                res.redirect('/new');
            }
        })
    }
})


// display edit new page
router.get('/edit/(:id)', (req, res, next) => {
    let id = req.params.id;
    let sql2 = 'select * from new_healthcare where id = ' + id
    dbCon.query(sql2, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'New not found with id = ' + id);
            res.redirect('/new');
        } else {
            res.render('new/edit', {
                title: 'Edit New',
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author,
                details: rows[0].details,
            })
        }
    })
})

// delete book 
router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    dbCon.query('delete from new_healthcare where id = ' + id, (err, result) => {
        if (err) {
            req.flash('error', err),
            res.redirect('/new');
        } else {
            req.flash('success', 'New successfully deleted! ID = ' + id);
            res.redirect('/new');
        }
    })
})


module.exports = router;
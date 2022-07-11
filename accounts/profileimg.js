var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var multer = require('multer');
var fs = require('fs');
var path = require('path');
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(443,()=>console.log('server listening at 443'));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "ACCOUNTS",
    password: "ququdas0327"
});

fs.readdir('uploads',(error)=>{
    if(error){
        fs.mkdirSync('uploads');
    }
})

var upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})

app.post('/upload',upload.single('image'),function (req,res){
    var profile_img = req.profile_img;
    var userid = req.userid;
    var apiType = req.apiType;
    var sql = 'UPDATE Users SET profile_img = ? WHERE userid = ? and Api_Type = ? ';
    var params = [profile_img,userid,apiType];
    connection.query(sql,params,function(err,result){
        if (err) {
            console.log(err);
        } else {
            resultcode = 200;
        }
        res.json({
            'code': resultCode,
            'url' : `/${req.file.filename}`});
    });
});

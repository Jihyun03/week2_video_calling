var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(443,()=>console.log('server listening at 443'));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "ACCOUNTS",
    password: "ququdas0327"
});


app.post('/user/join', function (req, res) {
    console.log(req.body);
    var userID = req.body.userid;
    var nickname = req.body.nickname;
    var userPwd = req.body.userPwd;
    var userName = req.body.username;
    var apiType = req.body.apiType;
    var apiToken = req.body.apiToken;

    // 삽입을 수행하는 sql문.
    var sql = 'INSERT INTO Users (serialnum, userid, nickname, password, username, profile_img, Api_Type, Api_Token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var checkID = 'SELECT * FROM Users WHERE userid = ?';
    var checkNICK = 'SELECT * FROM Users WHERE nickname = ?';
    var params = [null, userID, nickname, userPwd, userName, null, apiType, apiToken];
    var resultCode = 404;
    var message = '에러가 발생했습니다';

    connection.query(checkID,userID,function (err1, result1){
        if(err1){
            console.log(err1)
        } else if(result1.length!=0){
            resultCode = 505;
            message = '중복되어 사용할 수 없는 ID입니다.';
            res.json({
                'code': resultCode,
                'message': message
            });
        } else {
            connection.query(checkNICK,nickname,function (err2, result2){
                if(err2){
                    console.log(err2)
                } else if(result2.length!=0){
                    resultCode = 606;
                    message = '중복되어 사용할 수 없는 닉네임입니다.';
                    res.json({
                        'code': resultCode,
                        'message': message
                    });
                } else {
                    connection.query(sql, params, function (err3, result3) {
                        console.log('join attempt');
                        if (err3) {
                            console.log(err3);
                        } else {
                            console.log('join success');
                            resultCode = 200;
                            message = '회원가입에 성공했습니다.';
                            res.json({
                                'code': resultCode,
                                'message': message
                            });
                        }
                    });
                }
            })
        }
    });

});

app.post('/user/login', function (req, res) {
    var userid = req.body.userid;
    var userPwd = req.body.userPwd;
    var nickname = req.body.nickname;
    var apiType = req.body.apiType;
    var apiToken = req.body.apiToken;

    var sql = 'select * from Users where userid = ?';
    var checkFirst = 'select * from Users where userid = ? and Api_Type = ?'
    var params1 = [userid,apiType];
    var insertFirst = 'INSERT INTO Users (serialnum, userid, nickname, password, username, profile_img, Api_Type, Api_Token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var params2 = [null,userid,nickname,null,null,null,apiType,apiToken];

    if(apiType == "BLOOM"){
        connection.query(sql, userid, function (err, result) {
            var resultCode = 404;
            var message = '에러가 발생했습니다';
    
            if (err) {
                console.log(err);
            } else {
                if (result.length === 0) {
                    resultCode = 204;
                    message = '존재하지 않는 계정입니다!';
                } else if (userPwd !== result[0].password) {
                    resultCode = 204;
                    message = '비밀번호가 틀렸습니다!';
                } else {
                    resultCode = 200;
                    message = '로그인 성공! ' + result[0].nickname + '님 환영합니다!';
                }
            }
    
            res.json({
                'code': resultCode,
                'message': message
            });
        });
    }
    else{
        connection.query(checkFirst,params1,function(err1,result1){
            var resultCode = 404;
            var message = '에러가 발생했습니다';
            if (err1) {
                console.log(err1);
            } else {
                if (result1.length === 0) {
                    resultCode = 327;
                    connection.query(insertFirst,params2,function(err2,result2){
                        if (err2) {
                            console.log(err2);
                        } else {
                            message = '로그인 성공! ' + result2[0].nickname + '님 환영합니다!';
                        }
                    });
                }
                else {
                    message = '로그인 성공! ' + result1[0].nickname + '님 환영합니다!';
                }

            }
            res.json({
                'code': resultCode,
                'message': message
            });
        });
    }

});

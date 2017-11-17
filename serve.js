const app = require('express')()
const fs = require('fs')
const request = require('request');
const superagent = require('superagent');
const bodyParser = require('body-parser');
let myurl = "https://test.007vin.com"
// let myurl = "http://192.168.10.111"
let mycookie = ""
// 模拟登陆获取cookie
let url = myurl + "/login?username=15727575790&password=111111"
superagent.post(url)
.set('Content-Type', 'application/json;charset=UTF-8')
.set('Cookie', "")
.end(function(err, response) {
    if (err || !response.ok) {
        console.log(err)
    } else {
        let cookie = response.header['set-cookie']             //从response中得到cookie
        if(cookie){
            mycookie = cookie.toString().replace(/Path=\/,/g,"")
        }
    }
})



app.get('*', (req, res) => {
    if (req.url.indexOf(".") == -1) {
        let url = myurl + req.url;
        superagent.get(url)
            // 设置些需要的头
            .set('Content-Type', 'application/json;charset=UTF-8')
            // set cookie字段
            .set('Cookie', mycookie)
            .end(function(err, response) {
                if (err || !response.ok) {
                    res.send(err);
                } else {
                    //接口返回转发数据，可以在这里处理之后拼装数据
                    res.set('Content-Type', 'application/json');
                    res.send(JSON.stringify(response.body));
                }
            })
    } else {
        let _path = req.path
        if (_path.includes('.html')) {
            // let regHost1 = /http:\/\/192.168.10.111\//g
            let regHost2 = /https:\/\/cdns.007vin.com\//g
            fs.readFile(__dirname + _path, (err, data) => {
                // data = data.toString().replace(regHost1, '')
                data = data.toString().replace(regHost2, '')
                res.send(data)
            })
        } else if (_path.includes('jquery.min.map'));
        else res.sendFile(`${__dirname + req.path}`)
    }
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("*", (req, res) => {
    let url = myurl + req.url;   
    console.log(req.body);
    superagent.post(url)
        // 设置些需要的头
        .set('Content-Type', 'application/json;charset=UTF-8')
        // set cookie字段
        .set('Cookie', mycookie)
        .type('form')
        .send(req.body)
        .end(function(err, response) {
            if (err || !response.ok) {
                res.send(err);
            } else {
                //接口返回转发数据，可以在这里处理之后拼装数据
                res.set('Content-Type', 'application/json');
                // res.set("")
                res.send(JSON.stringify(response.body));
            }
        })
})

const host = '127.0.0.1'
app.listen(8084, host, () => {
    console.log(`start ${host} 8084`)
})

const app = require('express')()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('*', (req, res) => {
    res.sendFile(__dirname + req.path)
})

app.listen(8888, 'localhost', err => {
    if(err) console.log(err)
    else console.log('local server in 127.0.0.1:8888')
})

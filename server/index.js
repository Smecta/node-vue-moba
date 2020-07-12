const express = require("express");
// 引入 express



// 定义app 是express实例
const app = express()

// 引用跨域模式，加括号是为了使用它
app.use(require('cors')())
// 加入中间件 express.json() 
app.use(express.json())

// 托管静态文件夹 让我们uploads下所有文件，可以通过/uploads 文件夹来访问
app.use('/uploads', express.static(__dirname + '/uploads'))


// 引用过来是个函数，使用同样的方式使用
require('./plugins/db')(app)
// 引用过来是个函数，执行函数同时传入app 这样admin里面就可使用app
require('./routes/admin')(app)


// app.listen 启动 3000端口，同时传入一个回调函数。表示启动之后让它做什么
 app.listen(3000, () => {
    console.log('http://localhost:3000')
 });
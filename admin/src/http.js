import axios from 'axios'
import Vue from 'vue'
import router from './router/router'

const http = axios.create({
    baseURL:'http://localhost:3000/admin/api'
})
// 请求 拦截器
http.interceptors.request.use(function (config) {
    // Do something before request is sent
    if(localStorage.token){
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 

// 捕获错误使用全局捕获，给http请求加个拦截器
// axios 响应的全局拦截器 use后面是函数 第一个参数是 接收的一个响应 第二个是err函数
http.interceptors.response.use(res => {
    return res
}, err =>{
    // 客户端监听错误 引入 vue
    if(err.response.data.message){ 
        // 使用vue的prototype的$message 弹出错误
        // $message 是 elment ui 的一个方法
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })

        if(err.response.status=== 401){
            router.push('/login')
        }
    }
    
    return Promise.reject(err)
})

export default http

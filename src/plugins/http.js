
import axios from 'axios'
import {
  Message
} from "element-ui"

const Http = {}
Http.install = function (Vue, options) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  Vue.prototype.$http = axios

  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.url !== "login") {
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers.Authorization = AUTH_TOKEN;
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    console.log("拦截器-----");
    console.log(response);
    
    // 对响应数据做点什么
    const {
      meta: {
          msg,
          status
      }
  } = response.data;
  // 统一处理所有非200和201的响应->提示框->之前所有请求中的else都不用写了
  if (status !== 200 && status !== 201) {
      // 提示
      Message.warning(msg);
  }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
 
}
export default Http

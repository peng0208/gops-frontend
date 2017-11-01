import axios from 'axios'
import cookies from './cookies'

axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response && response.status == 401) {
    location.replace('/login')
    return false
  }
  else if (response && response.data) {
    return response.data
  }
  else {
    return {
      "code": -1,
      "message": "服务器内部异常",
      "data": null
    }
  }

}, error => {
  return {
    "code": -2,
    "data": "",
    "message": "网络异常"
  }
  // return Promise.resolve(error.response)
})

function getTokenCookie(c) {
  var t = cookies.get(c)
  return "Bearer " + t
}

function genUrl(url) {
  if (process.env.NODE_ENV == 'development') {
    return process.env.API_ROOT + url
  }
  return url
}

export default {
  post(url, data) {
    return axios({
      method: 'post',
      url: genUrl(url),
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': getTokenCookie('_token')
      }
    })
  },
  get(url) {
    return axios({
      method: 'get',
      url: genUrl(url),
      timeout: 10000,
      headers: {
        'Authorization': getTokenCookie('_token')
      }
    })
  },
  put(url, data) {
    return axios({
      method: 'put',
      url: genUrl(url),
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': getTokenCookie('_token')
      }
    })
  },
  delete(url, data) {
    return axios({
      method: 'delete',
      url: genUrl(url),
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': getTokenCookie('_token')
      }
    })
  },
  patch(url, data) {
    return axios({
      method: 'patch',
      url: genUrl(url),
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': getTokenCookie('_token')
      }
    })
  }
}

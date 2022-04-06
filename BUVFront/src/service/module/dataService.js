import axios from 'axios'

const TEST_URL_PREFIX = '/api/test';


// new

export function fetchRouteData(param, callback) {
  const url=`${TEST_URL_PREFIX}/fetchRoute/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function fetchAll(param, callback) {
  const url=`${TEST_URL_PREFIX}/fetchAll/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function fetchAllData(param, callback) {
  const url=`${TEST_URL_PREFIX}/fetchAllData/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function calIOU(param, callback) {
  const url=`${TEST_URL_PREFIX}/calIOU/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}
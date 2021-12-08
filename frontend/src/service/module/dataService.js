import axios from 'axios'

const TEST_URL_PREFIX = '/api/test';

export function updateCounter(param, callback) {
  const url=`${TEST_URL_PREFIX}/counter/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}


export function fetchData(param, callback) {
  const url=`${TEST_URL_PREFIX}/fetchData/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}
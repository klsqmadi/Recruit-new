import {
    D_config,
} from './config.js'
import axios from './axios'
import qs from 'qs'

const D_REQUEST = {}

D_REQUEST.GET_byDirectionAndStageGetUser = function (data) {
    console.log(qs.stringify(data),111111);
    return axios({
        method: 'POST',
        url: D_config.API_GET_byDirectionAndStageGetUser,
        data:qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

D_REQUEST.PUT_updateStage = function(data){
    return axios({
        method: 'POST',
        url: D_config.API_PUT_updateStage,
        data:data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export {
    D_REQUEST
}

D_REQUEST.GET_selectAppointTime = function(){
    return axios({
        method:'POST',
        url:D_config.API_GET_selectAppointTime,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

D_REQUEST.PUT_deleteAppointTime = function(timeId){
    return axios({
        method:'POST',
        url:D_config.API_PUT_deleteAppointTime,
        data:qs.stringify({timeId}),
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

D_REQUEST.PUT_insertAppointTime = function(data){
    return axios({
        method:'POST',
        url:D_config.API_PUT_insertAppointTime,
        data:data,
        headers:{
            'Content-Type':'application/json'
        }
    })
}

D_REQUEST.GET_detailUser = function(userId){
    return axios({
        method:'POST',
        url:D_config.API_GET_detailUser,
        data:qs.stringify({
            userId
        }),
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

D_REQUEST.PUT_sendMessage = function(){
    
}``
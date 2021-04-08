const BASE_URL = 'https:/www.lizeqiang.top:8083/'
// const BASE_URL = 'https:/192.168.1.105:8083/'

const D_config = {}

D_config.API_GET_byDirectionAndStageGetUser = '/manager/selectUserSchedule'
D_config.API_PUT_updateStage = '/manager/updateStage'
D_config.API_GET_selectAppointTime = '/manager/selectAppointTime'
D_config.API_PUT_deleteAppointTime = '/manager/deleteAppointTime'
D_config.API_PUT_insertAppointTime = '/manager/insertAppointTime'
D_config.API_GET_detailUser = '/manager/selectUserInfoById'
D_config.API_PUT_sendMessage = '/manager/uploadNotice'
export {
    BASE_URL,
    D_config
}
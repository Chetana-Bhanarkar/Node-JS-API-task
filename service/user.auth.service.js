const user = require('../controller/user.auth.controller');

const registerService = async(first_name, last_name, username, password , email, phone,created,updated) => {
    return await user.registerUser(first_name, last_name, username, password , email, phone,created,updated)
}

const existsUserService = async(email,username)=>{
    return await user.existsUser(email,username) ; 
} 

const loginService = async(email,password) => {
    return await user.login(email,password) ; 
}

const getEmailService = async(email) => {
    return await user.getEmail(email) ; 
}

const setPasswordService = async(new_password,token) => {
    return await user.setPassword(new_password,token) ; 
}

const getPasswordService = async(email) => {
    return await user.getPassword(email) ; 
}

const changePasswordService = async(new_password,id) => {
    return await user.changePassword(new_password,id) ; 
}

const existsUserByIdService = async(id) => {
    return await user.existUserByID(id) ; 
}

const updateProfileService = async(id,first_name, last_name, username, password , email, phone, created, updated) => {
    return await user.updateProfile(id,first_name, last_name, username, password , email, phone, created, updated)
}

module.exports = {
    registerService,
    existsUserService,
    loginService,
    getEmailService,
    setPasswordService,
    getPasswordService,
    changePasswordService,
    existsUserByIdService,
    updateProfileService
}
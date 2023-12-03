const {Pool} = require('pg');
const db = require('../config/db.config') ; 

const conn = async(req,res) => {
    const pool = new Pool(db.config) ; 
    const result = await pool.query(sql,(err,res)=>{
        if(err){
            throw err ; 
        }
        return result ; 
    })
}


const createtable = async() => {
    const pool = new Pool(db.config);

    const qr = `CREATE TABLE IF NOT EXISTS public.user(
        id bigint NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 999999999 CACHE 1),
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) UNIQUE ,
        email VARCHAR(50) UNIQUE,
        phone VARCHAR(10) UNIQUE,
        created TIMESTAMP DEFAULT NULL,
        updated TIMESTAMP DEFAULT NULL,
        PRIMARY KEY(id)
    )`;

    const result = await pool.query(qr) ; 
    pool.end() ; 
    return result
}

createtable()



//Exist user 

const existsUser = async(email,username) =>{
    const pool = new Pool(db.config);
    let query=`SELECT * FROM public.user WHERE email='${email}' AND username = '${username}' `;
    const res = await pool.query(query);
    // let isQuery = true;
    let isQuery = (res.rows.length > 0) ? true : false;
    console.log(isQuery)
    pool.end();
    return isQuery;

}

// Create an API to register to user table.

const registerUser = async(first_name, last_name, username, password , email, phone, created, updated) => {
    const pool = new Pool(db.config) ; 
    const qr = `INSERT INTO public.user(first_name, last_name, username, password , email, phone, created, updated) 
                VALUES('${first_name}', '${last_name}', '${username}', '${password}' , '${email}', '${phone}','${created}','${updated}')`

    const result = await pool.query(qr) ; 
    let message = "Data updated" ; 
    if(result.affectedRows){
        message  : message ; 
    }
    pool.end() ; 
    console.log(result);
    return result ; 
}

// get password to compare the encrypt password or user password

const getPassword = async(email) => {
    const pool = new Pool(db.config);

    const qr = `SELECT password FROM public.user WHERE email = '${email}' ` ; 
    const result = await pool.query(qr);
    pool.end();
    console.log(result.rows);
    return result.rows;
    
}


// Create login API

const login = async(email,password) => {
    const pool = new Pool(db.config);
    const qr = `SELECT email,password FROM public.user WHERE email = '${email}' AND password = ${password} LIMIT 1` ; 

    const result = await pool.query(qr);

    if(result.length > 0){
        message : result.rows ; 
    }else{
        message : "No Data"
    }

    pool.end();
    return result.rows ; 
}


// get email 

const getEmail = async(email) => {
    const pool = new Pool(db.config);

    const qr = `SELECT email FROM public.user WHERE email = '${email}' `
    const result = await pool.query(qr);
    pool.end();
    console.log(result.rows);
    return result.rows;

}



// set password 

const setPassword = async(new_password,token) => {
    const pool = new Pool(db.config);

    const qr = `UPDATE public.user SET password = '${new_password}' , reset_token = NULL WHERE reset_token = '${token}'  `
    const result = await pool.query(qr);
    pool.end();
    console.log(result.rows);
    return result.rows;
    
}




// change password

const changePassword = async(new_password,id) => {
    const pool = new Pool(db.config);

    const qr = `UPDATE public.user SET password = '${new_password}' WHERE id = '${id}' `
    const result = await pool.query(qr);
    pool.end();
    console.log(result.rows);
    return result.rows;
    
}

// check id is exist or not to update profile

const existUserByID = async(id) => {
    const pool = new Pool(db.config);

    const qr = `SELECT * FROM public.user WHERE id = '${id}' ` ; 
    const result = await pool.query(qr);
    pool.end();
    console.log(result.rows);
    return result.rows;
    
}
// update profile

const updateProfile = async(id,first_name, last_name, username, password , email, phone, created, updated) => {
    const pool = new Pool(db.config);

    const qr = `UPDATE public.user SET first_name = '${first_name}', last_name = '${last_name}', username = '${username}' , password = '${password}' , email = '${email}' , phone = '${phone}' , created = '${created}' , updated = '${updated}' WHERE id = '${id}';`

    const result = await pool.query(qr) ; 
    pool.end() ; 
    console.log(result.rows);
    return result.rows ; 
}

module.exports = {
    registerUser,
    existsUser,
    getPassword,
    login,
    getEmail,
    setPassword,
    changePassword,
    existUserByID,
    updateProfile
}
const user = require('../service/user.auth.service');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "extremesecret"
const cookieParser = require('cookie-parser');
const randomStr = require('randomstring');
const sendmail = require('../helpers/sendmail');
const salt = 10;
router.use(cookieParser());



// register user

router.post('/register', async (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let created = req.body.created;
    let updated = req.body.updated;


    let pswrd = await bcrypt.hash(password, salt);


    let dbResponse = await user.existsUserService(email, username);

    try {
        if (dbResponse) {
            res.status(409).json({
                status: "Fail",
                message: "This account has already registered"
            })
        } else {
            let message = await user.registerService(first_name, last_name, username, pswrd, email, phone, created, updated);
            res.status(200).json({
                status: "Success",
                message: message
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        })
    }
})


// login api 

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let pswrd = await user.getPasswordService(email);
    let compare_password = await bcrypt.compare(password, pswrd)

    console.log(password, pswrd);
    let dbResponse = await user.loginService(email, compare_password);

    try {
        if (!dbResponse) {
            res.status(409).json({ message: "Error" })
        }
        if (dbResponse.length > 0) {
            const name = dbResponse[0].name;
            const token = jwt.sign({ name }, secretKey, { expiresIn: '1d' })
            res.cookie('token : ', token);
            res.status(200).json(
                {
                    status: "Success",
                    token
                }
            )
        } else {
            res.status(404).json(
                {
                    message: "No account !"
                }
            );
        }
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
})


// Verify user for login  by token

const verifyUser = (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        res.json({ message: "Please provide token to login !" })
    } else {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json(
                    {
                        Message: "Authentication Error "
                    }
                )
            } else {
                req.name = decoded.name;
                next()
            }
        })
    }
}




// route for user-profile after login

router.get('/profile', verifyUser, (req, res) => {
    try {
        res.status(200).json(
            {
                status: "Success", name: req.name
            }
        )

    } catch (error) {
        res.status(409).json(
            {
                status: "Fail",
                message: "error occurred ! "
            }
        )
    }
})


// forget password 

router.post('/forgot-password', async (req, res) => {
    let email = req.body.email;
    let dbResponse = await user.getEmailService(email);

    if (dbResponse) {
        let mailSubject = "Forget password";
        const random = randomStr.generate();
        let content = '<p> Hii ,' + dbResponse[0].name + '\
        please <a href="http://localhost:3000/api/v1/user/reset-password?token='+ random + '"> Click here </a> to Reset your password </p>';

        sendmail(email, mailSubject, content)

        res.status(200).json({ message: "Mail sent successfully" });

    } else {
        res.status(404).json({ message: "user not found" });
    }
})




// reset password 

router.post('/reset-password/:token', async (req, res) => {
    const new_password = req.body.new_password;
    const token = req.params.token

    const hashedPassword = bcrypt.hashSync(new_password, salt);

    const dbResponse = await user.setPasswordService(hashedPassword, token);

    if (dbResponse) {
        if (token) {
            res.status(200).json({ message: "Password reset successfully" })
        } else {
            res.status(400).json({ message: "Bad request" })
        }
    } else {
        res.status(500).json({ message: "Internal server error" });
    }
})



// change-password 


router.post('/:id/change-password', async (req, res) => {
    const id = req.params.id;
    const oldpwd = req.body.oldpassword;
    const newpwd = req.body.newpassword;

    const pwd = await user.getPasswordService(id);

    if (pwd) {
        const dbResponse = await user.changePasswordService(id);
        if (dbResponse) {

            const hashedPassword = dbResponse[0].password;

            bcrypt.compare(oldpwd, hashedPassword, (err, passwordMatch) => {
                if (err) {
                    res.status(500).json({ message: 'Error comparing passwords' });
                } else if (!passwordMatch) {
                    res.status(401).json({ message: 'Old password is incorrect' });
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    const newHashedPassword = bcrypt.hashSync(newpwd, salt);
                    const updatePasswordQuery = user.changePasswordService(newHashedPassword, id);

                    if (err) {
                        res.status(500).json({ status: "fail", message: 'Error updating password' });
                    } else {
                        res.status(200).json({ status: "success", message: 'Password updated successfully', data: updatePasswordQuery });
                    }
                }
            });
        }
    } else if (pwd.length === 0) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.status(500).json({ message: 'Error checking the old password' })
    }
})


// update profile 

router.put('/:id' , async(req,res)=>{
    let id = req.params.id ; 
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.phone;
    let created = req.body.created;
    let updated = req.body.updated;


    let dbResponse = await user.existsUserByIdService(id) ; 

    try {
        if(dbResponse && dbResponse.rows != 0){
            let updateProfile = await user.updateProfileService(first_name,last_name,username,password,email,phone,created,updated)

            res.status(200).json(
                {
                    status : "Success",
                    message : "Profile updated successfully"
                }
            )
        }
        else{
            res.status(409).json(
                {
                    status : "Fail",
                    message : "Something error occurred ! "
                }
            )
        }
    } catch (error) {
        res.status(500).json({
            status : "Fail",
            message : error.message 
        })
    }
})


module.exports = router; 

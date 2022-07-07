import { token } from "morgan";
const bcrypt = require("bcrypt");
const mysql = require('mysql');
require('dotenv').config({path: './src/.env'});

// Connect to the database
const db = mysql.createPool({
    connectionLimist: 10,
    port: process.env.database_port,
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
});

const register = async (req: any, res: any) => {
    let user_type: string = req.body.user_type;
    let username: string = req.body.username;
    let gender: string = req.body.gender;
    let email: string = req.body.email;
    let name: string = req.body.name;
    let age: number = req.body.age;
    let password: string = await bcrypt.hash(req.body.password, 10);
    let auth_token: string = await bcrypt.genSalt(10);
    let refresh_token: string = await bcrypt.genSalt(10);
    db.query('SELECT username FROM Users', (err: any, result: any ) => {
        if(err) throw err;
        if(result.length == 0) {        
            db.query('INSERT INTO Users (user_type, email, username, pass, name, age, gender) VALUES ("'+user_type+'","'+email+'","'+username+'","'+password+'", "'+name+'", "'+age+'","'+gender+'");', async (auth_err: any) => {
                if (auth_err) throw err;
                db.query('INSERT INTO Authentication (user_id, user_type, access_token, refresh_token) VALUES ("'+result+'","'+email+'","'+auth_token+'","'+refresh_token+'");', (error: any) => {
                    if(error) throw error;
                    res.status(201).send({
                        'response':'Account created successfully',
                        'auth_token': auth_token,
                        'refresh_token': refresh_token
                    });
                });
            });
        } else {
            res.status(406).send({'response':'Sorry, this username already exists. Try a different username.'});
        }
    });
};

const login = async (req: any, res: any, _next: any )=> {
    let username: string = req.query.username;
    db.query('SELECT username, password FROM Users where username="'+username+'");', (err: any, result: any ) => {
        if(err) throw err;
        if (result.length == 1) {
            let password: string = req.query.password;
            db.query('SELECT password FROM Users where username="'+username+'");', async (err: string, result: string) => {
                if (err) throw err;
                if(await bcrypt.compare(password, result)){
                    db.query('SELECT access_token from Authentication where user_id=(SELECT user_id FROM Users WHERE username="'+username+'")'), async (error: any, rows: any) => {
                        if(error) throw error;
                        res.status(200).send({
                            'response':'Login Successful!',
                            'token':rows[0]
                        });
                    };
                }
                else{
                    res.status(401).send({
                        'response':'Cannot log in',
                    });
                }
            });
        } else {
            res.status(406).send({'response':'This user does not exist. Please try a different username.'});
        }
    });
}

// Admin, Doctor, Patient
const getDoctors = async (_req: any, res: { send: (arg0: any) => void; }, _next: any)=> {
    db.query('select * from Doctors', (err: any, rows: any, _fields: any) => {
        if(err) throw err;
        res.send(rows);
    });
}//Get list of doctors


const getDoctor = async (req: any,res: { send: (arg0: any) => void; }, _next: any)=> { //TODO: Check authorization and if type of user to restrict access to patient names;
    
    let id:number = req.params.doctorId;
    db.query('SELECT * FROM Doctors where id='+id, (err: Error, rows: any, _fields: any) => {
        if(err) throw err;
        console.log(rows);
        res.send(rows);
    });
};//Get doctor schedule and availabilities

// Admin, Doctor
const cancelSession = async (req: { params: { sessionId: any; }; }, res: { render: (arg0: string, arg1: { completed: boolean; }) => void; }, next: any)=> {
    let id = req.params.sessionId;
    db.query('DELETE FROM Sessions WHERE id='+id, (err: any, rows: any) => {
        if(err)
            res.render('cancellation', {'completed': false});
        else
            res.render('cancellation_successful', {'completed': true});
    });

}//Cancel appointment


// Patient
const reserveSession = async (req: any,res: { send: (arg0: any) => void; }, _next: any)=> {
    let start: string = new Date(req.query.start).toISOString().slice(0, 19).replace('T', ' ');
    let end:string = new Date(req.query.end).toISOString().slice(0, 19).replace('T', ' ');
    db.query('INSERT INTO sessions (start, end) VALUES ('+start+', '+end+')', (err: Error, _rows: any, _fields: any) => {
        if(err) throw err;
        console.log("session has been reserved at "+start+" - "+end);
        res.send("Session has bee reserved successfully");
    });
}// Make reservation and choose duration

export default { getDoctors, getDoctor, reserveSession, cancelSession , register, login};
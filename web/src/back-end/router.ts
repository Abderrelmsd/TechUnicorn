/** source/routes/posts.ts */
import express from 'express';
import controller from './logic';
const router = express.Router();

router.post('/account/register', controller.register);

router.post('/account/login', controller.login);

// Admin, Doctor, Patient
router.get('/doctors', controller.getDoctors); //Get list of doctors

router.get('/doctors/:doctorId', controller.getDoctor);//Get doctor schedule and availabilities

// Admin, Doctor
router.delete('/doctors/:doctorId', controller.cancelSession); //Cancel appointment


// Patient
router.post('/doctors/:doctorId', controller.reserveSession); // Make reservation and choose duration

router.use((_req,res,_next) => {
    let error: Error = new Error('Error 404: Not found!');
    res.status(404).send("<center><h1>"+error.message+"</h1></center>");
});

export = router;
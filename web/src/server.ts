import express from 'express';
import morgan from 'morgan';
import routes from './back-end/router';

require('dotenv').config('./src/.env');
const app = express();
const port = process.env.server_port;

app.use(morgan('dev'));
app.use(express.json());
app.set('view engine','ejs');
app.set('views', __dirname+"/front-end/views");
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+"/front-end/resources"));

// Setting routes
app.use('/', routes);

// API Logic
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({}); 
    }
    next();
});

// Setting up server
app.listen(port, ()=> {
    console.log(`Server running at http://localhost:${port}`);
});
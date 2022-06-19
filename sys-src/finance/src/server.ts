import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/post';


const router = express();

router.use(morgan('dev'));

// router.use(cors());
// app.options('*', cors());

// parse the request
router.use(express.urlencoded({ extended: false }));
// take care of json data
router.use(express.json());
// API Rules
router.use((req, res, next) => {
    // set CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set CORS headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/', routes);


/** Error handling */
router.use((req, res, next) => {

    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});


/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
// tslint:disable-next-line:no-console
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

export default router;
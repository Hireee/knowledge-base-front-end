import express from 'express';
import morgan from 'morgan';
import routes from './routes/index';
import passport from 'passport';
import compression from 'compression';
import bodyParser from 'body-parser';
import fs from 'fs';
import http from 'http';
import path from 'path';
import cors from 'cors';
import cron from 'node-cron';
import { initModels } from './service/faceService';



class AppService {

    public dbBootstraped = true;
    public esMigrated = false;
    public app: any;
    public port: any;
    public env: any;
    public server: any;

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.env = process.env.NODE_ENV;
        this.initializeApp();
        this.initCronJobs();
    }

    public initializeApp() {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: "50mb" }));
        // this.app.use('/api/v1', routes);
        this.app.use("/", routes);
        this.app.use(morgan('dev'));
        this.app.use('/public', express.static('/public'))
        this.app.use('/files', express.static(path.join(__dirname, '../files')));
        this.app.use(passport.initialize());
        console.log(1138 * 100);
        // Not found api
        this.app.use('/uploads', express.static('public/bank/cheque_leaf'));
        this.app.use('*', (req: any, res: any) => {
            return res.status(404).json({
                message: 'Route not found'
            })
        });

        initModels ();
    }


    public async initDB() {
        try {
                // await MVisitStatus.sync({alter:true});
                // await MVisitType.sync({alter:true});
                // await MLocation.sync({alter:true});
                // await MCustomerDetails.sync({alter:true});
                // await MCustomerVisit.sync({alter:true});
                // await MAttendance.sync({force:true})

        } catch (e: any) {
            console.log({
                message: e.message,
                stack: e.stack,
            })
            console.log('Error bootstraping the database.');
            this.app.set('HEALTH_STATUS', 'DB_MIGRATION_FAILED');
            return Promise.reject(e);
        }
    }



    public async initCronJobs() {
        try {


            const cronJob = cron.schedule('0 0 * * *', async function () {

                console.log('Process running once in a day at 12 AM');
            });
            cronJob.start();
        }
        catch (e: any) {
            console.log({
                message: e.message,
            })
        }
    }

    public init() {
        console.log('Initializing backend-app');
        const {
            PORT,
            NODE_ENV,
        } = process.env;

        // ENV Argument Checks
        if (!PORT || !NODE_ENV) {
            const msg =
                'Configuration Error: you must specify these ENV variables: PORT, NODE_ENV';
            console.log(msg);
            throw new Error(msg);
        }

        this.port = PORT;
        this.env = NODE_ENV;
    }

    // eslint-disable-next-line complexity

    public async start() {

        if (this.env == 'local' || this.env == 'dev') {
            const DOCKER_HOST = '0.0.0.0';
            this.server = http.createServer(this.app);

            this.server.listen(this.port, DOCKER_HOST, (err: any) => {
                if (err) {
                    this.app.set('HEALTH_STATUS', 'SERVER_LISTEN_FAILED');
                    throw err;
                }

                console.log(`Server started on http://${DOCKER_HOST}:${this.port}`);
            });
        } else {
            const DOCKER_HOST = '10.238.150.53';
            let $certificates: any = {
                "key": fs.readFileSync('/home/tvs.appuser/key/tvs_in_private.key'),
                "cert": fs.readFileSync('/home/tvs.appuser/crt/4f24001bce20cbe0.crt'),
                "ca": fs.readFileSync('/home/tvs.appuser/crt/_.tvs.in.chained+root.crt')
            }


            this.server = http.createServer($certificates, this.app);

            this.server.listen(this.port, DOCKER_HOST, (err: any) => {
                if (err) {
                    this.app.set('HEALTH_STATUS', 'SERVER_LISTEN_FAILED');
                    throw err;
                }

                console.log(`Server started on https://${DOCKER_HOST}:${this.port}`);

            });
        }
        
        await initModels()
        await this.initDB();
        if (!this.dbBootstraped) {
        }

        this.app.set('HEALTH_STATUS', 'READY');
        console.log('Initialization successful. Service is Ready.');
        console.log("Welcome to ")
        
        // Shutdown Hook
        process.on('SIGTERM', () => {
            this.stop();
        });
        process.on('unhandledRejection', (e: any) => {
            console.log({
                message: e.message,
                stack: e.stack,
            })
            console.log('Error due to unhandledRejection.');
        });

        console.log('backend-svc: Server started!');
        return Promise.resolve();
    }

    /**
     * Closes the connection and exits with status code 0 after 3000 ms.
     * Sets HEALTH_STATUS to SHUTTING_DOWN while in progress
     *
     * @memberof Service
     */
    public stop() {
        console.log('Starting graceful shutdown...');
        this.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');

        // LoadingDock.readShutdown();

        setTimeout(() => {
            this.app.close(() => {
                console.log('Shutdown Complete.');
                process.exit(0);
            });
        }, 3000);
    }

    public shouldCompress(req: any, res: any) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
        }
        // fallback to standard filter function
        return compression.filter(req, res);
    }
}

export default AppService;

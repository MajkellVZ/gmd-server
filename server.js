const express = require('express');
const cors = require('cors');
const CronJob = require("cron").CronJob;
const restartCommand = "pm2 restart 0";
const listCommand = "pm2 list";
const { exec } = require('child_process');

const app = express();

app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'));

app.use(cors());

app.use('/api/products', require('./routes/api/products'));
app.use('/api/orders', require('./routes/api/orders'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/media', require('./routes/api/media'));
app.use('/api/filter', require('./routes/api/filter'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('server started ' + PORT));

const restartApp = function () {
    exec(restartCommand, (err, stdout, stderr) => {
        if (!err && !stderr) {
            console.log(new Date(), `App restarted!!!`);
            listApps();
        }
        else if (err || stderr) {
            console.log(new Date(), `Error in executing ${restartCommand}`, err || stderr);
        }
    });
}

function listApps() {
    exec(listCommand, (err, stdout, stderr) => {
        // handle err if you like!
        console.log(`pm2 list`);
        console.log(`${stdout}`);
    });
}

const job = new CronJob('0 */1 * * * *', function() {
    console.log('restarting the gmd-server');
    restartApp();
});

job.start();
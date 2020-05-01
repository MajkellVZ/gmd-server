const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API Running'));

app.use(cors());

const uploads = path.join(__dirname,'/uploads');
app.use(express.static(uploads));

console.log(uploads)

app.use('/api/products', require('./routes/api/products'));
app.use('/api/orders', require('./routes/api/orders'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/media', require('./routes/api/media'));
app.use('/api/filter', require('./routes/api/filter'));

const PORT = 80;

app.listen(PORT, () => console.log('server started ' + PORT));
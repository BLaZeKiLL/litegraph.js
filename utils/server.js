const express = require('express');
const app = express();

app.use('/css', express.static('css'));
app.use('/external', express.static('external'));
app.use('/build', express.static('build'));
app.use('/demo', express.static('demo'));
app.use('/', express.static('demo'));

app.listen(3200, () => console.log('Example app listening on port http://localhost:3200'));

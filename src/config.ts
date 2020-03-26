import * as path from 'path';
const env = require('dotenv').config({path: path.resolve(__dirname, '../.env')}).parsed;

export default env;

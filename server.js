import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './api/index.js';
import cors from 'cors';
import profileRoute from './api/profile.js';
import './newrelic.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // important to parse JSON body

app.use('/api', apiRoutes); // mounts /api/register

app.use('/api/profile', profileRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

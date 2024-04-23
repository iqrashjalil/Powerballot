import dotenv from 'dotenv';
dotenv.config({path: ".env"})
import express from 'express';
import connectDB from './utils/db.js';
const PORT = process.env.PORT || 4000
const app = express();
import cors from 'cors'
import authRoutes from './routes/auth-routes.js'
import candidateRoutes from './routes/candidate-routes.js'
import voteRoutes from './routes/vote-routes.js'
import errorMiddleware from './middlewares/error-middleware.js';
connectDB();


var corsOptions = {
  origin: ['https://main--cheerful-froyo-b7f616.netlify.app', 'https://cheerful-froyo-b7f616.netlify.app'],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true
};

  

  
app.use(cors(corsOptions))
app.use('/uploads', express.static('uploads'));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/vote', voteRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});


app.use(errorMiddleware);

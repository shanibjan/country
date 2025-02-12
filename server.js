import express from 'express';
import cors from 'cors';
import countryRoute from './route/countryRoute.js';

const app = express();

app.use(express.json());

// CORS configuration for requests with credentials
app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches the frontend URL
    credentials: true, // Allows cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"], // Include Set-Cookie
  })
);

// Define API routes first
app.use('/api', countryRoute);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running successfully on ${PORT}`);
});

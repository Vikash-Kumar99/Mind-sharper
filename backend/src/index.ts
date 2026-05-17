import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Import Route Handlers
import exercisesRouter from './routes/exercises';
import habitsRouter from './routes/habits';
import goalsRouter from './routes/goals';
import moodRouter from './routes/mood';
import gamificationRouter from './routes/gamification';
import aiRouter from './routes/ai';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow development queries from frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(express.json());

// Global Server Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mind Shaper Core API',
    uptime: process.uptime()
  });
});

// Setup REST Routing Nodes
app.use('/api/exercises', exercisesRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/mood', moodRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);

// Global 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Exception:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize Listener
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Mind Shaper Server active on port ${PORT}`);
  console.log(`📡 Environment Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

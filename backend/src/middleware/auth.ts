import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or invalid format' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (jwtSecret) {
      // 1. Production Mode: Offline JWT validation using Supabase signing secret
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = {
          id: decoded.sub, // Supabase user ID is stored in 'sub' field
          email: decoded.email,
          role: decoded.role,
        };
        next();
        return;
      } catch (err) {
        // Token verification failed
        res.status(401).json({ error: 'Session expired or invalid token' });
        return;
      }
    } else {
      // 2. Fallback Mode: Direct Supabase Session API check (hits Supabase Auth API)
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        // 3. Local Dev Sandbox Mock Mode: If DB variables are unset, allow developer test access
        if (process.env.NODE_ENV === 'development' || !process.env.SUPABASE_URL) {
          console.log('DEV SANDBOX: Using local mock user context for development');
          req.user = {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'sandbox@mindshaper.dev',
            role: 'authenticated',
          };
          next();
          return;
        }
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      next();
    }
  } catch (err) {
    console.error('Auth Middleware Exception:', err);
    res.status(500).json({ error: 'Internal security authentication error' });
  }
}

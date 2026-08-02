import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_here';

export interface AuthRequest extends Request {
  user?: jwt.JwtPayload & {
    user_id: string;
    user_name: string;
  };
}

/**
 * Middleware to validate JWT token from Authorization header
 * Expects: Authorization: Bearer <token>
 * Attaches user details to req.user
 */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(403).json({
        message: 'Token is required for authentication',
        success: false,
      });
    }

    const userDetails = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      user_id: string;
      user_name: string;
    };

    req.user = userDetails;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: 'Invalid or expired token',
      success: false,
      error: error.message,
    });
  }
};

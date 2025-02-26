import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.js';
import Session from '../models/Session.js';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createHttpError(401, 'Unauthorized'));
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(createHttpError(401, 'Access token expired'));
      }
      return next(createHttpError(401, 'Invalid access token'));
    }

    const session = await Session.findOne({ userId: decoded.userId });
    if (!session) {
      return next(createHttpError(401, 'Session expired. Please log in again.'));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

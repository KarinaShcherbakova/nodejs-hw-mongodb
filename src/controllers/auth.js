import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { generateTokens } from '../services/auth.js';
import { sendEmail } from "../services/emailService.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid email or password');
    }

    await Session.deleteMany({ userId: user._id });

    const tokens = generateTokens(user._id);

    await Session.create({ ...tokens, userId: user._id });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(403, 'Invalid refresh token');
    }

    const session = await Session.findOne({ userId: decoded.userId, refreshToken });
    if (!session) {
      throw createHttpError(403, 'Session not found');
    }

    await Session.deleteOne({ _id: session._id });

    const tokens = generateTokens(decoded.userId);
    await Session.create({ ...tokens, userId: decoded.userId });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createHttpError(401, "Refresh token is missing");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(403, "Invalid refresh token");
  }

  await Session.deleteMany({ userId: decoded.userId });

  res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

  res.status(204).send();
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw createHttpError(400, "Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createHttpError(400, "Invalid email format.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Reset your password",
      `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
    );

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      throw createHttpError(400, 'Token and password are required');
    }

    if (password.length < 8) {
      throw createHttpError(400, 'Password must be at least 8 characters long.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createHttpError(401, err.name === 'TokenExpiredError' ? 'Token has expired.' : 'Invalid token.');
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    user.password = password;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

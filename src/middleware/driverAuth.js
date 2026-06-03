import jwt from 'jsonwebtoken';

export function driverAuthMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.driverId = decoded.driverId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

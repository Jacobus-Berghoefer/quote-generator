import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

// Define interface for JWT payload
interface JwtPayload {
  data: {
    username: string;
    email: string;
    _id: string | unknown;
  };
}

export const authenticateToken = ({ req }: any) => {
  // lets the token be sent in the request body, query or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // extract the token from the header
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // if no token then return request object
  if (!token) {
    return req;
  }

  const secretKey = process.env.JWT_SECRET_KEY || "WhimmyWhamWhamWozzle";
  if (!secretKey) {
    console.error('WARNING: JWT_SECRET_KEY environment variable not set!');
    return req;
  }

  // Try to verify the token
  try {
    const { data } = jwt.verify(token, secretKey, { maxAge: '24h' }) as JwtPayload;
    // when the token is valid we set the user to be the user in the payload
    req.user = data;
  } catch (err) {
    // If token is not valid, log an error
    console.log('Invalid token');
  }

  // Return the request object
  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  // Create a payload with the user information
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || "WhimmyWhamWhamWozzle"; 
  
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }

  // Sign the token with the payload and secret key
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '24h' });
};

// Custom error class for authentication errors
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 }
      }
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
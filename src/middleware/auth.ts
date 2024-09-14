import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}
// when it add middleware in router , it chexks the bearer token (autherisation header)
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});


export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  // Bearer lshdflshdjkhvjkshdjkvh34h5k3h54jkh
  const token = authorization.split(" ")[1];
// JWT give tools for parse and decode the access token
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;  // sub is convection that hold the authid

    const user = await User.findOne({ auth0Id }); // find useer on the basis of authid

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString(); // user_id stored for database
    next();   
  } catch (error) {
    return res.sendStatus(401);
  }
};
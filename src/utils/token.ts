import { createSecretKey } from "crypto";
import * as jose from "jose";

interface JWTPayload extends jose.JWTPayload {
  readonly uid: string;
}

const secretKey = createSecretKey(
  new TextEncoder().encode(process.env.JWT_SECRET)
);

export const createJWTToken = async (payload: JWTPayload) => {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: process.env.JWT_ALGORITHM ?? "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
  return token;
};

export const verifyJWTToken = async (token: string) => {
  const { payload } = (await jose.jwtVerify(token, secretKey)) as {
    payload: JWTPayload;
  };
  return payload;
};

export const decodeJWTToken = (token: string) => {
  const decoded = jose.decodeJwt(token);
  return decoded as { uid: string };
};

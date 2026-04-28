import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-biru-monokrom-2026'),
};

export const signJwt = async (payload: JWTPayload, expiresIn = '24h') => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(jwtConfig.secret);
};

export const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, jwtConfig.secret);
    return payload;
  } catch (error) {
    return null;
  }
};

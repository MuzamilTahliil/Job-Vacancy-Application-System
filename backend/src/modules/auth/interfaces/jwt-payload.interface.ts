export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  name?: string;
  iat?: number;
  exp?: number;
}

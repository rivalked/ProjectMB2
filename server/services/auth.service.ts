import { storage } from "../storage";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, isRefreshJtiValid, rotateRefreshToken } from "../auth";

class AuthService {
  async login(email: string, passwordPlain: string) {
    const user = await storage.getUserByEmail(email);
    if (!user || !bcrypt.compareSync(passwordPlain, user.password)) {
      return null;
    }
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
    const { token: refreshToken, jti } = generateRefreshToken({ id: user.id, email: user.email, role: user.role, tenantId: user.tenantId });
    return { accessToken, refreshToken, user };
  }

  async refresh(token: string) {
    const payload = verifyRefreshToken(token);
    if (!payload?.id || !(await isRefreshJtiValid(payload.jti))) {
      return null;
    }
    const { token: newRefresh } = rotateRefreshToken(payload.jti, { id: payload.id, email: payload.email, role: payload.role, tenantId: payload.tenantId });
    const accessToken = generateAccessToken({ id: payload.id, email: payload.email, role: payload.role, tenantId: payload.tenantId });
    return { newRefresh, accessToken, payload };
  }

  async logout(token: string) {
    try {
      if (token) {
        const payload = verifyRefreshToken(token);
        if (payload?.jti) {
          import("../auth").then(m => m.revokeRefreshToken(payload.jti));
        }
      }
    } catch {}
  }
  
  async getMe(id: string) {
    return storage.getUser(id);
  }
}

export const authService = new AuthService();

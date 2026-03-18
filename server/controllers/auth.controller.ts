import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { loginSchema } from "@shared/schema";
import { respondZodError } from "../routes";
import { setRefreshCookie, readRefreshCookie, clearRefreshCookie, getAccessTokenTtlSeconds } from "../auth";

class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await authService.login(email, password);
      
      if (!result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      setRefreshCookie(res, result.refreshToken);

      res.json({
        token: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          tenantId: result.user.tenantId,
        },
        expiresIn: getAccessTokenTtlSeconds(),
      });
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const token = readRefreshCookie(req);
      if (!token) {
        // "Тихий" контроль токена: статус 200, чтобы браузер не ругался на 401
        return res.status(200).json({ ok: false, token: null, message: "No refresh token" });
      }

      const result = await authService.refresh(token);
      if (!result) {
        return res.status(200).json({ ok: false, token: null, message: "Invalid refresh token" });
      }

      setRefreshCookie(res, result.newRefresh);
      return res.json({ token: result.accessToken, expiresIn: getAccessTokenTtlSeconds() });
    } catch (e) {
      return res.status(200).json({ ok: false, token: null, message: "Invalid refresh token" });
    }
  };

  logout = async (req: Request, res: Response) => {
    const token = readRefreshCookie(req);
    if (token) {
      await authService.logout(token);
    }
    clearRefreshCookie(res);
    return res.status(204).send();
  };

  me = async (req: Request | any, res: Response) => {
    const user = await authService.getMe(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId
    });
  };
}

export const authController = new AuthController();

// api/src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "tax-tech-icms-super-secret-key-2026";

// Estendendo a tipagem do Express para aceitar os dados do usuário
export interface AuthRequest extends Request {
    usuario?: { id: string; empresa_id: string };
}

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // O header vem como "Bearer <token>"
    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; empresa_id: string };

        // Injeta os dados do usuário e da empresa na requisição
        req.usuario = decoded;

        return next(); // Libera a passagem para a rota
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}
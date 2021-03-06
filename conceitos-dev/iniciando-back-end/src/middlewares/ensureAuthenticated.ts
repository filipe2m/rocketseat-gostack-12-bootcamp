import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import AppError from '../errors/AppError'

import authConfig from '../config/auth'

interface TokenPayload {
    iat: number
    exp: number
    sub: string
}

export default function ensureAuthtenticated(request: Request, response: Response, next: NextFunction): void {
    // Validaçao do Token JWT
    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401)
    }

    // Token compositon:
    // Bearer TOKENSTRING

    // só necessito da segundo valor do array
    const [, token] = authHeader.split(' ')

    try {
        const decoded = verify(token, authConfig.jwt.secret)

        const { sub } = decoded as TokenPayload

        request.user = {
            id: sub
        }

        return next()
    } catch {
        throw new AppError('Invalid JWT token', 401)
    }
}
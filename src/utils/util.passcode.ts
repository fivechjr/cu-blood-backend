import { Request, Response, NextFunction } from 'express'

export function verifyPasscode (passcode, req: Request, res: Response) : boolean {
    if (req.body.passcode) {
        return req.body.passcode == passcode
    }
    return false
}
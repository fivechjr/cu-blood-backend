import { Request, Response } from 'express'

export function verifyPasscode (passcode, req: Request, res: Response) : boolean {
    // console.log('[*] req.body', req.body)
    // console.log('[*] passcode', passcode)
    if (req.body.passcode) {
        // console.log('[*] req.body.passcode', req.body.passcode)
        // console.log('[*] passcode', passcode)
        return req.body.passcode === passcode
    }
    return false
}
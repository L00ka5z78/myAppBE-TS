import * as jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import * as express from "express";


export const authorize = async  (req: Request | any, res: Response, next: (err?: Error) => void)  => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Not authorized!'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');

        // req.user = decoded.user;    //  Property 'user' does not exist on type 'string | JwtPayload'.Property 'user' does not exist on type 'string'
        next();
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({error: 'Internal server error'});
    }
};

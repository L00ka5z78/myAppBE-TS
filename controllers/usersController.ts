import {User, UserDocument} from "../models/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import {Todo} from "../models/Todo";
import * as express from "express";
import {Request, Response} from "express";
import {UserEntity} from "../types";

export const register = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    const {name, email, password, age} = req.body

    try {
        let user = await User.findOne({email});
        if (user) {
            return res
                .status(400)
                .json({message: "User already exists..."})
        }
        // hash the password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user and insert in database

        user = new User({
            name, email, age, password: hashedPassword,
        })
        await user.save();

        const payload = {
            user: user._id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {expiresIn: 360000})
        res.cookie("token", token, {
            httpOnly: true,
            // expiresIn: 360000   /*    No overload matches this call. Overload 1 of 3, '(name: string, val: string, options: CookieOptions): Response<any, Record<string, any>>', gave the following error. Argument of type '{ httpOnly: true; expiresIn: number; }' is not assignable to parameter of type 'CookieOptions'. Object literal may only specify known properties, but 'expiresIn' does not exist in type 'CookieOptions'. Did you mean to write 'expires'? Overload 2 of 3, '(name: string, val: any, options: CookieOptions): Response<any, Record<string, any>>', gave the following error. Argument of type '{ httpOnly: true; expiresIn: number; }' is not assignable to parameter of type 'CookieOptions'. object literal may only specify known properties, but 'expiresIn' does not exist in type 'CookieOptions'**/
        })
        const {password: pass, ...rest} = user._doc;
        res.status(201).json({message: "User created successfully", user: rest})

    } catch (error: any) {
        console.error(error.message);
        res
            .status(500)
            .json({error: "Internal server error..."})
    }
};

export const login = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        // check if user exists

        if (!user) {
            return res
                .status(404)
                .json({message: "User not found..."})
        }
        // compare password with users hashed password

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials..."})
        }
        const payload = {
            user: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {expiresIn: 360000})
        res.cookie("token", token, {
            httpOnly: true,
            // expiresIn: 36000        //********************************************errrooorr
        })
        const {password: pass, ...rest} = user._doc;
        res.status(200).json({message: "User logged in successfully", user: rest})

    } catch (error: any) {
        console.error(error.message);
        res
            .status(500)
            .json({error: "Internal server error..."})
    }
};

export const logout = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    res
        .clearCookie("token")
        .status(200)
        .json({message: "User logged out successfully"})

};

export const getMe = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    try {
        const user: any = await User.findById(req.user);
        const {password: pass, ...rest} = user._doc;

        if (!user) {
            return res.status(404).json({message: "User not found...", user: rest})
        }
        // const { password: pass, ...rest } = user._doc; w tym miejscu nie widzi
        return res.status(200).json({message: "User found...", user: rest})

    } catch (error: any) {
        console.error(error.message);
        res
            .status(500)
            .json({error: "Internal server error..."})
    }
};

export const updateDetails = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    const {name, email, age} = req.body;
    try {
        // let user = await User.findById(req.user);
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const userExists = await User.findOne({email});
        if (userExists && userExists._id.toString() !== user._id.toString()) {
            return res.status(404).json({message: "Email already taken"})
        }
        user.name = name;
        user.email = email;
        user.age = age;
        await user.save();

        const {password: pass, ...rest} = user._doc;
        res.status(200).json({message: "User updated successfully", user: rest})

    } catch (error: any) {
        console.error(error.message);
        res
            .status(500)
            .json({error: "Internal server error..."})
    }
};

export const updatePassword = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    const {password, newPassword} = req.body;
    try {
        let user = await User.findById(req.user)
        // const user = await User.findById(req.user);  //has to let because it throws error during updateing password :/
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        const {password: pass, ...rest} = user._doc;
        return res.status(200).json({message: "Password updated successfully", user: rest});

    } catch (error: any) {
        console.error(error.message);
        res
            .status(500)
            .json({error: "Internal server error..."})
    }
};

export const deleteUser = async (req: Request | any
    , res: Response, next: (err?: Error) => void) => {
    try {
        let user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
//** if Request is without eny it throws error lik below*//
        // Property 'user' does not exist on type 'Request<ParamsDiction
        // ary, any, any, ParsedQs, Record<string, any>>'.

        // delete tasks belongs to exact user if user is deleted
        const todo = await Todo.find({user: req.user});
        if (todo) {
            await Todo.deleteMany({user: req.user});
        }
        res.clearCookie("token")        //added after postman testing -- check for errors

        await user.remove();
        res.status(200).json({message: "User deleted successfully"})
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({error: "Internal server error"})
    }
};
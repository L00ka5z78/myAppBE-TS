import { check } from 'express-validator';

export const registerRequirements = [
    check("name", "WHOOPS.. Name is required").notEmpty().trim().escape(),
    check("email", "WHOOPS... Insert email").isEmail().normalizeEmail(),
    // check("email", "MSG from validator: Insert email").notEmpty().isEmail().normalizeEmail(),

    check("password", "WHOOPS... Password has to be at least 6 characters long").isLength({ min: 6 }),
    check("age", "WHOOPS... Age is required").notEmpty().trim().escape().isNumeric()
];

export const loginRequirements = [
    check("email", "WHOOPS... Insert valid email").isEmail().normalizeEmail(),
    check("password", "WHOOPS... Password has to be at least 6 characters long").isLength({ min: 6 }),
];

export const updateDetailsRequirements = [
    check("name", "WHOOPS... Name is required").notEmpty().trim().escape(),
    check("email", "WHOOPS... Insert valid email").isEmail().normalizeEmail(),
    check("age", "WHOOPS... Age is required").notEmpty().trim().escape().isNumeric()
];
export const updatePasswordRequirements = [
    check("password", "WHOOPS... Password has to be at least 6 characters long").isLength({ min: 6 }),
    check("newPassword", "WHOOPS... Password has to be at least 6 characters long").isLength({ min: 6 }),
];

export const createTaskRequirements = [
    check("title", "WHOOPS... Title is required").notEmpty().trim().escape(),
    check("description", "WHOOPS... Description is required").notEmpty().trim().escape(),
];

export const updateTaskRequirements = [
    check("title", "WHOOPS... Title is required").notEmpty().trim().escape(),
    check("description", "WHOOPS... Description is required").notEmpty().trim().escape(),
    check("completed", "WHOOPS... Completed is required").notEmpty().trim().escape().isBoolean()
];

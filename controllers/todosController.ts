import {Todo,} from '../models/Todo';
import {Request, Response} from 'express'
import {User, UserDocument} from "../models/User";
import * as express from 'express'

export const getTodos = async (req: Request | any, res: Response, next: (err?: Error) => any) => {
    try {
        const todos = await Todo.find({user: req.user});
        res.status(200).json({message: 'Task found!', todos});
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({error: 'Internal server error'});
    }
};

export const getTodo = async (req: Request | any, res: Response, next: (err?: Error) => any) => {
    const {id} = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({message: 'Todo not found'});
        }
        if (todo.user.toString() !== req.user) {
            res.status(401).json({message: 'Not authorized'});
        }
        res.status(200).json({message: 'Task found!', todo});
    } catch (error: any ) {
        console.error(error.message);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const createTodo = async (req: Request, res: Response, next: (err?: Error) => any) => {
    const {title, description} = req.body;
    try {
        const todo = await Todo.create({
            title,
            description,
            completed: false,
            user: User,
        });
        res.status(201).json({message: 'Task created successfully!', todo});
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({error: 'Internal server error'});
    }
};

export const updateTodo = async (req: Request | any, res: Response, next: (err?: Error) => any) => {
    const {id} = req.params;
    const {title, description, completed} = req.body;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({message: 'Todo not found'});
        }
        if (todo.user.toString() !== req.user) {
            return res.status(401).json({message: 'Not authorized'});
        }
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        await todo.save();
        res.status(200).json({message: 'Todo updated successfully'});
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({error: 'Internal server error'});
    }
};

export const deleteTodo = async (req: Request | any, res: Response, next: (err?: Error) => void) => {
    const {id} = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({message: 'Todo not found'});
        }
        if (todo.user.toString() !== req.user) {
            return res.status(401).json({message: 'Not authorized'});
        }
        await todo.remove();
        return res.status(200).json({message: 'Todo deleted successfully'});
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({error: 'Internal server error'});
    }
};

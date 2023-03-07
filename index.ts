import * as dotenv from 'dotenv';
// import * as express from 'express';
import express = require('express');
// import * as cookieParser from 'cookie-parser';
import cookieParser = require('cookie-parser');
import { connectionDB } from "./database/connectionDB";
import todosRoutes from './routes/todos.route';
import usersRoutes from './routes/users.route';

const app = express();

dotenv.config();

connectionDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/todos", todosRoutes)
app.use('/api/users', usersRoutes)

app.listen(process.env.PORT, () => console.log(`Server is ON and running on PORT ${process.env.PORT}`))

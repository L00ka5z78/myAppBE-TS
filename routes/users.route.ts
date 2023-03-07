import * as express from 'express';
import { register, login, logout, getMe, deleteUser, updateDetails, updatePassword } from '../controllers/usersController';
import { authorize } from '../controllers/middleware/authorize';
import { registerRequirements, loginRequirements, updateDetailsRequirements, updatePasswordRequirements } from '../controllers/middleware/validate';
import { validateResult } from '../controllers/middleware/validationResults';

const router = express.Router();

router.post('/register', registerRequirements, validateResult, register);
router.post("/login", loginRequirements, validateResult, login);

router.get("/logout", authorize, logout);
router.get("/me", authorize, getMe);
router.put('/updatedetails', authorize, updateDetailsRequirements, validateResult, updateDetails);
router.put("/updatepassword", authorize, updatePasswordRequirements, validateResult, updatePassword);

router.delete("/delete", authorize, deleteUser);
// router.delete("/delete", deleteUser);    //bug with delete


export default router
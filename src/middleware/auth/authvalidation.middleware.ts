import { Request, Response, NextFunction } from 'express';
import Validator from 'validatorjs';

const validationMiddleware = (validationRules: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validation = new Validator(req.body, validationRules);

            validation.passes(() => {
                next();
            });

            validation.fails(() => {
                const errors = validation.errors.all();
                res.status(412).send({
                    success: false,
                    message: 'Validation failed',
                    data: errors
                });
            });
        } catch (err) {
            console.log(err);
        }
    };
};

const registerValidation = validationMiddleware({
    fullName: "required|string|min:3",
    email: "required|email",
    password: "required|min:6"
});

const loginValidation = validationMiddleware({
    email: "required|email",
    password: "required|min:6",
});

export {
    registerValidation,
    loginValidation
};

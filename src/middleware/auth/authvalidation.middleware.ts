import { Request, Response, NextFunction } from 'express';
import Validator from 'validatorjs';

const validationMiddleware = (validationRules: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userDto } = req.body;

            const validation = new Validator(userDto, validationRules);

            validation.passes(() => {
                next();
            });

            validation.fails(() => {
                const errors = validation.errors.all();
                const firstErrorKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstErrorKey][0];
                res.status(412).send({
                    success: false,
                    message: firstErrorMessage,
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
    identifier: "required",
    password: "required|min:6"
});

const loginValidation = validationMiddleware({
    identifier: "required",
    password: "required|min:6",
});

const updateUserValidation = validationMiddleware({
    password: "required|min:6"
})

export {
    registerValidation,
    loginValidation,
    updateUserValidation
};

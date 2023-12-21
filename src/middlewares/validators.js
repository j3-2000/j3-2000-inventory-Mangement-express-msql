import { check, validationResult } from "express-validator"

const forName = check('name', 'Name is required with atleast 3 character').not().isEmpty().isLength({ min: 3 });

const forEmail = check("email", "Email is required ")
    .isEmail().withMessage("Invalid Email").not().isEmpty().toLowerCase()

const forPassword = check("password", "password is required ")
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters long")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one small letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one capital letter")
    .matches(/[!@#$%^&*_]/).withMessage("Password must contain at least one special character").not().isEmpty()

const forPhone = check("phone", "phone is required ")
    .isLength({ min: 10 }).withMessage("Number must be at least 10 characters long")
    .matches(/[0-9]{10}/).withMessage("numbers only").not().isEmpty()

const forCity = check("address.city", "City is required").not().isEmpty()
const forState = check("address.state", "State is required").not().isEmpty()
const forCategory = check("category", "category is required").not().isEmpty()
const forPrice = check("price", "Price is required").not().isEmpty()
const forQuantity = check("quantity", "Quantity is required").not().isEmpty()

export const validate = {
    userLogin: [forName, forEmail, forPassword, handleValidationErrors,],
    resetUserPassword: [forPassword, handleValidationErrors,],
    updateUserValidator: [forName, forPhone, forCity, forState, handleValidationErrors,],
    productAdd: [forName, forPrice, forQuantity, forCategory, handleValidationErrors],
};

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => ({ message: error.msg }));
        return res.status(422).json({ errors: errorMessages });
    }
    next();
}

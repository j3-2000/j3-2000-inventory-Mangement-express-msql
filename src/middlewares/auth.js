
import User from '../models/model.js';
import Role from '../models/roles.js'; 

export const auth = async (req, res, next) => {
    try {
        const userData = req.userData;
        const user = await User.findByPk(userData.user_id, {
            include: [
                {
                    model: Role,
                    attributes: ['name'],
                },
            ],
        });
console.log("hello",user.Role.name)
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: User not found' });
        }



        if (user.Role.name === "admin") {
            next();
        } else {
            res.status(403).json({
                message: 'Access forbidden - You are not an admin! Only admins can access this route.',
            });
        }
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(401).json({ message: 'Authentication failed. Token invalid or expired.' });
    }
};

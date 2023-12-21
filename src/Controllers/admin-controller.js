import Role from '../models/roles.js';
import User from '../models/model.js';
import Model from '../models/model.js';


export const updateRoles = async (req, res) => {

    try {
        const { role, useremail } = req.body;
        const getroleId = await Role.findOne({where :{ name: role }});

        let checkroleAndupdate = async (roleId) => {
            const user = await User.findOne({where :{ email: useremail }});
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                user.roleId = roleId;
                await user.save();
                res.json({ message: `Updated Successfully :- Now ${user.name} is ${role} ` });
            }
        }
        if (role === "admin") {
            let admin_id = getroleId.id
            checkroleAndupdate(admin_id)
        } else if (role === "user") {
            let user_id = getroleId.id
            checkroleAndupdate(user_id)
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        const data = await Model.findOne({ email: email.toLowerCase() });

        if (data) {
            const name = data.name;
            await Model.deleteOne({ email: email.toLowerCase() });
            res.status(500).json({ "msg": `${name} is deleted` })
        } else {
            res.status(404).json({ "msg": `${email} is not found` })
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

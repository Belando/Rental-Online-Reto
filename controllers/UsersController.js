const User = require("../models/users")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const authConfig = require("../config/auth")
const UsersController = {}

UsersController.getAllUsers = async (req, res) => {

    try {
        let result = await User.find({})

        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ "Msg": "Lo sentimos, no hemos encontrado ningún usuario." })
        }
    } catch (error) {
        console.log(error)
    }
}

UsersController.getUserById = async (req, res) => {

    let _id = req.params._id
    let user = req.user.usuario[0]

    if (_id !== user._id) {
        res.send({ "Msg": "Acceso no autorizado" })
    } else {
        res.send({
            "id": user._id,
            "name": user.name,
            "surname": user.surname,
            "dni": user.dni,
            "email": user.email,
            "phone": user.phone,
            "nationality": user.nationality
        })
    }
}

UsersController.getUsersByName = async (req, res) => {

    let name = req.body.name

    try {
        await User.find({
            name: name
        })
            .then(foundUsers => {
                res.send(foundUsers)
            })
    } catch (error) {
        console.log(error)
    }
}

UsersController.newUser = async (req, res) => {

    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.Rounds))

    try {
        let user = await User.create({
            name: req.body.name,
            surname: req.body.surname,
            dni: req.body.dni,
            email: req.body.email,
            password: password,
            phone: req.body.phone,
            nationality: req.body.nationality,
            rol: req.body.rol
        })
        if (user) {
            res.send({ "Message": `El usuario ${user.name} se ha añadido con éxito` })
        }
    } catch (error) {
        console.log(error)
    }
}

UsersController.updateUser = async (req, res) => {

    let newName = req.body.name
    let newSurname = req.body.surname
    let newEmail = req.body.email
    let newPassword = req.body.password
    let newNationality = req.body.nationality
    let newPhone = req.body.phone

    try {
        let updated = await User.findOneAndUpdate(
            { dni: dni },
            {
                name: newName,
                surname: newSurname,
                email: newEmail,
                password: newPassword,
                nationality: newNationality,
                phone: newPhone
            }
        ).setOptions({ returnDocument: "after" })
        if (updated) {
            res.send("Usuario actualizado con éxito")
        }
    } catch (error) {
        console.log("Error updating user data", error)
    }
}

UsersController.deleteUser = async (req, res) => {

    let dni = req.body.dni
    let userAdmin = req.user.usuario[0]

    try {
        if (userAdmin.dni !== dni) {
            let deleted = await User.findOneAndDelete({
                dni: dni
            })
            if (deleted) {
                res.send({ "Message": `El usuario ${erased.name} ${erased.surname} se ha eliminado con éxito` })
            } else {
                res.send({ "Msg": "No hemos encontrado al usuario a borrar" })
            }
        } else {
            res.send({ "Msg": "Deletion not possible" });
        }
    } catch (error) {
        console.log("Error deleting user", user)
    }
}

UsersController.loginUser = async (req, res) => {

    try {
        const user = await User.find({
            email: req.body.email
        })
        if (user[0].email === undefined) {
            res.send("Usuario o password incorrectos")
        } else {
            if (bcrypt.compareSync(req.body.password, user[0].password)) {

                let token = jsonwebtoken.sign({ usuario: user[0] }, authConfig.SECRET, { expiresIn: authConfig.EXPIRES })

                let loginOk = `Bienvenido de nuevo ${user[0].name}`;
                res.json({
                    loginOk,
                    token: token
                })
            } else {
                res.send("Usuario o password incorrectos")
            }
        }
    } catch (error) {
        res.send("Email o password incorrectos")
    }
}


module.exports = UsersController
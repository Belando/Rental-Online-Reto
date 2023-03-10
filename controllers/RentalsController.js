
const Rental = require('../models/rental');

const RentalsController = {};

RentalsController.AllUsersAdmin = async (req, res) => {

    try {
        let result = await Rental.find({})
            .populate('idUser')
            .populate('idSerie');
        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ "Message": "Lo sentimos, no hemos encontrado ningún alquiler." })
        }
    } catch (error) {
        console.log(error);
    }
}

RentalsController.newRental = async (req, res) => {
    try {
        let user = await Rental.create({
            idUser: req.body.idUser,
            idSerie: req.body.idSerie,
            nameSerie : req.body.nameSerie,
            nameUser : req.body.nameUser,
            rentalDate: req.body.rentalDate,
            returnDate: req.body.returnDate,
            price: req.body.price
        })
        if (user) {
            res.send({ "data": `Serie alquilada con éxito` });
        }else {
            res.send({ "data": `Ha habido un error en el alquiler` });
        }
    } catch (error) {
        console.log(error)
    }
};

RentalsController.allRentalsUser = async (req, res) => {
    let _id = req.params._id
    try {
        let result = await Rental.find( {idUser: _id})
            
        if (result.length > 0) {
            res.send(result)
        } else {
            res.send({ "Message": "Lo sentimos, no hemos encontrado ningún alquiler." })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = RentalsController;
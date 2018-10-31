const errors = require('restify-errors'); // handles errors nicely

const Customer = require('../models/Customer');

module.exports = server => {
    // GET all customers
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({}); // find the customer and add it to the variable
            res.send(customers);
            next(); // with restify you have to call next at the end
        } catch (err) {
            return next(new errors.InvalidContentError(err)) // this line uses restify-errors
        }
    });

    // GET a single customer
    server.get('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.id); // find the customer and add it to the variable
            res.send(customer);
            next(); // with restify you have to call next at the end
        } catch (err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with id ${req.params.id}`
                )
            ); // this line uses restify-errors
        }
    });


    // Add customers
    server.post('/customers', async (req, res, next) => {
        //check json
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const {
            name,
            email,
            balance
        } = req.body;

        const customer = new Customer({
            name,
            email,
            balance
        });

        try {
            const newCustomer = await customer.save();
            res.send(201); //means it was created
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message));
        }
    });

    // Update customer
    server.put('/customers/:id', async (req, res, next) => {
        //check json
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const customer = await Customer.findOneAndUpdate({
                _id: req.params.id
            }, req.body);
            res.send(200); //means it was created
            next();
        } catch (err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with id ${req.params.id}`
                )
            );
        }
    });

    // Delete Customer
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndRemove({
                _id: req.params.id
            });
            res.send(204); //something was removed
            next();
        } catch (err) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no customer with id ${req.params.id}`
                )
            );
        }
    });
};
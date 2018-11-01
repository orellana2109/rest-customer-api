const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

//assign the user to our model by passing the the Schema
const User = mongoose.model('User', UserSchema);
//now just export User variable
module.exports = User;
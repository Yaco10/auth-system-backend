import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    mail: {
        type: String, 
        requierd: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Por favor, ingrese un email válido"]
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User 
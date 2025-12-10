const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  roles: [{
    type: String,
    enum: ['user', 'admin', 'moderator']
  }],

},

{
    timestamps: true 
}

)

module.exports = mongoose.model("user",userSchema)
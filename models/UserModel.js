const mongoose = require('mongoose');

/* ------------------------------------------------------------------ */
/* User Schema                                                        */
/* ------------------------------------------------------------------ */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Provide email'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Provide password'],
    },

    profile_pic: {
      type: String,
      default: '',
    },

    wallpaper : { type: String,
     default: "" }
  },
  {
    timestamps: true,
  }

  
);

/* ------------------------------------------------------------------ */
/* Model Export                                                       */
/* ------------------------------------------------------------------ */

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

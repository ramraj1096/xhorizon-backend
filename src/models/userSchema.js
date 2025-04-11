import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  image: {
    type: String,
    default: "https://assets.leetcode.com/users/default_avatar.jpg",
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password Must Be Atleast 6 characters"],
  },

  address:{type:Object,default:{line1:'',line2:''}},
  gender:{type:String,default:"Not Selected"},
  dob:{type:String,default:"Not Selected"},
  phone:{type:String,default:"000000000"},
});

const User = mongoose.model("User", userSchema);
export default User;

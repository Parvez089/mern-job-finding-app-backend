import mongoose from "mongoose";


const ProfileSchema = new mongoose.Schema({
    userId: String,
    fullName: String,
    experience: [{
        title: String, 
        company: String, 
        duration: String
    }]
})

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
import User from '../models/User.js';
import asyncHandler from "express-async-handler";


export const getUsers = async (req, res) => {
  try {
    // Exclude the current user
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = true; // add this field to your User model if not exist
    await user.save();

    res.status(200).json({ success: true, message: "User blocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'friends',
      select: 'firstName lastName email phone country profilePhoto status lastSeen'
    });
    
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(req.user);
};


// Update logged-in user's profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { firstName, lastName, phoneNumber, age, country, profilePhoto } = req.body;

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.phoneNumber = phoneNumber ?? user.phoneNumber;
  user.age = age ?? user.age;
  user.country = country ?? user.country;
  user.profilePhoto = profilePhoto ?? user.profilePhoto;

  await user.save();

  res.status(200).json({ message: 'Profile updated successfully', user });
});

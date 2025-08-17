import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
// Get user's friends
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
    .populate('requester', 'firstName lastName profilePhoto')
    .populate('recipient', 'firstName lastName profilePhoto');

    const friends = friendships.map(friendship => 
      friendship.requester._id.toString() === userId 
        ? friendship.recipient 
        : friendship.requester
    );

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const requests = await Friendship.find({
      recipient: userId,
      status: 'pending'
    })
    .populate({
      path: 'requester',
      select: 'firstName lastName profilePhoto'
    });

    // Return requests with populated requester
    res.json(requests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    // Accept both recipientId and receiverId for compatibility
    const recipientId = req.body.recipientId || req.body.receiverId;
    const requesterId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'Invalid recipient ID' });
    }

    // Can't send request to self
    if (requesterId === recipientId) {
      return res.status(400).json({ message: "Can't send request to yourself" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing requests in either direction
    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      return res.status(400).json({ 
        message: existing.status === 'pending'
          ? 'Request already pending'
          : 'You are already friends'
      });
    }

    const newRequest = await Friendship.create({
      requester: requesterId,
      recipient: recipientId
    });

    // Populate for better response
    const populated = await Friendship.findById(newRequest._id)
      .populate('requester', 'firstName lastName profilePhoto')
      .populate('recipient', 'firstName lastName profilePhoto');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept/reject friend request
export const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const request = await Friendship.findOneAndUpdate(
      {
        _id: requestId,
        recipient: userId,
        status: 'pending'
      },
      { status },
      { new: true, runValidators: true }
    )
    .populate('requester', 'firstName lastName profilePhoto');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Response error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
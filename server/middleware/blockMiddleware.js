export const checkBlocked = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId || req.body.receiverId;
    
    const receiver = await User.findById(receiverId);
    
    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        message: `${receiver.firstName} has blocked you. You cannot send messages.`
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// server/controllers/messageController.js
export const sendMessage = async (req, res) => {
  try {
    const { text, receiver } = req.body;
    
    const newMessage = new Message({
      text,
      sender: req.user.id,
      receiver
    });
    
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

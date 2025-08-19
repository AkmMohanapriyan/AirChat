import Message from '../models/Message.js';
import User from '../models/User.js';

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
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, receiver } = req.body;
    
//     const newMessage = new Message({
//       text,
//       sender: req.user.id,
//       receiver
//     });
    
//     const savedMessage = await newMessage.save();
//     res.json(savedMessage);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;

        // Receiver user fetch பண்ணி, blockedUsers check பண்ணல்
        const receiverUser = await User.findById(receiver);
        if (!receiverUser) return res.status(404).json({ message: "Receiver not found" });

        // Receiver sender-ஐ block செய்திருந்தால்
        if (receiverUser.blockedUsers?.includes(sender)) {
            return res.status(403).json({
                message: `Unable to send message. ${receiverUser.firstName} has blocked you.`
            });
        }

        // Sender receiver-ஐ block செய்திருந்தாலும் அனுப்ப அனுமதிக்கலாம் (optional frontend check)
        const newMessage = new Message({
            sender,
            receiver,
            text,
            createdAt: new Date()
        });

        await newMessage.save();

        return res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
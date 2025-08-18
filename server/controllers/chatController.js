import Message from '../models/Message.js';   // FIX: use correct name

// controllers/chatController.js
export const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Clear chat messages between current user and target user
    await Message.deleteMany({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const setChatTheme = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { themeType, themeValue } = req.body;
    const userId = req.user.id;
    
    // Save theme preference to database
    await User.findByIdAndUpdate(userId, {
      $set: { 
        [`chatThemes.${chatId}`]: {
          type: themeType,
          value: themeValue
        }
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Set theme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
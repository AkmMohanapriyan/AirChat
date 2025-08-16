// import User from '../models/User.js';
// import sendEmail from '../utils/sendEmail.js';

// export const sendNewMessageNotification = async (req, res) => {
//   try {
//     const { receiverId, senderName } = req.body;
    
//     // Get receiver's email
//     const receiver = await User.findById(receiverId);
//     if (!receiver) {
//       return res.status(404).json({ success: false, message: 'Receiver not found' });
//     }
    
//     // Create email message
//     const subject = 'New Message Notification';
//     const message = `Hello ${receiver.firstName} ${receiver.lastName},\n\nYou have a new message from ${senderName} on AirChat.\n\nPlease log in to your account to view the message.\n\nBest regards,\nThe AirChat Team`;
    
//     // Send email
//     await sendEmail({
//       email: receiver.email,
//       subject,
//       message
//     });
    
//     res.status(200).json({ success: true, message: 'Notification sent' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to send notification' });
//   }
// };


import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const sendNewMessageNotification = async (req, res) => {
  try {
    const { receiverId, senderName } = req.body;
    
    // Get receiver's email
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }
    
    // Create email message
    const subject = 'New Message Notification';
    const message = `Hello ${receiver.firstName} ${receiver.lastName},\n\nYou have a new message from ${senderName} on AirChat.\n\nPlease log in to your account to view the message.\n\nBest regards,\nThe AirChat Team`;

    // Send email
    await sendEmail({
      email: receiver.email,
      subject,
      message
    });
    
    res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};
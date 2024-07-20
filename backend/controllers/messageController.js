import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Send a message
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new ErrorHandler("Please fill the entire form", 400));
    }

    await Message.create({ firstName, lastName, email, phone, message });
    return res.status(200).json({
        success: true,
        message: "Message sent successfully",
    });
});

// Get all messages
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

//Delete a message
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Find the message by ID
    const message = await Message.findById(id);

    // If the message does not exist, return an error
    if (!message) {
        return next(new ErrorHandler("Message Not Found", 404));
    }

    // Delete the message
    await message.deleteOne();

    // Send a success response
    res.status(200).json({
        success: true,
        message: "Message Deleted",
    });
});

// Reply to a message
export const replyToMessage = catchAsyncErrors(async (req, res, next) => {
    const { reply } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new ErrorHandler("Message not found", 404));
    }

    message.reply = reply;
    await message.save();

    const email = message.email;

    const notification = {
        message: reply,
        date: new Date()
    };

    const user = await User.findOneAndUpdate(
        { email: email },
        { $push: { notifications: notification } },
        { new: true }
    );

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "Reply sent successfully",
    });
});
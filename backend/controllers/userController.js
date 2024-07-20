import { User } from "../models/userSchema.js";
import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, password, gender, dob, aadhaar, role} = req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhaar || !role){
        return next(new ErrorHandler("Please fill the Entire form", 400));
    }

    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("User is already registered", 400));
    }
    user = await User.create({firstName, lastName, email, phone, password, gender, dob, aadhaar, role});

    generateToken(user, "User Registered", 200, res);

    //res.status(200).json({
    //    success: true,
    //    message: "User Registered",
    //});
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password, role} = req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Please Provide All Details", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    if(role !== user.role){
        return next(new ErrorHandler("User with this Role Not Found", 400));
    }

    generateToken(user, "User Logged In Successfully", 200, res);

    //res.status(200).json({
    //    success: true,
    //    message: "User Logged In Successfully",
    //});
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, password, gender, dob, aadhaar} = req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhaar){
        return next(new ErrorHandler("Please fill the Entire form", 400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email Already Exists`, 400));
    }

    const admin = await User.create({firstName, lastName, email, phone, password, gender, dob, aadhaar, role: "Admin"});

    res.status(200).json({
        success: true,
        message: "New Admin Registered",
    });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({role: "Doctor"});

    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200)
       .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
       })
       .json({
        success: true,
        message: "Admin Logged out successfully",
       });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200)
       .cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
       })
       .json({
        success: true,
        message: "Patient Logged out successfully",
       });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avatar Required", 400));
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];

    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported", 400));
    }

    const {firstName, lastName, email, phone, password, gender, dob, aadhaar, doctorDepartment} = req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhaar || !doctorDepartment){
        return next(new ErrorHandler("Please Provide All Details", 400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email`, 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error: ",cloudinaryResponse.error || "Unknown Cloudinary Error");
    }

    const doctor = await User.create({
        firstName, lastName, email, phone, password, gender, dob, aadhaar, doctorDepartment, role: "Doctor", docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });
});

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Check if userId is valid
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user
        const user = await User.findById(userId);

        // Check if user was found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract notifications
        const notifications = user.notifications;

        // Return notifications
        return res.status(200).json({
            success: true,
            notifications
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
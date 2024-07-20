import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, aadhaar, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address} = req.body;

    if(!firstName || !lastName || !email || !phone || !aadhaar || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !address){

        return next(new ErrorHandler("Please fill the Entire Form", 400));
    }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor Not Found", 400));
    }

    if(isConflict.length > 1){
        return next(new ErrorHandler("Doctors Conflict! Please contact through email or phone", 400));
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;

    const appointment = await Appointment.create({
        firstName, lastName, email, phone, aadhaar, dob, gender, appointment_date, department, doctor: {
            firstName: doctor_firstName, lastName: doctor_lastName,
        }, hasVisited, address, doctorId, patientId
    });

    res.status(200).json({
        success: true,
        message: "Appointment Sent Successfully",
        appointment,
    });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();

    res.status(200).json({
        success: true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);

    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found", 404));
    }

    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    const email = appointment.email;

    const status = appointment.status === "Accepted" 
    ? `Your Appointment's Status is ${appointment.status}. The appointment date is ${appointment.appointment_date}`
    : `Your Appointment's Status is ${appointment.status}`;

    const notification = {
        message: status,
        date: new Date()
    };

    const user = await User.findOneAndUpdate(
        { email: email,},
        { $push: { notifications: notification } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Appointment Status Updated",
        appointment,
    });
});


export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);

    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found", 404));
    }

    await appointment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Appointment Deleted",
    });
});
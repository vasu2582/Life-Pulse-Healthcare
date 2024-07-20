import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:4000/api/v1/appointment/getall",
                { withCredentials: true }
            );
            setAppointments(data.appointments);
        } catch (error) {
            setAppointments([]);
            toast.error('Failed to fetch appointments');
        }
    };

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:4000/api/v1/user/doctors",
                { withCredentials: true }
            );
            setDoctors(data.doctors);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleUpdateStatus = async (appointmentId, status) => {
        try {
            const { data } = await axios.put(
                `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
                { status },
                { withCredentials: true }
            );

            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status }
                        : appointment
                )
            );
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleDelete = async (appointmentId) => {
        try {
            await axios.delete(
                `http://localhost:4000/api/v1/appointment/delete/${appointmentId}`,
                { withCredentials: true }
            );
            setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== appointmentId));
            toast.success('Appointment deleted successfully');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const { isAuthenticated, admin } = useContext(Context);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <>
            <section className="dashboard page">
                <div className="banner">
                    <div className="firstBox">
                        <img src="/doc.png" alt="docImg" />
                        <div className="content">
                            <div>
                                <p>Hello,</p>
                                <h5>
                                    {admin && `${admin.firstName} ${admin.lastName}`}{" "}
                                </h5>
                            </div>
                            <p>
                                Welcome to the Life Pulse Healthcare Center. Here, you can manage and oversee all aspects of our healthcare services. Monitor records, manage appointments, and collaborate with our team seamlessly. Your role is pivotal in ensuring the smooth operation and exceptional care provided at Life Pulse.
                            </p>
                        </div>
                    </div>
                    <div className="secondBox">
                        <p>Total Appointments</p>
                        <h3>{appointments.length}</h3>
                    </div>
                    <div className="thirdBox">
                        <p>Registered Doctors</p>
                        <h3>{doctors.length}</h3>
                    </div>
                </div>
                <div className="banner">
                    <h5>Appointments</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Visited Before</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments && appointments.length > 0
                                ? appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                                        <td>{appointment.appointment_date.substring(0, 16)}</td>
                                        <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                                        <td>{appointment.department}</td>
                                        <td>
                                            <select
                                                className={
                                                    appointment.status === "Pending"
                                                        ? "value-pending"
                                                        : appointment.status === "Accepted"
                                                            ? "value-accepted"
                                                            : "value-rejected"
                                                }
                                                value={appointment.status}
                                                onChange={(e) =>
                                                    handleUpdateStatus(appointment._id, e.target.value)
                                                }
                                            >
                                                <option value="Pending" className="value-pending">
                                                    Pending
                                                </option>
                                                <option value="Accepted" className="value-accepted">
                                                    Accepted
                                                </option>
                                                <option value="Rejected" className="value-rejected">
                                                    Rejected
                                                </option>
                                            </select>
                                        </td>
                                        <td>{appointment.hasVisited ? <GoCheckCircleFill className="green" /> : <AiFillCloseCircle className="red" />}</td>
                                        <td onClick={() => handleDelete(appointment._id)}>
                                            <MdDelete />
                                        </td>
                                    </tr>
                                ))
                                : "No Appointments Found!"}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default Dashboard;

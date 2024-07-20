import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Context } from "../main";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { isAuthenticated, user } = useContext(Context);

    useEffect(() => {
        const fetchNotifications = async (userId) => {
            try {
                const { data } = await axios.get(
                    `http://localhost:4000/api/v1/user/notifications/${userId}`,
                    { withCredentials: true }
                );
                // Reverse notifications array to show latest first
                const reversedNotifications = data.notifications.reverse();
                setNotifications(reversedNotifications);
                console.log(data);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        };

        if (user) {
            console.log(user);
            fetchNotifications(user._id);
        }
    }, [user]);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <section className="notifications page">
            <div className="banner">
                {notifications && notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div className="card1" key={index}>
                            <div className="details">
                                <h3 className="notification-item">
                                    <span className="notification-date">
                                        {new Date(notification.date).toLocaleString()}
                                    </span>: {notification.message}
                                </h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-notifications">
                        <h1>No Notifications!</h1>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Notifications;

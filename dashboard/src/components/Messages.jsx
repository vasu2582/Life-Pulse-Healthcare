import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [replies, setReplies] = useState({});
    const { isAuthenticated } = useContext(Context);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/api/v1/message/getall",
                    { withCredentials: true }
                );
                setMessages(data.messages);
                // Initialize replies state with existing replies
                const initialReplies = data.messages.reduce((acc, message) => {
                    acc[message._id] = message.reply || "";
                    return acc;
                }, {});
                setReplies(initialReplies);
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        fetchMessages();
    }, []);

    const handleReplyChange = (messageId, newReply) => {
        setReplies(prevReplies => ({
            ...prevReplies,
            [messageId]: newReply
        }));
    };

    const handleReply = async (messageId) => {
        try {
            const { data } = await axios.post(
                `http://localhost:4000/api/v1/message/reply/${messageId}`,
                { reply: replies[messageId] },
                { withCredentials: true }
            );
            toast.success(data.message);
            // Update replies state after successful reply
            setReplies(prevReplies => ({
                ...prevReplies,
                [messageId]: replies[messageId] || ""
            }));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleDelete = async (messageId) => {
        try {
            const { data } = await axios.delete(
                `http://localhost:4000/api/v1/message/delete/${messageId}`,
                { withCredentials: true }
            );
            toast.success(data.message);
            // Remove the deleted message from the state
            setMessages(prevMessages => prevMessages.filter(message => message._id !== messageId));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <>
            <section className="page messages">
                <h1>MESSAGES</h1>
                <div className="banner">
                    {messages && messages.length > 0 ? (
                        messages.map((element) => (
                            <div className="card" key={element._id}>
                                <div className="details">
                                    <p>
                                        First Name: <span>{element.firstName}</span>
                                    </p>
                                    <p>
                                        Last Name: <span>{element.lastName}</span>
                                    </p>
                                    <p>
                                        Email: <span>{element.email}</span>
                                    </p>
                                    <p>
                                        Phone: <span>{element.phone}</span>
                                    </p>
                                    <p>
                                        Message: <span>{element.message}</span>
                                    </p>
                                    {element.reply ? (
                                        <div className="reply-section">
                                            <p>Replied: <span>{element.reply}</span></p>
                                            <button className="delete-button" onClick={() => handleDelete(element._id)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                        ) : (
                                        <div className="reply-section">
                                            <textarea
                                                value={replies[element._id] || ""}
                                                onChange={(e) => handleReplyChange(element._id, e.target.value)}
                                                placeholder="Reply here..."
                                            />
                                            <button onClick={() => handleReply(element._id)}>
                                                Send Reply
                                            </button>
                                            <button className="delete-button" onClick={() => handleDelete(element._id)}> 
                                                <MdDelete />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1>No Messages!</h1>
                    )}
                </div>
            </section>
        </>
    );
};

export default Messages;

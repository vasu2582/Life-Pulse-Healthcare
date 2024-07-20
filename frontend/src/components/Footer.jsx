import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    const hours = [
        {
          id: 1,
          day: "Mon - Fri",
          time: "8:00 AM - 8:00 PM",
        },
        {
          id: 2,
          day: "Saturday",
          time: "9:00 AM - 5:00 PM",
        },
        {
          id: 3,
          day: "Sunday",
          time: "10:00 AM - 2:00 PM",
        },
    ];

    return (
        <>
            <footer className={"container"}>
                <hr />
                <div className="content">
                    <div>
                        <img src="/logo2.png" alt="logo" className="logo-img"/>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <Link to={"/"}>Home</Link>
                            <Link to={"/appointment"}>Appointment</Link>
                            <Link to={"/about"}>About</Link>
                        </ul>
                    </div>
                    <div>
                        <h4>Timings</h4>
                        <ul>
                            {
                                hours.map((element) => (
                                    <li key={element.id}>
                                        <span>{element.day}</span>
                                        <span>{element.time}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <div>
                            <FaPhone />
                            <span>+91 9998887777</span>
                        </div>
                        <div>
                            <MdEmail />
                            <span>info@lifepulse.com</span>
                        </div>
                        <div>
                            <FaLocationArrow />
                            <span>New Delhi, India</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
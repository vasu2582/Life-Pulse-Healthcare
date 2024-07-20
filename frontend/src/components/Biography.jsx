import React from "react";

const Biography = ({imageUrl}) => {
    return (
        <>
            <div className="container biography">
                <div className="banner">
                    <img src={imageUrl} alt="whoweare" />
                </div>
                <div className="banner">
                    <h3>Who We Are</h3>
                    <p>
                        At Life Pulse Healthcare Center, we are a dedicated team of healthcare professionals committed to providing exceptional medical care and compassionate support. Founded on the principles of excellence, innovation, and integrity, our facility offers state-of-the-art medical technology and a comprehensive range of services designed to meet the diverse needs of our community.
                    </p>
                    <p>
                        Our mission is to enhance the health and well-being of our patients through personalized care, advanced medical treatments, and continuous improvement in healthcare practices. We believe in treating each patient with dignity and respect, fostering a welcoming and healing environment for all.
                    </p>
                    <p>
                        Our team consists of experienced doctors, nurses, specialists, and support staff who work collaboratively to ensure the highest standards of patient care. We are proud to be a trusted healthcare provider, dedicated to making a positive impact on the lives of those we serve.
                    </p>
                    <p>
                        At Life Pulse, your health is our priority, and we are here to support you every step of the way on your journey to optimal wellness.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Biography;
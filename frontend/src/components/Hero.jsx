import React from "react";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <span className="badge">Powered by AI</span>
            <h1>Transform Your Learning Experience</h1>
            <p>Convert text images into searchable digital content with AI-powered tools that revolutionize the way you learn.</p>
            <div className="cta-buttons">
                <Link to="/ocr">
                    <button className="primary">Get Started Free</button>
                </Link>
                <button className="secondary">Watch Demo</button>
            </div>
        </section>
    );
}

export default Hero;

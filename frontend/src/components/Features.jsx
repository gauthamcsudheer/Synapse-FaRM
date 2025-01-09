import React from "react";

function Features() {
    const features = [
        {
            title: "OCR Technology",
            description: "Transform any text image or handwritten notes into searchable digital content with our advanced AI technology.",
        },
        {
            title: "AI Chat Assistant",
            description: "Engage with your notes through our intelligent chatbot that helps you understand and organize your content better.",
        },
        {
            title: "Multilingual Support",
            description: "Break language barriers with support for multiple languages, making learning accessible to everyone.",
        },
        {
            title: "Text-to-Speech",
            description: "Listen to your notes on the go with natural-sounding voice synthesis in multiple languages and accents.",
        },
    ];

    return (
        <section id="features" className="features">
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;

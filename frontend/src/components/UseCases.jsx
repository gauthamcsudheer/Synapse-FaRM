import React from "react";

function UseCases() {
    const useCases = [
        {
            title: "Students",
            points: [
                "Convert textbook pages to searchable notes",
                "Record and transcribe lectures automatically",
                "Listen to study materials while commuting",
                "Get AI-powered explanations for complex topics",
            ],
        },
        {
            title: "Educators",
            points: [
                "Convert teaching materials to digital format",
                "Generate audio versions of written content",
                "Create multilingual learning resources",
                "Track student engagement with materials",
            ],
        },
        {
            title: "Researchers",
            points: [
                "Digitize research papers and notes",
                "Convert audio recordings to text",
                "Generate summaries of long documents",
                "Collaborate with AI-powered insights",
            ],
        },
    ];

    return (
        <section id="use-cases" className="use-cases">
            <h2>Use Cases</h2>
            <div className="use-cases-grid">
                {useCases.map((useCase, index) => (
                    <div key={index} className="use-case-card">
                        <h3>{useCase.title}</h3>
                        <ul>
                            {useCase.points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default UseCases;

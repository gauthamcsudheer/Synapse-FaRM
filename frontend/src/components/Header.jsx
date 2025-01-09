import React from "react";

function Header() {
    return (
        <header className="header">
            <nav className="nav-container">
                <div className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-6.45 2.5 2.5 0 0 1 1.46-4.13 2.5 2.5 0 0 1 3.3-4.28Z" />
                        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-6.45 2.5 2.5 0 0 0-1.46-4.13 2.5 2.5 0 0 0-3.3-4.28Z" />
                    </svg>
                    <span>Synapse</span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#use-cases">Use Cases</a>
                </div>
            </nav>
        </header>
    );
}

export default Header;

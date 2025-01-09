// src/components/Home.jsx
import React from 'react';
import Hero from './Hero'; // Assuming Hero component exists
import Features from './Features'; // Assuming Features component exists
import UseCases from './UseCases'; // Assuming UseCases component exists
import './Home.css';

const Home = () => {
    return (
        <div>
            <Hero />
            <Features />
            <UseCases />
        </div>
    );
};

export default Home;

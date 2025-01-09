import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import "./App.css";

function App() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Features />
                <UseCases />
            </main>
        </>
    );
}

export default App;

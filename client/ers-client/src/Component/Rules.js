import React, { useState } from "react";

const rulesData = [
    { title: "Objective", info: "Win all the cards by reacting quickly and slapping the pile at the right moments." },
    { title: "Setup", info: "Shuffle a standard 52-card deck and deal all cards evenly among players, face-down." },
    { title: "Gameplay", info: "Players take turns placing the top card of their stack into the center pile." },
    { title: "Slapping Rules", info: "Players can slap when a 7 is played, on doubles, or sandwiches." },
    { title: "Winning", info: "The last player with cards remaining wins the game!" }
];

const Rules = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [flippedIndex, setFlippedIndex] = useState(null);

    const rotateCarousel = (direction) => {
        setActiveIndex((prevIndex) => 
            direction === "left" ? prevIndex - 1 : prevIndex + 1
        );
    };

    const flipCard = (index) => {
        setFlippedIndex(flippedIndex === index ? null : index);
    };

    return (
        <div className="rules-container">
            <button className="nav-btn left" onClick={() => rotateCarousel("left")}>&lt;</button>
            
            <div className="carousel">
                {rulesData.map((rule, index) => {
                    const angle = (index - activeIndex) * 60; // Rotating effect
                    return (
                        <div 
                            key={index} 
                            className={`rule-card ${flippedIndex === index ? "flipped" : ""}`} 
                            style={{ transform: `rotateY(${angle}deg) translateZ(300px)` }}
                            onClick={() => flipCard(index)}
                        >
                            <div className="card-front">{rule.title}</div>
                            <div className="card-back">{rule.info}</div>
                        </div>
                    );
                })}
            </div>

            <button className="nav-btn right" onClick={() => rotateCarousel("right")}>&gt;</button>
        </div>
    );
};

export default Rules;

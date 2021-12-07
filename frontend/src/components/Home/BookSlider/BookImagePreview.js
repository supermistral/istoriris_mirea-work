import React, { useEffect, useState } from "react";
import { animated, useTransition } from 'react-spring';


const BookImagePreview = ({ imageSrc, side }) => {
    const bottomToUp = {top: '100%'};
    const upToBottom = {top: '-100%'};

    const transitionFrom = side === "left" ? bottomToUp : upToBottom;
    const transitionLeave = side === "left" ? upToBottom : bottomToUp;
    
    const transitions = useTransition(imageSrc, {
        from: transitionFrom,
        enter: { top: '0%' },
        leave: transitionLeave,
        config: {
            mass: 1,
            tension: 180,
            friction: 30
        }
    });

    return transitions((styles, item) => 
        item &&
        <animated.div style={styles} className={`book-preview ${side}`}>
            <div className="book-preview-container">
                <img src={item} alt="preview2" />
            </div>
        </animated.div>
    );
}

export default BookImagePreview;
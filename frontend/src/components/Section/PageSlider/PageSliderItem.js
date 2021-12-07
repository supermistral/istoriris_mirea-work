import React, { useEffect, useRef, useState } from 'react';
import { useTransition, useSpring, animated } from 'react-spring';


const CLASSES = {
    topHidden: 'top-hidden',
    top: 'top',
    center: '',
    bottom: 'bottom',
    bottomHidden: 'bottom-hidden'
};

const translateY = x => `translateY(${x}px)`;
const rotateX = x => `rotateX(${x}deg)`;
const transformOrigin = x => typeof x === "number" ? `center ${x}%` : x;

const PageSliderItem = ({
    itemImage,
    height,
    styles,
    imageQuality,
}) => {

    return (
        itemImage ?
        <animated.div className="slider-item" style={{
            height: `${height}px`,
            transform: styles.translate.to(translateY),
            opacity: styles.opacity.to(x => x)
        }}>
            <animated.img 
                src={imageQuality ? itemImage.image : itemImage.image_low} 
                style={{
                    transformOrigin: styles.imageTransformOrigin.to(transformOrigin),
                    transform: styles.imageRotate.to(rotateX)
                }} 
            />
        </animated.div> : null
    )
}


export default PageSliderItem;
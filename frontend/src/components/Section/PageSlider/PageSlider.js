import { animated, useSpring, useSprings } from 'react-spring';
import React, { useEffect, useRef, useState } from "react";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import PageSliderItem from "./PageSliderItem";
import SectionLink from './SectionLink';


const translateY = x => `translateY(${x}px)`;

const getSlideStyles = (rot, transOrigin, trans = 0, o = 1) => {
    const data = {
        translate: trans,
        imageRotate: rot,
        opacity: o
    };

    if (typeof transOrigin !== "undefined") {
        data.imageTransformOrigin = transOrigin;
    }

    return data;
};

const SLIDER_DIR = {
    top: 'top',
    undefined: 'undefined',
    bottom: 'bottom'
};

let _startY = null,
    _scrollFactor = null,
    _translateFactor = null,
    _rotateFactor1 = null,
    _rotateFactor2 = null,
    _opacityFactor = null;


const PageSlider = ({
    imagesData, 
    totalPages, 
    setIndexCallback,
    links,
    currentIndex,
    isRightPlaced,
    imageQuality,
}) => {
    if (!Array.isArray(imagesData) || imagesData.length === 0) {
        return null;
    }

    const getSliderDir = index => {
        return index === 0 ? SLIDER_DIR.top
            : index + 1 === totalPages ? SLIDER_DIR.bottom
            : SLIDER_DIR.undefined;
    }

    const sliderRef = useRef(null);
    const [sliderDir, setSliderDir] = useState(getSliderDir(currentIndex));
    const [slideHeight, setSlideHeight] = useState();
    const [sliderTranslate, setSliderTranslate] = useSpring(() => ({ 
        x: 0,
        config: {
            mass: 1,
            tension: 200,
            friction: 40
        },
    }));
    const [slidesStyles, setSlidesStyles] = useSprings(totalPages, ind => ({
        imageRotate: 0,
        imageTransformOrigin: '',
        translate: 0,
        opacity: 1,
        config: {
            mass: 1,
            tension: 200,
            friction: 40
        },
    }));

    const getCorrectIndex = (index) => {
        return index < 0 ? 0
            : index >= totalPages ? totalPages - 1 
            : index; 
    }

    const setCorrectCurrentIndex = index => {
        const newIndex = getCorrectIndex(index);
        setIndexCallback(newIndex);
    }

    const prevClickHandler = () => {
        setCorrectCurrentIndex(currentIndex - 1);
    }

    const nextClickHandler = () => {
        setCorrectCurrentIndex(currentIndex + 1);
    }

    const setSliderWidth = () => {
        if (sliderRef.current) { 
            const height = sliderRef.current.offsetHeight / 3;
            sliderRef.current.style.width = height + "px";

            setSlideHeight(height);
        }
    }

    const updateCurrentIndex = () => {
        if (slideHeight) {
            const ind = currentIndex;
            
            setSlidesStyles(i => {
                const newStyles = i === ind - 1 ? getSlideStyles(45, 100) 
                            : i === ind + 1 ? getSlideStyles(-45, 0)
                            : i < ind ? getSlideStyles(99, 100, 30, 0)
                            : i > ind ? getSlideStyles(-99, 0, -30, 0)
                            : getSlideStyles(0);
                return {...newStyles}
            });

            setSliderDir(getSliderDir(ind));
            setSliderTranslate({ x: (1 - ind) * slideHeight });
        }
    }

    useEffect(() => {
        updateCurrentIndex();
    }, [currentIndex, slideHeight]);

    const RESIZE_TIMEOUT = 150;
    let resizeTimer = null;

    const resizeSliderHandler = (e) => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setSliderWidth, RESIZE_TIMEOUT);
    }

    useEffect(() => {
        window.addEventListener('resize', resizeSliderHandler);

        return () => window.removeEventListener('resize', resizeSliderHandler);
    }, []);

    useEffect(() => {
        setSliderWidth();
    }, [sliderRef]);

    const mouseMoveHandler = e => {
        const y = e.pageY || e.touches && e.touches[0].pageY;
        const walk = (y - _startY) * _scrollFactor;       // < 0 => move top
        const walkSlide = walk % slideHeight;

        if (walkSlide === 0 || isNaN(y)) return;

        const diffIndex = Math.trunc(-walk / slideHeight);  // Пройденные индексы
        const diffDirIndex = Math.trunc((-slideHeight - walkSlide) / slideHeight) + diffIndex;  // Индекс элемента над серединным
        const isCurrentAbove = diffDirIndex === diffIndex;  // для точки отсчета анимации

        const topIndex = diffDirIndex + currentIndex;    // индекс над центром (или сам центр)
        const topAboveIndex = topIndex - 1;                 // еще выше 
        const bottomIndex = topIndex + 1;                   // под центром (или сам центр)
        const bottomBelowIndex = bottomIndex + 1;           // ниже

        if (topIndex < 0 || bottomIndex >= totalPages) {
            return;
        }
        if (sliderDir !== SLIDER_DIR.undefined) {
            setSliderDir(SLIDER_DIR.undefined);
        }

        const   walkSlideAbs        = Math.abs(walkSlide),
                walkToLargeAbove    = isCurrentAbove ? walkSlideAbs : slideHeight - walkSlideAbs,
                walkToSmallAbove    = isCurrentAbove ? slideHeight - walkSlideAbs : walkSlideAbs;

        setSliderTranslate({ x: walk + (1 - currentIndex) * slideHeight });
        setSlidesStyles(i => {
            return  i === topIndex ? getSlideStyles(walkToLargeAbove * _rotateFactor1, 100) :
                    i === bottomIndex ? getSlideStyles(-walkToSmallAbove * _rotateFactor1, 0) : 
                    i === topAboveIndex ? getSlideStyles(45 + walkToLargeAbove * _rotateFactor2, 
                                                         100,
                                                         walkToLargeAbove * _translateFactor,
                                                         walkToSmallAbove * _opacityFactor) :
                    i === bottomBelowIndex ? getSlideStyles(-45 - walkToSmallAbove * _rotateFactor2, 
                                                            0, 
                                                            -walkToSmallAbove * _translateFactor, 
                                                            walkToLargeAbove * _opacityFactor) :
                    null;

        });
    }

    const mouseUpHandler = () => {
        const newIndex = Math.trunc((-sliderTranslate.x.animation.to + slideHeight * 1.5) / slideHeight);
        
        if (newIndex === currentIndex) {
            updateCurrentIndex();
        } else {
            setCorrectCurrentIndex(newIndex);
        }

        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('touchmove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('touchend', mouseUpHandler);
    }

    const mouseDownHandler = e => {
        e.preventDefault();

        _startY = e.pageY || e.touches && e.touches[0].pageY;
        if (sliderRef.current) {
            const height = sliderRef.current.offsetHeight / 3;
            _translateFactor = 50 / height;
            _rotateFactor1 = 45 / height;
            _rotateFactor2 = (99 - 45) / height;
            _opacityFactor = 1 / height;
            _scrollFactor = height * totalPages / document.body.clientHeight;
        }

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('touchmove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('touchend', mouseUpHandler);
    }

    return (
        <div className={`page-slider${isRightPlaced ? '' : ' left'}`}>
            <div className="page-slider-control">
                <button className="control-button prev">
                    <FaChevronUp onClick={prevClickHandler} />
                </button>
                <div className="page-info">
                    <div className="page-info-current">
                        {imagesData[currentIndex].number}
                    </div>
                    <div className="page-info-total">
                        {totalPages}
                    </div>
                </div>
                <button className="control-button next">
                    <FaChevronDown onClick={nextClickHandler} />
                </button>
            </div>
            <div 
                className="slider" 
                ref={sliderRef} 
                onMouseDown={mouseDownHandler}
                onTouchStart={mouseDownHandler}
            >
                <SectionLink 
                    section={links.prev} 
                    isShow={sliderDir === SLIDER_DIR.top}
                />
                <animated.div className="slider-items-container" style={{
                    transform: sliderTranslate.x.to(translateY)
                }}>
                    {imagesData && slideHeight && slidesStyles.map((styles, i) => {
                        
                        return (
                            <PageSliderItem
                                key={i}
                                currentIndex={currentIndex}
                                itemIndex={i}
                                itemImage={imagesData[i]}
                                height={slideHeight}
                                styles={styles}
                                imageQuality={imageQuality}
                            />
                        )
                    })}
                </animated.div>
                <SectionLink 
                    section={links.next} 
                    isShow={sliderDir === SLIDER_DIR.bottom || totalPages === 1}
                />
            </div>
        </div>
    )
}


export default PageSlider
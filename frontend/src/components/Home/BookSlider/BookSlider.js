import React, { useEffect, useRef, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaChevronDown } from 'react-icons/fa';
import { BsBoxArrowInRight } from 'react-icons/bs';
import BookImagePreview from './BookImagePreview';
import BookInfoItem from "./BookInfoItem";
import './BookSlider.css';
import { Link } from 'react-router-dom';


let mouseDownDate = null,   // Время клика по слайдеру
    mouseDownTime = null;   // Сколько времени был зажат слайдер
const CLICK_TIME = 150;

let _startOffset = null,
    _maxTranslate = null;


const BookSlider = ({ 
    slides, 
    slidesInfo, 
    updateCurrentBook, 
    currentBookNumber,
    showImagePortal
}) => {

    if (!Array.isArray(slides) || slides.length < 1) {
        return null;
    }

    const slidesLength = slides.length;

    const [currentNum, setCurrentNum] = useState(currentBookNumber || 0);
    const [sliderTransform, setSliderTransform] = useState(null);
    const [size, setSize] = useState({ slide: null, offset: null });
    const [isBookInfoActive, setIsBookInfoActive] = useState(false);

    const slideRef = useRef();

    const nextSlide = () => {
        if (currentNum === slidesLength - 1) 
            return;
        setCurrentNum(currentNum + 1);
    };

    const prevSlide = () => {
        if (currentNum === 0) 
            return;   
        setCurrentNum(currentNum - 1);
    }

    const setSlideSize = () => {
        const { current: target } = slideRef;

        const slideSize = target.clientWidth / slidesLength;
        const slideOffset = (target.parentNode.offsetWidth - slideSize) / 2;
        
        const image = target.querySelector('.slide.active .slide-img img');

        setSize({
            slide: slideSize,
            offset: slideOffset,
            height: image.offsetHeight
        });
        setTimeout(() => { target.style.transitionDuration = null }, 300);
    }

    useEffect(() => {
        if (size.slide !== null) {
            setSliderTransform(-size.slide * currentNum + size.offset);
        }
    }, [currentNum, size])

    useEffect(() => {
        if (slideRef.current) {
            slideRef.current.style.transitionDuration = '0s';
            setSlideSize(currentNum);
        }
    }, [slideRef]);

    const RESIZE_TIMEOUT = 150;
    let resizeTimer = null;

    const resizeHandler = (e) => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setSlideSize, RESIZE_TIMEOUT);
    }

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    const mouseMoveHandler = (e) => {
        e.preventDefault();

        if (_startOffset !== null) {
            const x = e.pageX || e.touches && e.touches[0].pageX;
            const walk = x - _startOffset;
            const currentTranslate = walk + sliderTransform;

            if (
                currentTranslate <= size.offset && 
                currentTranslate >= _maxTranslate
            ) {
                slideRef.current.style.transform = `translateX(${currentTranslate}px)`;
            }
        }
    }

    const mouseUpHandler = (e) => {
        e.preventDefault();

        _startOffset = null;
        const translate = -(getTranslateValue(slideRef.current) - size.offset);
        const newNum = Math.trunc((translate + size.slide / 2) / size.slide);
        
        slideRef.current.style.transitionDuration = "";
        slideRef.current.classList.remove('move');
        newNum === currentNum 
            ? slideRef.current.style.transform = `translateX(${-size.slide * newNum + size.offset}px)`
            : setCurrentNum(newNum);

        const timer = new Date();
        mouseDownTime = timer.getTime() - mouseDownDate.getTime();

        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('touchend', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('touchmove', mouseMoveHandler);
    }

    const mouseDownHandler = (e) => {
        e.preventDefault();

        setIsBookInfoActive(false);

        mouseDownDate = new Date();

        slideRef.current.style.transitionDuration = '0s';
        slideRef.current.classList.add('move');
        _startOffset = e.pageX || e.touches && e.touches[0].pageX;
        _maxTranslate = -size.slide * (slidesLength - 1) + size.offset;

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('touchmove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('touchend', mouseUpHandler);
    }

    const bookPageTransition = () => {
        const image = slideRef.current.querySelector('.slide.active .slide-img img');
        const imageClientRect = image.getBoundingClientRect();
        const imageCoords = {
            top: imageClientRect.top,
            left: imageClientRect.left,
            width: imageClientRect.width,
            height: imageClientRect.height
        };
        updateCurrentBook({ 
            ...slidesInfo[currentNum],
            imageCoords: imageCoords,
            number: currentNum
        });

        showImagePortal();
    }

    const slideClickHandler = (e) => {
        e.preventDefault();
        if (mouseDownTime > CLICK_TIME)
            return;
        bookPageTransition();
    }

    const readButtonClickHandler = (e) => {
        e.preventDefault();
        bookPageTransition();
    }

    const getTranslateValue = (elem) => parseInt(elem.style.transform.replace(/[^\d-.]/g, ''));
    
    const slideInfoOpenButtonClickHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        if (mouseDownTime > CLICK_TIME)
            return;
        setIsBookInfoActive(true);
    }

    const slideInfoHideButtonClickHandler = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const setSlideHeight = e => {
        setSize(prev => ({
            ...prev,
            height: e.target.offsetHeight
        }));
    }

    return (
        <div className={`book-slider${isBookInfoActive ? ' active__mobile' : ''}`}>
            <div className="slider-container">
                <div className="slide-indicator">
                    <div className="indicator" style={{
                        width: `${100 / slidesLength}%`,
                        left: `${100 / slidesLength * currentNum}%`
                    }}></div>
                    {new Array(slidesLength).map((_, i) => 
                        <div key={i} className="indicator-item"></div>
                    )}
                </div>
                <a 
                    className="arrow arrow-left" 
                    onClick={prevSlide}
                    style={{ top: size.height ? `calc(${size.height / 2}px + 2em)` : null }}
                >
                    <FaArrowAltCircleLeft />
                </a>
                <a 
                    className="arrow arrow-right" 
                    onClick={nextSlide}
                    style={{ top: size.height ? `calc(${size.height / 2}px + 2em)` : null }}
                >
                    <FaArrowAltCircleRight />
                </a>
                <div className="slide-gradient left"></div>
                <div className="slide-gradient right"></div>
                <div 
                    className={`slider slides-${slidesLength}`} 
                    ref={slideRef} 
                    style={{transform: `translateX(${sliderTransform}px)`}}
                    onMouseDown={mouseDownHandler}
                    onTouchStart={mouseDownHandler}
                >
                { 
                    slides.map((slide, i) => {
                        const slideClass = i === currentNum ? " active" 
                            : i === currentNum - 1 ? " prev" 
                            : i === currentNum + 1 ? " next" 
                            : "";
                        
                        return (
                            <div className={"slide" + slideClass} key={i} >
                                <Link to={'books/' + slidesInfo[currentNum].id} onClick={slideClickHandler}>
                                    <div className="slide-img">
                                        <img 
                                            src={slide.image} 
                                            alt=""
                                            onLoad={i === 0 ? setSlideHeight : null}
                                        />
                                    </div>
                                </Link>
                                <div className="info-button__mobile open" onClick={slideInfoOpenButtonClickHandler}></div>
                                <div className="info-button__mobile hide" onClick={slideInfoHideButtonClickHandler}></div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
            <BookImagePreview imageSrc={slides[currentNum].image_preview_1} side="left" />
            <BookImagePreview imageSrc={slides[currentNum].image_preview_2} side="right" />
            <div className="info">
                <div className="book-info-read">
                    <Link 
                        className="read-button"
                        to={'books/' + slidesInfo[currentNum].id} 
                        onClick={readButtonClickHandler}
                    >
                        Читать
                    </Link>
                </div>
                <div className="book-info">
                    <div className="info-buttons__mobile">
                        <button className="hide-button" onClick={() => setIsBookInfoActive(false)}>
                            <span className="icon"><FaChevronDown strokeWidth="5%" stroke="orange" /></span>
                        </button>
                        <Link to={'books/' + slidesInfo[currentNum].id} onClick={slideClickHandler} className="enter-button">
                            <span className="text">Перейти</span>  
                            <span className="icon"><BsBoxArrowInRight /></span>
                        </Link>
                    </div>
                    <BookInfoItem type="Жанры" value={slidesInfo[currentNum].genre} field="name" />
                    <BookInfoItem type="Статус" value={slidesInfo[currentNum].status} />
                    <BookInfoItem type="О книге" value={slidesInfo[currentNum].description} addClass="long-text" />
                </div>
            </div>
        </div>
    )
}

export default BookSlider;
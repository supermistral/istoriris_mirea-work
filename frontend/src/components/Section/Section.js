import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router";
import { RiMenuFoldLine } from 'react-icons/ri';
import PageSlider from "./PageSlider/PageSlider";
import BackgroundTemplate from '../../media/background_template.svg'; 
import './Section.css';
import Settings from "./Settings/Settings";
import SectionPreview from "./SectionPreview";
import PageSettings from "./PageSettings/PageSettings";

let touchY = null;
const initialIndex = 0;
const storagePageSettingsKey = 'page-settings';    
const initialPageSettings = {
    quality: true,
    sliderPlace: true
};

export const getPageSetting = setting => {
    return setting !== undefined ? setting : true;
}


const Section = ({ getSection, isLoading, data, error }) => {
    const { sectionId } = useParams();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLoad, setIsLoad] = useState(false);
    const [previewShow, setPreviewShow] = useState(true);
    const [pageSettings, setPageSettings] = useState({
        ...initialPageSettings,
        ...JSON.parse(localStorage.getItem(storagePageSettingsKey))
    });

    const imageRef = useRef(null);
    const imageContainerRef = useRef(null);

    const location = useLocation();

    const getCorrectIndex = (index, max = data.total_pages) => index < 0 ? 0
        : index >= max ? max - 1
        : index;

    const getPageIndexFromURLParams = (max = data.total_pages) => {
        const params = new URLSearchParams(location.search);
        const value = +params.get("page");

        if (max && !isNaN(value)) {
            return getCorrectIndex(value, max);
        }

        return null;
    }

    const setInitialState = () => {
        setCurrentIndex(initialIndex);
        setIsLoad(false);
        setPreviewShow(true);
    }

    useEffect(() => {
        setInitialState();

        const sectionRequestCallback = () => {
            const index = getPageIndexFromURLParams(data.total_pages);
            if (index !== null && index !== currentIndex) {
                setCurrentIndex(index);
            }
        }

        getSection(sectionId, sectionRequestCallback);

    }, [sectionId]);

    const imageLoadHandler = ({ target: image }) => {
        imageContainerRef.current.style.width = 
            image.getBoundingClientRect().width + "px";
        setIsLoad(true);
    }

    useEffect(() => {
        const index = getPageIndexFromURLParams();
        if (index !== null) {
            setCurrentIndex(index);
        }
    }, [location.search]);

    useEffect(() => {
        localStorage.setItem(storagePageSettingsKey, JSON.stringify(pageSettings));
    }, [pageSettings]);

    const setImageContainerWidth = () => {
        imageContainerRef.current.style.width = 'auto';
        imageContainerRef.current.style.width = 
            imageRef.current.getBoundingClientRect().width + "px";
    }

    const RESIZE_TIMEOUT = 150;
    let resizeTimer = null;

    const resizeHandler = (e) => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setImageContainerWidth, RESIZE_TIMEOUT);
    }

    useEffect(() => {
        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    const touchEndHandler = e => {
        const y = e.changedTouches && e.changedTouches[0].pageY || null;
        if (touchY === null || y === null)
            return;

        if (touchY - y < 0) {
            setCurrentIndex(getCorrectIndex(currentIndex - 1));
        } else if (touchY - y > 0) {
            setCurrentIndex(getCorrectIndex(currentIndex + 1));
        }

        window.removeEventListener('touchend', touchEndHandler);
    }

    const touchStartHandler = e => {
        touchY = e.touches && e.touches[0].pageY || null;
        if (touchY === null)
            return;

        window.addEventListener('touchend', touchEndHandler);
    }

    return (
        <div className="section">
            <SectionPreview 
                number={data.number} 
                name={data.name}
                isLoad={isLoad}
                isDataLoading={isLoading}       // TODO: isDataLoading -> spinner
                error={error}                   // error -> show error message
                totalPages={data.total_pages}
                unmountCallback={() => setPreviewShow(false)}
            />
            <div 
                className="page-background" 
                style={{
                    backgroundImage: `url(${BackgroundTemplate})`,
                }}
            ></div>
            <div 
                className={`page${pageSettings.sliderPlace ? '' : ' left'}`} 
                style={{ opacity: previewShow ? 0 : null }}
            >
                <Settings book={data.book} />
                <PageSettings
                    pages={data.pages}
                    pageNumber={currentIndex}
                    sections={data.sections}
                    sectionId={sectionId}
                    pageSettings={pageSettings}
                    setPageSettings={setPageSettings}
                />
                <div 
                    ref={imageContainerRef} 
                    className="page-image"
                    onTouchStart={touchStartHandler}
                >
                    {
                        data.pages &&
                        data.pages.map((page, i) => 
                            <img 
                                key={i}
                                src={pageSettings.quality ? page.image : page.image_low} 
                                ref={i === currentIndex ? imageRef : null} 
                                onLoad={i === currentIndex ? imageLoadHandler : null} 
                                style={i !== currentIndex ? {display: 'none'} : null}
                            />
                        )
                    }
                </div>
                <div className="page-slider-container">
                    <button 
                        className="page-slider-button__mobile"
                        onClick={e => e.target.closest('.page-slider-container').classList.toggle('active')}
                    >
                        <RiMenuFoldLine />
                    </button>
                    {
                        data.pages &&
                        isLoad &&
                        <PageSlider 
                            imagesData={data.pages}
                            imageQuality={pageSettings.quality}
                            totalPages={data.total_pages}
                            setIndexCallback={index => setCurrentIndex(index)}
                            links={data.links}
                            currentIndex={currentIndex}
                        />
                    }
                </div>
            </div>
        </div>
    )
}


export default Section;
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getBookInstance } from '../../actions/bookActions';
import { animated, useTransition } from 'react-spring';
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaChevronRight,
         FaChevronLeft } from 'react-icons/fa';
import './Book.css';
import { useClientRect } from '../../helpers/hooks';
import { Link } from 'react-router-dom';
import BookTabs from './BookTabs/BookTabs';


const Book = ({ currentBook, hideImagePortal }) => {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState({});
    const [currentImageCoords, setCurrentImageCoords] = useState(null);
    
    useEffect(() => {
        getBookInstance(bookId).then(data => {
            setBookData(data);
        }).catch(e => {
            console.log(e);
        });
    }, [bookId]);

    // const [imageRef, imageClientRect] = useClientRect();

    const imageRef = useCallback(node => {
        if (node !== null && currentBook.imageCoords) {
            const imageClientRect = node.getBoundingClientRect();
            const imageWidthRatio = imageClientRect.width / (currentBook.imageCoords.width || 1);
            const imageCoords = {
                top: imageClientRect.top,
                left: imageClientRect.left,
                width: imageClientRect.width,
                height: imageWidthRatio * currentBook.imageCoords.height
            };
            setCurrentImageCoords(imageCoords)
        }
    }, [])

    const transitionsImage = currentBook.imageCoords
        ? useTransition(currentImageCoords, {
            from: () => {
                if (currentBook.imageCoords) {
                    return {
                        position: 'fixed',
                        width: currentBook.imageCoords.width,
                        height: currentBook.imageCoords.height,
                        top: currentBook.imageCoords.top,
                        left: currentBook.imageCoords.left,
                    }
                };
                return {
                    position: 'static'
                };
            },
            enter: () => async (next) => {
                if (currentImageCoords !== null) {
                    console.log(currentImageCoords.width, currentImageCoords.height, currentImageCoords.top);
                    await next({
                        width: currentImageCoords.width,
                        height: currentImageCoords.height, //сделать определение ширины на мобилках и поставить top left в 0
                        top: currentImageCoords.top,
                        left: currentImageCoords.left,
                        config: {
                            mass: 1,
                            tension: 290,
                            friction: 40
                        }
                    });
                }
                await next({
                    position: 'static',
                    width: 'auto',
                    height: 'auto'
                });
            },
            leave: {
                opacity: 0,
                config: {
                    duration: 300
                }
            }
        }) 
        : null;

    const transitionsBannerImage = useTransition(bookData.banner_image, {
        from: {
            opacity: 0, 
            width: '50%',
            height: '50%',
        },
        enter: {
            opacity: 1,
            width: '100%',
            height: '100%',
        },
        leave: {
            opacity: 0, 
            width: '50%',
            height: '50%',
        }
    });

    return (
        bookData.name ?
        <div className="book">
            <div className="book-header">
                <div className="book-header-banner">
                    {
                        transitionsBannerImage((styles, item) => 
                            item &&
                            <animated.div style={styles} className="img-wrapper">
                                <div className="img-inner">
                                    <img src={item} alt={bookData.book_name} />
                                </div>
                            </animated.div>
                            
                        )
                    }
                </div>
            </div>
            <div className="book-content">
                <div className="book-info">
                    <div className="book-info-img flex-center" ref={imageRef}>
                        {
                            transitionsImage
                                ? transitionsImage((styles, item) => 
                                    item &&
                                    <animated.img 
                                        style={styles} 
                                        src={bookData.extra.image} 
                                        alt="Обложка" 
                                        onLoad={hideImagePortal}
                                    />
                                ) 
                                : <img src={bookData.extra.image} alt="Обложка" />
                        }
                    </div>
                    <div className="book-info-others">
                        {
                            bookData.book_after.id &&
                            <div className="book-next">
                                <Link to={'/books/' + bookData.book_after.id} >
                                    <span className="text">{bookData.book_after.name}</span>
                                    <span className="icon"><FaLongArrowAltLeft /></span>
                                </Link>
                            </div>
                        }
                        {
                            bookData.book_before.id &&
                            <div className="book-prev">
                                <Link to={'/books/' + bookData.book_before.id} >
                                    <span className="icon"><FaLongArrowAltRight /></span>
                                    <span className="text">{bookData.book_before.name}</span>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
                <BookTabs bookData={bookData} />
                {/* <BookSections sections={bookData.sections} /> */}
            </div>
        </div> : null
    );
}


export default Book;
import React, { useEffect, useRef, useState } from "react";
import BookSections from "./BookSections";
import BookDescription from "./BookDescription";


const setComponents = bookData => ([
    {
        component: <BookSections sections={bookData.sections} />,
        button: "Главы",
    },
    {
        component: <BookDescription 
            description={bookData.description} 
            numberOfPages={bookData.number_of_pages}
            datePublication={bookData.date_publication}
            bookName={bookData.book_name}
            name={bookData.name}
            genres={bookData.genre}
        />,
        button: "Описание"
    }
]);

const BookTabs = ({ bookData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState(setComponents(bookData));
    const [currentTabNameCoords, setCurrentTabNameCoords] = useState({
        left: 0,
        width: 0
    });
    const firstTabNameRef = useRef();

    useEffect(() => {
        setItems(setComponents(bookData));
    }, [bookData]);

    useEffect(() => {
        if (firstTabNameRef.current) {
            const target = firstTabNameRef.current;

            setCurrentTabNameCoords({
                width: target.offsetWidth,
                left: target.offsetLeft
            });
        }
    }, [firstTabNameRef])

    return (
        items ?
        <div className="book-tabs">
            <div className="book-tabs-buttons">
                <div className="book-tabs-buttons-items">
                    {items.map((item, i) =>
                        <button 
                            key={i} 
                            className={`tab-button${currentIndex === i ? ' active' : ''}`} 
                            ref={i === 0 ? firstTabNameRef : null}
                            onClick={(e) => {
                                setCurrentTabNameCoords({
                                    width: e.target.offsetWidth,
                                    left: e.target.offsetLeft
                                });
                                setCurrentIndex(i);
                            }}
                        >
                            {item.button}
                        </button>
                    )}
                </div>
                <div 
                    className="tab-button-indicator" 
                    style={{
                        width: currentTabNameCoords.width,
                        left: currentTabNameCoords.left
                    }}
                >
                    <div className="indicator"></div>
                </div>
            </div>
            <div className="book-tabs-content">
                {items.map((item, i) => 
                    <div 
                        key={i} 
                        className={`tab-item${currentIndex === i ? ' active' : '' }`}
                    >
                        {item.component}
                    </div>
                )}
            </div>
        </div>
        : null
    )
}


export default BookTabs;
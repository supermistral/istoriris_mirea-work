import React, { useEffect, useState } from "react";
import { animated, useTransition } from 'react-spring';
import { AiOutlineSwap } from 'react-icons/ai';


const SORTING_KEYS = {
    date: 'date'
};

const getSortingText = sortingKey => {
    const { key, isAsc } = sortingKey;
    switch (key) {
        case SORTING_KEYS.date:
            return isAsc ? "Сначала старые" : "Сначала новые";
    }
    return "";
};


const BookSections = ({ sections }) => {
    if (!Array.isArray(sections) || sections.length === 0) {
        return null;
    }

    const [sortingKey, setSortingKey] = useState({
        key: SORTING_KEYS.date,
        isAsc: false
    });
    const [sortingSections, setSortingSections] = useState(sections); 

    const transitionsSections = useTransition(sortingSections, {
        keys: item => item.id,
        from: {
            transform: 'translateY(-80%)',
            opacity: 0
        },
        enter: {
            transform: 'translateY(0%)',
            opacity: 1,
        },
        leave: {
            transform: 'translateY(-80%)',
            opacity: 0,
            delay: 0
        },
        config: {
            mass: 1,
            tension: 250,
            friction: 27,
        },
        trail: 80,
        delay: 400
    });

    const transititonsSortingText = useTransition(sortingKey, {
        from: item => ({
            position: 'absolute',
            transform: `translateY(${item.isAsc ? -100 : 100}%)`,
            opacity: 0
        }),
        enter: {
            position: 'static',
            transform: `translateY(0%)`,
            opacity: 1
        },
        leave: item => ({
            position: 'absolute',
            transform: `translateY(${item.isAsc ? -100 : 100}%)`
        }),
    });

    const sortingClickHandler = () => {
        setSortingKey(prevKey => ({
            ...prevKey,
            isAsc: !prevKey.isAsc
        }));
    }

    useEffect(() => {
        const { isAsc } = sortingKey;
        setSortingSections(prevSections => prevSections.sort((a, b) => {
            const dateA = new Date(a.date_publication);
            const dateB = new Date(b.date_publication);

            return isAsc ? dateA - dateB : dateB - dateA;
        }));
    }, [sortingKey]);

    return (
        <div className="book-sections">
            <div className="sections-control">
                <div className={`sorting ${sortingKey.isAsc ? 'asc' : 'desc'}`}>
                    <button className="icon" onClick={sortingClickHandler}><AiOutlineSwap /></button>
                    {
                        transititonsSortingText((styles, item) =>
                            item.key &&
                            <animated.span className="text" style={styles}>
                                {getSortingText(item)}
                            </animated.span>
                        )
                    }
                </div>
            </div>
            <div className="sections-content">
                {
                    transitionsSections((styles, item) => 
                        item &&
                        <animated.a href={'/sections/' + item.id} style={styles} className="section-item">
                            <div className="section-item-left">
                                <div className="name">{item.name}</div>
                            </div>
                            <div className="section-item-right">
                                <div className="date">
                                    {new Date(item.date_publication).toLocaleDateString()}
                                </div>
                            </div>
                        </animated.a>
                    )
                }
            </div>
        </div>
    )
}


export default BookSections;
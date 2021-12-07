import React from 'react';
import { animated, useTransition } from 'react-spring';


const BookInfoItem = ({ type, value, field, addClass }) => {

    const values = Array.isArray(value) 
        ? value.map(item => item[field]).join(', ')
        : value;

    const transitionsAnimation = useTransition(values, {
        from: { 
            life: '0%', 
            left: '100%', 
            top: '0%', 
            opacity: 0 
        },
        enter: item => async (next) => {
            await next({ 
                opacity: 1,
                left: '0', 
                config: { duration: 300 } 
            });
            await next({ 
                opacity: 0, 
                top: '100%', 
                delay: 100, 
                config: { duration: 200 } 
            });
            await next({ life: '100%' });
        },
        leave: { life: '0%', top: '0%' },
        config: {
            duration: 400
        }
    })

    const transitions = useTransition(values, {
        from: { 
            transform: 'translateX(100%)', 
            position: 'static', 
            opacity: 0 
        },
        enter: { 
            transform: 'translateX(0)', 
            opacity: 1, 
            delay: 200 
        },
        leave: { 
            transform: 'translateX(-100%)', 
            position: 'absolute',
            opacity: 0,
            config: {
                duration: 100
            }
        },
        config: {
            duration: 300,
        },
    });

    return (
        <div className="book-info-item">
            <div className="type">{type}</div>
            <div className="value">
            {
                transitions((styles, item) =>
                    item && 
                    <animated.div style={styles} className={`value-text${addClass ? ' ' + addClass : ''}`}>{ item }</animated.div>
                )    
            }
            {
                transitionsAnimation((styles, item) =>
                    item && 
                    <animated.div style={styles} className="value-animation"></animated.div>
                )  
            }
            </div>
        </div>
    );
}


export default BookInfoItem;
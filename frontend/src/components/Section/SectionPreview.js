import React, { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';


const SectionPreview = ({ number, name, isLoad, unmountCallback, totalPages }) => {

    const [isShow, setIsShow] = useState(true);
    const [previewReady, setPreviewReady] = useState(false);
    const [ready, setReady] = useState(false);

    const setInitialState = () => {
        setIsShow(true);
        setPreviewReady(false);
        setReady(false);
    }

    const transitions = useTransition(isShow, {
        from: {
            opacity: 0
        },
        enter: {
            opacity: 1
        },
        leave: {
            opacity: 0,
        },
        config: {
            duration: 700
        },
        onRest: () => setPreviewReady(true)
    });

    const textTransitions = useTransition(previewReady && name, {
        from: {
            opacity: 0
        },
        enter: {
            opacity: 1,
        },
        config: {
            duration: 300
        },
        onRest: () => setTimeout(() => setReady(true), 1500)
    });

    useEffect(() => {
        if (ready && isLoad) {
            unmountCallback();
            setIsShow(false);
        }
    }, [isLoad, ready]);

    useEffect(() => {
        if (!isLoad) {
            console.log("!isload")
            setInitialState();
        }
    }, [isLoad]);

    return transitions((styles, item) => 
        item &&
        <animated.div className="preview" style={styles}>
            {textTransitions((textStyles, name) =>
                name && 
                <animated.div className="preview-text" style={textStyles}>
                    <div className="text">Глава {number}: {name}</div>
                    {totalPages !== undefined && totalPages === 0 && 
                        <div className="text-empty"><span>Скоро...</span></div>}
                </animated.div>
            )}
        </animated.div>
    )
}


export default SectionPreview;
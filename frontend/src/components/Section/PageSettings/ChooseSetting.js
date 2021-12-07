import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from 'react-icons/io';
import { useHistory } from "react-router";


const ChooseSetting = ({ 
    data, 
    currentIndex, 
    linkUrl, 
    searchParam,
    show,
    hide,
    isShow,
    ind
}) => {
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    const history = useHistory();
    const listRef = useRef(null);

    const updateHistory = index => {
        if (!linkUrl) {
            const params = new URLSearchParams(window.location.search);
            params.set(searchParam, index);
            history.replace({
                pathname: window.location.pathname,
                search: params.toString()
            });
        }
    }

    const itemClickHandler = e => {
        const number = e.target.dataset.number;
        updateHistory(number);
    }

    useEffect(() => {
        updateHistory(currentIndex);
    }, [currentIndex]);

    useEffect(() => {
        if (!linkUrl) {
            const params = new URLSearchParams(window.location.search);
            params.set(searchParam, currentIndex);
            history.replace({
                pathname: window.location.pathname,
                search: params.toString()
            });
        }
    }, [currentIndex]);

    const changeHandler = useCallback(e => {
        if (e.target.nodeName !== "INPUT")  {
            if (e.target.className == "choose-list-item") {
                e.preventDefault();
            }
            return;
        }
        if (e.target.checked) {
            isShow ? hide() : show();
        } else {
            hide();
        }
    }, [isShow]);

    useEffect(() => {
        if (isShow) {
            listRef.current.style.maxHeight = listRef.current.scrollHeight + "px";
        } else {
            listRef.current.style.maxHeight = null;
        }
    }, [isShow]);

    return (
        <label className="choose" onClick={changeHandler}>
            <div className="choose-panel">
                <div className="text">
                    {data[currentIndex].text}
                </div>
                <div className="icon">
                    <IoMdArrowDropdown />
                </div>
            </div>
            <input 
                type="checkbox" 
                className="choose-panel-input"
                checked={isShow}
                readOnly
            />
            <div className="choose-list" ref={listRef}>
                {
                    linkUrl 
                        ? data.map((item, i) => 
                            <Link 
                                key={i} 
                                to={linkUrl + item.id} 
                                className="choose-list-item"
                                data-number={i}
                                onClick={i === currentIndex ? () => false : itemClickHandler}
                            >
                                {item.text}
                            </Link>
                        )
                        : data.map((item, i) =>
                            <div
                                tabIndex="0"
                                key={i}
                                className="choose-list-item" 
                                data-number={i}
                                onClick={itemClickHandler}
                                disabled={i === currentIndex}
                            >
                                {item.text}
                            </div>
                        )
                }
            </div>
        </label>
    )
}


export default ChooseSetting;
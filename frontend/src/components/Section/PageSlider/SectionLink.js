import React from 'react';
import { Link } from 'react-router-dom';


const SectionLink = ({ section, isShow }) => {
    if (section === null) {
        return null;
    }

    const { id, name, number } = section;

    return (
        <div className={`slider-section-link${isShow ? '' : ' hide'}`}>
            <div className="link-text">
                <div className="text-top">Глава {number}</div>
                <div className="text-bottom">
                    <Link to={"/sections/" + id}>
                        {name}
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default SectionLink
import React from "react";
import { CgDetailsMore } from 'react-icons/cg';
import { CgArrowLeftO } from 'react-icons/cg';
import { Link } from 'react-router-dom';


const Settings = ({ book }) => {
    if (!book) {
        return null;
    }

    const { fullname, id } = book;

    return (
        <div className="settings">
            <div className="settings-panel">
                <button className="settings-item">
                    <Link to={"/books/" + id} className="link-book">
                        <div className="icon"><CgArrowLeftO /></div>
                        <div className="text">{fullname}</div>
                    </Link>
                </button>
                <button className="settings-panel-icon">
                    <span className="icon"><CgDetailsMore /></span>
                </button>
            </div>
        </div>
    )
}


export default Settings;
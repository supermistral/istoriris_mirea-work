import React from "react";
import { Link } from "react-router-dom";
import './Menu.css';
import { FiMenu } from 'react-icons/fi';


const Menu = () => {
    return (
        <div className="menu">
            <button 
                className="menu-button__mobile" 
                onClick={e => e.target.closest('.menu').classList.toggle('active')}
            >
                <FiMenu />
            </button>
            <div className="menu-container">
                <div className="menu-item">
                    <Link to="/posts/" className="menu-item-link">Новости</Link>
                </div>
                <div className="menu-item">
                    <Link to="/about/" className="menu-item-link">Об авторе</Link>
                </div>
            </div>
        </div>
    )
}


export default Menu;
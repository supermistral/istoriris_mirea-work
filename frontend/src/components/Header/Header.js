import React from 'react';
import Logo from '../../media/logo.svg';
import { Link } from 'react-router-dom';
import './Header.css';
import Menu from '../Menu/Menu';


const Header = () => {
    return (
        <div className="header">
            <div className="header-top">
                <Menu />
            </div>
            <div className="header-bottom">
                <Link to="/" className="header-link">
                    <img src={Logo} alt="Istoriris logo" />
                </Link>
            </div>
        </div>
    );
}

export default Header;
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import './index.css';


render(
    <BrowserRouter children={routes} />,
    document.getElementById('wrapper')
);
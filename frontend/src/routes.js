import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import { store } from './store/configureStore';


export const routes = (
    <Switch>
        <Route path='/'>
            <Provider store={store}>
                <App />
            </Provider>
        </Route>
    </Switch>
)

// For local build
// export const routes = (
//     <App>
//         <Home />
//     </App>
// )
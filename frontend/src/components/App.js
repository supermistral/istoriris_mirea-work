import React, { useEffect } from 'react';
import './App.css';
import { updateCurrentBook } from '../actions/pageActions';
import { connect } from 'react-redux';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import Header from './Header/Header';
import Home from './Home/Home';
import Book from './Book/Book';
import Section from './Section/Section';
import usePortal from 'react-cool-portal';
import { getAbout, getPostItem, getPosts, getSection } from '../actions/bookActions';
import Posts from './Posts/Posts';
import PostItem from './PostItem/PostItem';
import About from './About/About';


const App = ({
    page, 
    updateCurrentBook, 
    book, 
    getSection, 
    getPosts, 
    getPostItem,
    getAbout
}) => {
    const location = useLocation();
    const { Portal, show, hide } = usePortal({ defaultShow: false });
    const history = useHistory();

    const imageLoadHandler = () => {
        const { id } = page.currentBook;
        if (typeof id !== "undefined") {
            history.push(`/books/${id}`);
        }
    }
    
    return (
        <div id="content">
            <div className="main-page">
                <Header />
                <Switch location={location}>
                    <Route exact path='/'>
                        <Home 
                            updateCurrentBook={updateCurrentBook} 
                            currentBookNumber={page.currentBook.number}
                            showImagePortal={show}
                        />
                    </Route>
                    <Route path='/books/:bookId'>
                        <Book 
                            currentBook={page.currentBook} 
                            hideImagePortal={hide}
                        />
                    </Route>
                    <Route path='/sections/:sectionId'>
                        <Section 
                            getSection={getSection} 
                            data={book.data}
                            isLoading={book.isLoading}
                        />
                    </Route>
                    <Route path='/posts/:slug'>
                        <PostItem
                            getPostItem={getPostItem}
                            data={book.data}
                            isLoading={book.isLoading}
                            error={book.error}
                        />
                    </Route>
                    <Route path='/posts'>
                        <Posts
                            getPosts={getPosts}
                            data={book.data}
                            isLoading={book.isLoading}
                            error={book.error}
                        />
                    </Route>
                    <Route path='/about/'>
                        <About
                            getAbout={getAbout}
                            data={book.data}
                            isLoading={book.isLoading}
                            error={book.error}
                        />
                    </Route>
                    {/* <Route component={NotFound} /> */}
                </Switch>
                {
                    page.currentBook.extra &&
                    <Portal>
                        <img 
                            src={page.currentBook.extra.image} 
                            style={{
                                position: 'fixed',
                                width: page.currentBook.imageCoords.width,
                                height: page.currentBook.imageCoords.height,
                                top: page.currentBook.imageCoords.top,
                                left: page.currentBook.imageCoords.left
                            }} 
                            onLoad={imageLoadHandler} 
                        />
                    </Portal>
                }
            </div>
        </div>
    )
}

const mapStateToProps = store => {
    return {
        page: store.page,
        book: store.book,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateCurrentBook: data => dispatch(updateCurrentBook(data)),
        getSection: (urlArg, callback) => dispatch(getSection(urlArg, callback)),
        getPosts: () => dispatch(getPosts()),
        getPostItem: slug => dispatch(getPostItem(slug)),
        getAbout: () => dispatch(getAbout()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
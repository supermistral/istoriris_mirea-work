import React, { useEffect, useState } from "react";
import { getBooks } from "../../actions/bookActions";
import BookSlider from "./BookSlider/BookSlider";
import './Home.css';


const Home = ({ updateCurrentBook, currentBookNumber, showImagePortal }) => {
    const [data, setData] = useState({ slides: [], slidesInfo: [] });

    useEffect(() => {
        getBooks().then(booksData => {
            setData({
                slides: booksData.map(item => item.extra),
                slidesInfo: booksData.map(item => item)
            });
        }).catch(e => {
            console.log(e);
        });
    }, []);

    return (
        <div className="home-content">
            <BookSlider 
                slides={data.slides} 
                slidesInfo={data.slidesInfo} 
                updateCurrentBook={updateCurrentBook}
                currentBookNumber={currentBookNumber}
                showImagePortal={showImagePortal}
            />
        </div>
    );
}

export default Home;
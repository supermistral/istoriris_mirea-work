import React from "react";


const BookDescription = ({ 
    description, 
    numberOfPages, 
    datePublication,
    name,
    bookName,
    genres
}) => {

    return (
        <div className="description-content">
            <div className="title">
                <div className="title-name">
                    {bookName}: {name}
                </div>
            </div>
            <div className="description">{description}</div>
            <div className="others">
                <div className="item-name-list">
                    <div className="item-name">Жанры</div>
                    <div className="item-name">Выпуск</div>
                    <div className="item-name">Страниц</div>
                </div>
                <div className="item-value-list">
                    <div className="item-value">{genres.map(item => item.name).join(" | ")}</div>
                    <div className="item-value">{"с " + datePublication}</div>
                    <div className="item-value">{numberOfPages}</div>
                </div>
            </div>
        </div>
        
    )
}


export default BookDescription;
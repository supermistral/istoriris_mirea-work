import React, { useEffect } from "react";
import { useParams } from "react-router";
import { MdDateRange, MdKeyboardReturn } from 'react-icons/md';
import "./PostItem.css";
import { SERVER_SITE_URL } from "../../constants/global";
import { Link } from "react-router-dom";


const PostItem = ({ getPostItem, data, isLoading, error }) => {
    
    const { slug } = useParams();
    
    useEffect(() => {
        getPostItem(slug);
    }, [slug]);

    return (
        <div className="posts">
            <div className="posts-container">
                {
                    isLoading || typeof data.tags === "undefined" ? <div className="loading">Загрузка...</div>
                    : error ? <div className="error">Ошибка: {error}</div>
                    : <div className="post">
                        <div className="post-return-button">
                            <Link to="/posts/" className="return-link">
                                <span className="icon"><MdKeyboardReturn /></span> 
                                К списку новостей</Link>
                        </div>
                        <div className="post-container">
                            <div className="post-title">
                                <div className="post-title-tags">
                                    Темы: {data.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                                </div>
                                <div className="post-title-date">
                                    {data.go_live_at && 
                                        <>
                                            <span className="icon"><MdDateRange /></span>
                                            <span className="date">{new Date(data.go_live_at).toLocaleDateString()}</span>
                                            <span className="time">{new Date(data.go_live_at).toLocaleTimeString().slice(0, -3)}</span>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="post-content">
                                {data.content.map((block, i) => 
                                    <div key={i} className="post-content-item">
                                    {block.type === "text"
                                        ? <div className="text" dangerouslySetInnerHTML={{__html: block.value}}></div>
                                        : <p className="image">
                                            <img src={SERVER_SITE_URL + block.value.image.src} alt={block.value.image.alt} /> 
                                        </p> 
                                    }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>  
                }
            </div>
        </div>
    )
}


export default PostItem;
import React, { useEffect } from "react";
import { SERVER_SITE_URL } from "../../constants/global";
import './About.css';


const About = ({ getAbout, data, isLoading, error }) => {

    useEffect(() => getAbout(), []);

    return (
        <div className="posts about">
            <div className="posts-container">
                {
                    isLoading || typeof data.title === "undefined" ? <div className="loading">Загрузка...</div>
                    : error ? <div className="error">Ошибка: {error}</div>
                    : <div className="post">
                        <div className="post-container">
                            <div className="post-title">
                                {data.title}
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


export default About;
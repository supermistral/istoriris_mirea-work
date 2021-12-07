import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './Posts.css';


const Posts = ({ isLoading, error, data, getPosts }) => {
    useEffect(() => getPosts(), []);

    return (
        <div className="posts">
            <div className="posts-container">
                <div className="posts-header">
                    <div className="posts-header-title">Новости</div>
                    <div className="posts-header-info">Анонсы, объявления и статьи о творчестве</div>
                </div>
                {
                    isLoading || typeof data.items === "undefined" 
                    ? <div className="loading">Загрузка...</div>
                    : error ? <div className="error">{error}</div>
                    : <div className="posts-list">
                        {data.items.map((post, i) =>
                            <div key={i} className="post-list-item">
                                <Link to={`/posts/${post.slug}/`} className="post-link">
                                    <div className="post-info">
                                        <div className="post-info-tags">
                                            {post.tags.map((tag, j) => 
                                                <div key={j} className="tag">{tag}</div>
                                            )}
                                        </div>
                                        <div className="post-info-time">
                                        {
                                            post.go_live_at &&
                                            <span className="time">
                                                <span className="meta-text">от</span>
                                                <span className="text">
                                                    {new Date(post.go_live_at).toLocaleDateString()}
                                                </span>
                                            </span>
                                        }
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}


export default Posts;
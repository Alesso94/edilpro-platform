import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Reviews = ({ professional, onAddReview }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddReview({
            professionalId: professional.id,
            rating,
            comment,
            authorName
        });
        setRating(0);
        setComment('');
        setAuthorName('');
    };

    return (
        <div className="reviews-section">
            <h4>Aggiungi una Recensione</h4>
            <form onSubmit={handleSubmit}>
                <div className="stars-container">
                    {[...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                />
                                <FaStar
                                    className="star"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={25}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Il tuo nome"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <textarea
                        placeholder="La tua recensione"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Invia Recensione</button>
            </form>
        </div>
    );
};

export default Reviews;
import React, { useState } from 'react';
import './Teampage.css';
import Modal from 'react-modal';
import { FaLinkedin } from 'react-icons/fa';

import moatezImg from '../assets/moatez.jpg';
import achrafImg from '../assets/achraf.jpg';
import akramImg from '../assets/akram.jpg';
import oussamaImg from '../assets/oussama.jpg';

Modal.setAppElement('#root');

const TeamPage = () => {
  const teamMembers = [
    { id: 1, name: "Moatez Tilouche", position: "Frontend Developer", image: moatezImg, linkedin: "https://www.linkedin.com/" },
    { id: 2, name: "Achraf Laajimi", position: "Devops Master", image: achrafImg, linkedin: "https://www.linkedin.com/" },
    { id: 3, name: "Med Akram Nsir", position: "UI/UX Designer", image: akramImg, linkedin: "https://www.linkedin.com/" },
    { id: 4, name: "Oussama Laajili", position: "Backend Developer", image: oussamaImg, linkedin: "https://www.linkedin.com/" }
  ];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');

  const openModal = (member) => {
    setSelectedMember(member);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setRating(0);
    setHoveredRating(0);
    setMessage('');
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_name: selectedMember.name,
          rating,
          message
        })
      });

      if (response.ok) {
        alert(`Thanks for your ${rating}-star rating!`);
        closeModal();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error.');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Welcome to Mawamiz Team</h1>
        <p>Meet our talented team members</p>
      </header>

      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={member.id} style={{ animationDelay: `${index * 0.2}s` }}>
            <img src={member.image} alt={member.name} className="team-img" />
            <h3 className="team-name">{member.name}</h3>
            <p className="team-position">{member.position}</p>
            <div className="social-links">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <button className="rate-btn" onClick={() => openModal(member)}>⭐ Rate</button>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <div className="popup-container">
          <h3>Rate {selectedMember?.name}</h3>
          <p className="subtitle">How was your experience working with them?</p>

          <div className="stars">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <span
                key={starValue}
                className={`star ${starValue <= (hoveredRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Optional feedback (e.g., 'They were collaborative and met deadlines efficiently!')"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <div className="buttons">
            <button className="submit-btn" onClick={handleSubmit} disabled={rating === 0}>Submit Rating</button>
            <button className="later-btn" onClick={closeModal}>Remind Me Later</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamPage;

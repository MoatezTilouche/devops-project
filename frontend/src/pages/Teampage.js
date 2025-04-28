import React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import './Teampage.css';

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Moatez Tilouche",
      position: "Frontend Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      linkedin: "https://www.linkedin.com/"
    },
    {
      id: 2,
      name: "Achraf Laajimi",
      position: "Devops Master",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      linkedin: "https://www.linkedin.com/"
    },
    {
      id: 3,
      name: "Med Akram Nsir",
      position: "UI/UX Designer",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      linkedin: "https://www.linkedin.com/"
    },
    {
      id: 4,
      name: "Oussama Laajili",
      position: "Backend Developer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      linkedin: "https://www.linkedin.com/"
    }
  ];

  return (
    <div className="container">
      <header>
        <h1>Welcome to Mawamiz Team</h1>
        <p>Meet our talented team members</p>
      </header>

      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div 
            className="team-card" 
            key={member.id}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <img src={member.image} alt={member.name} className="team-img" />
            <h3 className="team-name">{member.name}</h3>
            <p className="team-position">{member.position}</p>
            <div className="social-links">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
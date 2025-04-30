// src/pages/CommunityPage.js
import React, { useEffect, useState } from 'react';
import './CommunityPage.css';
import userImg from '../assets/user.jpg';

import { FaThumbsUp, FaEyeSlash } from 'react-icons/fa';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ auteur: '', subject: '', description: '' });
  const [replyVisibility, setReplyVisibility] = useState({});
  const [replyInput, setReplyInput] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/post')
      .then(res => res.json())
      .then(data => setPosts(data.reverse()))
      .catch(err => console.error('Failed to fetch posts:', err));
  }, []);

  const handleSubmit = async () => {
    const { auteur, subject, description } = form;
    if (!auteur || !subject || !description) return;

    const payload = { auteur, subject, description };

    try {
      const res = await fetch('http://localhost:5000/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const created = await res.json();
      if (res.ok) {
        setPosts([{ ...payload, _id: created._id, responses: [], created_at: new Date(), likes: 0 }, ...posts]);
        setForm({ auteur: '', subject: '', description: '' });
      }
    } catch (e) {
      console.error('Request failed:', e);
    }
  };

  const handleReplySubmit = async (postId) => {
    const reply = replyInput[postId];
    if (!reply?.author || !reply?.message) return;

    try {
      const res = await fetch(`http://localhost:5000/api/post/${postId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply),
      });

      if (res.ok) {
        const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              responses: [...(post.responses || []), { ...reply, timestamp: new Date() }]
            };
          }
          return post;
        });
        setPosts(updatedPosts);
        setReplyInput({ ...replyInput, [postId]: { author: '', message: '' } });
      }
    } catch (e) {
      console.error('Reply failed:', e);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/post/${postId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPosts(posts.filter(post => post._id !== postId));
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return { ...post, likes: (post.likes || 0) + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="feed-container">
      <div className="feed-header">Community Feed</div>

      <div className="new-post">
        <img src={userImg} alt="Anonymous" />
        <div style={{ flex: 1 }}>
          <input type="text" placeholder="Your name" value={form.auteur} onChange={(e) => setForm({ ...form, auteur: e.target.value })} />
          <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea rows="3" placeholder="Write your post here..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      {posts.map((post) => (
        <div className="post" key={post._id}>
          <div className="post-header">
            <img src={userImg} alt="avatar" />
            <div>
              <strong>{post.auteur}</strong><br />
              <span className="post-meta">{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div className="post-content">
            <strong>{post.subject}</strong>
            <p>{post.description}</p>
          </div>
          <div className="post-actions">
            <span onClick={() => handleLike(post._id)} style={{ cursor: 'pointer' }}><FaThumbsUp /> {post.likes || 0}</span>
            <span onClick={() => setReplyVisibility(prev => ({ ...prev, [post._id]: !prev[post._id] }))} style={{ cursor: 'pointer' }}>💬 Reply</span>
            <span onClick={() => handleDeletePost(post._id)} style={{ cursor: 'pointer' }}><FaEyeSlash /> Hide</span>
          </div>
          {post.responses && post.responses.length > 0 && (
            <div className="post-replies">
              {post.responses.map((res, i) => (
                <div key={i} className="reply">
                  <strong>{res.author}</strong>: {res.message} <br />
                  <span className="post-meta">{new Date(res.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          {replyVisibility[post._id] && (
            <div className="reply-box" >
              <input type="text" placeholder="Your name" value={replyInput[post._id]?.author || ''} onChange={(e) => setReplyInput({ ...replyInput, [post._id]: { ...replyInput[post._id], author: e.target.value } })} />
              <input type="text" placeholder="Your reply" value={replyInput[post._id]?.message || ''} onChange={(e) => setReplyInput({ ...replyInput, [post._id]: { ...replyInput[post._id], message: e.target.value } })} />
              <button onClick={() => handleReplySubmit(post._id)}>Send</button>

            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommunityPage;

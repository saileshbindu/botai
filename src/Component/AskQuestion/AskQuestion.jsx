import React, { useState, useEffect } from 'react';
import './AskQuestion.css';
import profileImg from '../../assets/images/profileImg.png';
import editImg from '../../assets/images/edit.png';
import personImg from '../../assets/images/person.png';
import likeImg from '../../assets/images/like.png';
import delikeImg from '../../assets/images/dislike.png';
import ideaImg from '../../assets/images/feedback.png';

function AskQues() {
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [view, setView] = useState('current');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const closeModal = () => {
    setFeedbackOpen(false);
    setIsRatingOpen(false);
    setFeedbackText('');
    setSelectedAnswer(null);
  };
  useEffect(() => {
    fetch('/sampleData.json')
      .then(response => response.json())
      .then(mockData => setData(mockData))
      .catch(error => console.error('Error loading data:', error));

    const loadedChats = JSON.parse(localStorage.getItem('savedChats') || '[]');
    setSavedChats(loadedChats.sort((a, b) => b.id - a.id));
  }, []);

  const handleAsk = () => {
    const result = data.find(item => item.question.toLowerCase() === question.toLowerCase());
    if (result) {
      setChat([...chat, { 
        id: Date.now(),
        question, 
        answer: result.answer, 
        rating: 0, 
        feedback: '', 
        time: new Date().toLocaleString()
      }]);
    } else {
      setChat([...chat, { 
        id: Date.now(),
        question, 
        answer: "Sorry, I couldn't find an answer to that question.", 
        rating: 0, 
        feedback: '', 
        time: new Date().toLocaleString()
      }]);
    }
    setQuestion('');
    setShowInitialContent(false);
  };

  const handleSaveChat = () => {
    if (chat.length > 0) {
      const newSavedChats = [{ id: Date.now(), chat }, ...savedChats];
      setSavedChats(newSavedChats);
      localStorage.setItem('savedChats', JSON.stringify(newSavedChats));
      setChat([]);
      setShowInitialContent(true);
      alert("Chat saved!");
    } else {
      alert("No chat to save!");
    }
  };

  const handleNewChat = () => {
    setChat([]);
    setView('current');
    setShowInitialContent(true);
  };

  const handleHistory = () => {
    setView('history');
  };

  const handleRating = (chatItemId, rating) => {
    if (view === 'current') {
      const updatedChat = chat.map(item => 
        item.id === chatItemId ? { ...item, rating } : item
      );
      setChat(updatedChat);
    } else {
      const updatedSavedChats = savedChats.map(savedChat => ({
        ...savedChat,
        chat: savedChat.chat.map(item => 
          item.id === chatItemId ? { ...item, rating } : item
        )
      }));
      setSavedChats(updatedSavedChats);
      localStorage.setItem('savedChats', JSON.stringify(updatedSavedChats));
    }
    closeModal();
  };

  const handleFeedback = (chatItemId) => {
    setSelectedAnswer(chatItemId);
    setFeedbackOpen(true);
  };

  const handleRatingfun = (chatItemId) => {
    setSelectedAnswer(chatItemId);
    setIsRatingOpen(true);
  };

  const submitFeedback = () => {
    if (view === 'current') {
      const updatedChat = chat.map(item => 
        item.id === selectedAnswer ? { ...item, feedback: feedbackText } : item
      );
      setChat(updatedChat);
    } else {
      const updatedSavedChats = savedChats.map(savedChat => ({
        ...savedChat,
        chat: savedChat.chat.map(item => 
          item.id === selectedAnswer ? { ...item, feedback: feedbackText } : item
        )
      }));
      setSavedChats(updatedSavedChats);
      localStorage.setItem('savedChats', JSON.stringify(updatedSavedChats));
    }
    closeModal();
  };

  return (
    <div className='main'>
      <div className='mainLeft'>
        <div className="navTop">
          <div className="navMain">
            <img src={profileImg} alt='Profile' />
            <h2 onClick={handleNewChat}>New Chat</h2>
            <img src={editImg} alt='Edit Profile' onClick={handleNewChat} />
          </div>
          <button 
            className="btn"
            onClick={handleHistory}
          >
            Past Conversations
          </button>
        </div>
      </div>
      <div className='mainRight'>
        <div className="mainPage">
          <h2>Bot AI</h2>
          {view === 'current' && showInitialContent && (
            <div>
              <div className="imgMain">
                <h1>How Can I Help You Today?</h1>
                <img src={profileImg} alt='Profile' />
              </div>
              <div className='question'>
                <div className='queInner'>
                  <h3>Hi, what is the weather</h3>
                  <p>Get immediate AI generated response</p>
                </div>
                <div className='queInner'>
                  <h3>Hi, what is my location</h3>
                  <p>Get immediate AI generated response</p>
                </div>
                <div className='queInner'>
                  <h3>Hi, what is the temperature</h3>
                  <p>Get immediate AI generated response</p>
                </div>
                <div className='queInner'>
                  <h3>Hi, how are you</h3>
                  <p>Get immediate AI generated response</p>
                </div>
              </div>
            </div>
          )}

          <div className='historySection'>
            {view === 'current' && !showInitialContent && (
              <div className='historyItem'>
                {chat.map((item) => (
                  <div key={item.id} className="mt-2 p-2 bg-gray-50 rounded">
                    <div className='profileDisplay'>
                      <img src={profileImg} alt="profile" /><p><strong>You:</strong> {item.question}</p>
                    </div>
                    <div className='profileDisplay'>
                      <img src={personImg} alt="profile" /> <p><strong>Soul AI:</strong> {item.answer}</p>
                    </div>
                    <div className='feedbackMain'>
                      <p>{item.time}</p>
                      <div>
                        <button onClick={() => handleRatingfun(item.id)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                          <img src={likeImg} alt="Like" />
                        </button>
                      </div>
                      <div>
                        <button onClick={() => handleFeedback(item.id)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                          <img src={delikeImg} alt="Dislike" />
                        </button>
                      </div>
                    </div>
                    {isRatingOpen && selectedAnswer === item.id && (
                      <div className="modal">
                        <div className="modal-content" style={{ marginLeft:"20px", cursor:"pointer"}}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => handleRating(item.id, star)}
                              className="cursor-pointer text-2xl"
                              style={{ color: star <= item.rating ? "gold" : "gray" }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

{feedbackOpen && selectedAnswer === item.id &&  (
                  <div className="modal">
                    <div className="modal-content">
                      <div>
                        <div className='feedbackImg'>
                          <img src={ideaImg} alt="Feedback" /> 
                          <p className="mb-4">Provide additional feedback</p>
                        </div>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full p-2 border rounded mb-4"
                          rows="4"
                        />
                        <div className="flex justify-end">
                          <button onClick={submitFeedback} className="feedbackBtn">Submit Feedback</button>
                          <button onClick={closeModal} className="feedbackBtn">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                  </div>
                  
                ))}
               
              </div>
            )}
            {view === 'history' && (
              <div>
                {savedChats.map((savedChat) => (
                  <div key={savedChat.id}>
                    <h3 style={{ paddingLeft: "30px" }}>Chat {new Date(savedChat.id).toLocaleString()}</h3>
                    {savedChat.chat.map((item) => (
                      <div key={item.id} className='historyItem'>
                        <div className='profileDisplay'>
                          <img src={profileImg} alt="profile" /><p><strong>You:</strong> {item.question}</p>
                        </div>
                        <div>
                          <div className='profileDisplay'>
                            <img src={personImg} alt="profile" /> <p><strong>Soul AI:</strong> {item.answer}</p>
                          </div>
                          <div>
                            <div className="flex items-center mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  onClick={() => handleRating(item.id, star)}
                                  className="cursor-pointer text-2xl"
                                  style={{ color: star <= item.rating ? "gold" : "gray" }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p><strong>Feedback:</strong> {item.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {view === 'current' && (
            <div className='container'>
              <div className='mainSearch'>
                <input
                  type='text'
                  className='input'
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button onClick={handleAsk}>Ask</button>
                <button onClick={handleSaveChat}>Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AskQues;

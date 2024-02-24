import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import io from 'socket.io-client';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const decoded = jwtDecode(localStorage.getItem('token'));
  console.log(decoded);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      const username = decoded.login;
      newSocket.emit('joinQuiz', id, username);
  });

    newSocket.on('userJoined', (user) => {
      setConnectedUsers(prevUsers => [...prevUsers, user]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const checkQuizExists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setQuizData(data);
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error while fetching quiz:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (socket) {
      checkQuizExists();
    }
  }, [id, navigate, socket]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h2>Bienvenue sur votre quiz : {quizData.title}</h2>
        {quizData && (
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                {quizData.questions.map((question, index) => (
                  <th key={index}>Question {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {connectedUsers.map((user, userIndex) => (
                <tr key={userIndex}>
                  <td>{user}</td>
                  {quizData.questions.map((question, questionIndex) => (
                    <td key={questionIndex}>
                        
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default Quiz;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../components/store';
import './ProfilePage.css';
import user from '../../assets/user.svg';
import airbean from '../../assets/airBeanLogoDark.svg';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const token = useAuthStore(state => state.token);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showModal, setShowModal] = useState(!token && !localStorage.getItem('token')); 
  const username = useAuthStore(state => state.username);
  const userEmail = useAuthStore(state => state.email); 

  useEffect(() => {
    if (token) {
      fetchOrderHistory();
    }
  }, [token]);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('https://airbean-api-xjlcn.ondigitalocean.app/api/user/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrderHistory(data.orderHistory);
      } else {
        throw new Error('Unable to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://airbean-api-xjlcn.ondigitalocean.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await response.json();
      if (data.success) {
        useAuthStore.setState({ token: data.token, userId: data.userId, username: data.username, email: email });
        setShowModal(false); 
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://airbean-api-xjlcn.ondigitalocean.app/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await response.json();
      if (data.success) {
        useAuthStore.setState({ token: data.token, userId: data.userId, username: data.username, email: email }); 
        setErrorMessage('Account created successfully. Please log in.');
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  
  const calculateTotalSpent = () => {
    if (!orderHistory || orderHistory.length === 0) return 0;
    const totalSpent = orderHistory.reduce((accumulator, order) => accumulator + order.total, 0);
    return totalSpent;
  };

  return (
    <div className="profile-page">
      {showModal && (
        <div className="profile-modal">
          <div className="profile-modal-content" onClick={e => e.stopPropagation()} >
            <div className='profile-titles'> 
                <div> 
                  <img src={airbean} />
                <h1>Välkommen till AirBean-familjen!</h1>
                <p>Genom att skapa ett konto nedan kan du spara och se din orderhistorik.</p>
                </div>
            </div>
            <h2>{isLogin ? 'Logga in' : 'Skapa konto'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleSignup}>
              <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit">{isLogin ? 'Logga in' : 'Skapa konto'}</button>
            </form>
            <p className="login-or-signup" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Skapa ett konto' : 'Har du redan ett konto? Logga in'}
            </p>
          </div>
        </div>
      )}
      {token && orderHistory && (
        <div className='order-list'>
          <div className='order-img'> 
            <img src={user}/>
            </div>
            <div className='order-mail'> 
              {username && <div>Användare: {username}</div>}
              {userEmail && <div>{userEmail}</div>} 
            </div>
          <h2>Orderhistorik</h2>
          <ul>
            {orderHistory.map(order => (
              <li key={order.orderNr}>
                <div className='orderhistory'>
                    <div>#{order.orderNr}</div>
                    <div> {order.orderDate}</div>
                </div>
                <div className='orderhistory'>
                    <div>Total ordersumma</div>
                    <div>{order.total} kr</div>
                </div>
              </li>
            ))}
          </ul>
          <div className='orderhistory'>
                <p>Totalt spenderat</p>
                <p>{calculateTotalSpent()} kr</p>
        
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

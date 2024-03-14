import React from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import './OrderStatusPage.css';
import droner from '../../assets/droner.svg';

function OrderStatusPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const orderNr = searchParams.get('orderNr');
  const eta = searchParams.get('eta');

  const handleGoBack = () => {
    navigate('/profile'); 
  };

  return (
    <div className="order-status-page">
        <div className='order-info'>
                <p>Ordernummer: #{orderNr}</p>
                <img src={droner} alt="droner" />
      <h1>Din beställning är påväg!</h1>
      <p>{eta} minuter</p>
      <button className='cool-btn' onClick={handleGoBack} >Ok, cool!</button>
        </div>
  
    </div>
  );
}

export default OrderStatusPage;

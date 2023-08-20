import React from 'react';

const MainProductCard = ({
  productId,
  name,
  price,
  cashbackAmount,
  maxRedeemableTokens,
  imageUrl
}) => {
  const cardStyle = {
    border: '1px solid #fff',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px',
    width: 'calc(33.33% - 40px)',
    boxSizing: 'border-box',
    display: 'inline-block',
    verticalAlign: 'top',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    backgroundColor: '#000',
  };

  const imageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px', // Set a fixed height to create a square container
    overflow: 'hidden',
    borderRadius: '10px',
    border: '1px solid #ccc', // Added border
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '15px'
  };



  const handleButtonClick1 = () => {
    window.location.href = `/AfterCash?cash=${price}&coins=${cashbackAmount}&productId=${productId}`;
  };

  const handleButtonClick2 = () => {
    window.location.href = `/Redeem?cash=${price}&coins=${cashbackAmount}&productId=${productId}&maxRedeemableTokens=${maxRedeemableTokens}`;
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img src={imageUrl} alt={name} style={imageStyle} />
      </div>
      <h3 style={{ margin: '15px 0', fontSize: '18px' }}>{name}</h3>
      <p style={{ margin: '10px 0', fontSize: '16px' }}>
        Price: ${price}<br />
        Cashback: {cashbackAmount} FlipCoins<br />
        Redeemable Coins: {maxRedeemableTokens}
      </p>
      <button style={buttonStyle} onClick={handleButtonClick1}>Buy with ${price}</button>
      <br />
      <button style={buttonStyle} onClick={handleButtonClick2}>
        Buy With ${price - maxRedeemableTokens} + {maxRedeemableTokens} FlipCoins
      </button>
    </div>
  );
};

export default MainProductCard;

import React from 'react';

const ProductCard = ({
  productId,
  name,
  price,
  cashbackAmount,
  maxRedeemableTokens,
  imageUrl
}) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px',
    width: '320px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const imageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px', // Set a fixed height to create a square container
    overflow: 'hidden',
    borderRadius: '10px'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px'
  };

  const handleButtonClick = () => {
    window.location.href = `/Addr?Addr=${productId - 1}`;
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img src={imageUrl} alt={name} style={imageStyle} />
      </div>
      <h3 style={{ marginTop: '15px', marginBottom: '10px' }}>{name}</h3>
      <p>
        Product ID: {productId}<br />
        Price: {price}<br />
        Cashback: {cashbackAmount}<br />
        Redeemable Tokens: {maxRedeemableTokens}
      </p>
      <button style={buttonStyle} onClick={handleButtonClick}>
        Learn More
      </button>
    </div>
  );
};

export default ProductCard;

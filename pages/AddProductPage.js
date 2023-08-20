// import React, { useState, useEffect } from 'react';
// import { useWeb3Contract, useMoralis } from 'react-moralis';
// import main from '../contracts/main.json';
// import Header from '../components/Header'

// const AddProductPage = () => {
//   const { isWeb3Enabled } = useMoralis();
//   const mainaddress = '0xFb13a718757131B902E0F963d5916C1578B7dFe6';

//   const [productName, setProductName] = useState('');
//   const [price, setPrice] = useState('');
//   const [cashbackAmount, setCashbackAmount] = useState('');
//   const [maxRedeemableTokens, setMaxRedeemableTokens] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [isTransactionPending, setIsTransactionPending] = useState(false);
//   const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);

//   const handleNewNotification = () => {
//     dispatch({
//       type: 'info',
//       message: '',
//       title: 'Added Product!',
//       position: 'topR',
//       icon: 'bell',
//     });
//   };

//   const handleSuccess = async (tx) => {
//     try {
//       await tx.wait(1);
//       handleNewNotification(tx);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const {
//     runContractFunction: addProduct,
//     isFetching,
//     isLoading,
//   } = useWeb3Contract({
//     abi: main,
//     contractAddress: mainaddress,
//     functionName: 'addProduct',
//     params: {
//         productName:productName,
//         price:price,
//         cashbackAmount: cashbackAmount,
//         maxRedeemableTokens : maxRedeemableTokens,
//         imageUrl: imageUrl
//     },
//   });


//   async function updateUIValues() {
//     // Update UI as needed
//   }

//   useEffect(() => {
//     if (isWeb3Enabled) {
//       updateUIValues();
//     }
//   }, [isWeb3Enabled]);





//   return (
//     <div>
//         <Header />
//       <h1>Add Product</h1>
//       <form>
//       <input
//           type="text"
//           placeholder="Product Name"
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Cashback Amount"
//           value={cashbackAmount}
//           onChange={(e) => setCashbackAmount(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Max Redeemable Tokens"
//           value={maxRedeemableTokens}
//           onChange={(e) => setMaxRedeemableTokens(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={imageUrl}
//           onChange={(e) => setImageUrl(e.target.value)}
//         />
// <button
//                 // className={styles1.trybtn}
//                 disabled={
//                    isLoading || isFetching
//                 }
//                 onClick={async () =>
//                   await addProduct({
//                     onSuccess: handleSuccess,
//                     onError: (error) => console.log(error),
//                   })
//                 }
//               >
//                 {' '}
//                 {isLoading || isFetching ? (
//                   <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full '></div>
//                 ) : (
//                   'Add Product'
//                 )}
//               </button>
//       </form>
//     </div>
//   );
// };

// export default AddProductPage;


// ...........-=================


import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import main from '../contracts/main.json';
import Header from '../components/Header'

const AddProductPage = () => {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
  const mainaddress = '0xFb13a718757131B902E0F963d5916C1578B7dFe6';

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [cashbackAmount, setCashbackAmount] = useState('');
  const [maxRedeemableTokens, setMaxRedeemableTokens] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: '',
      title: 'Added Product!',
      position: 'topR',
      icon: 'bell',
    });
  };

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

  const [bal, setbal] = useState(null);

  const {
    runContractFunction: addProduct,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: 'addProduct',
    params: {
      productName: productName,
      price: price,
      cashbackAmount: cashbackAmount,
      maxRedeemableTokens: maxRedeemableTokens,
      imageUrl: imageUrl,
    },
  });

  const { runContractFunction: showBalance1, isFetching11, isLoading11 } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getBalance",
    params: {account},
  });

  async function updateUIValues() {
    const newbal = await showBalance1();
    setbal(newbal.toString());
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  return (
    <>
    <Header />

    <div style={balanceStyle}>
        Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
      </div>
   
    <div style={containerStyle}>
      
      <h1 style={headingStyle}>Add Product</h1>
      <form style={formStyle}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          style={inputStyle}
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          style={inputStyle}
          type="number"
          placeholder="Cashback Amount"
          value={cashbackAmount}
          onChange={(e) => setCashbackAmount(e.target.value)}
        />
        <input
          style={inputStyle}
          type="number"
          placeholder="Max Redeemable Tokens"
          value={maxRedeemableTokens}
          onChange={(e) => setMaxRedeemableTokens(e.target.value)}
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          style={buttonStyle}
          disabled={isLoading || isFetching}
          onClick={async () =>
            await addProduct({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error),
            })
          }
        >
          {isLoading || isFetching ? (
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
          ) : (
            'Add Product'
          )}
        </button>
      </form>
    </div> </>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
};

const headingStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputStyle = {
  padding: '10px',
  marginBottom: '10px',
  width: '100%',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  marginTop: '15px',
};

const balanceStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '4px',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '20px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

export default AddProductPage;




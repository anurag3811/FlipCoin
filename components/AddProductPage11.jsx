// import React, { useState } from 'react';
// import { useWeb3Contract } from "react-moralis";
// import main from "../contracts/main.json";

// const AddProductPage = () => {
//   const { account } = useMoralis();
//   const mainaddress = "0xf77028A875b2eeFf9147124Ea36114751Ac81a48";
  
//   const [productName, setProductName] = useState('');
//   const [price, setPrice] = useState('');
//   const [cashbackAmount, setCashbackAmount] = useState('');
//   const [maxRedeemableTokens, setMaxRedeemableTokens] = useState('');
//   const [imageUrl, setImageUrl] = useState('');


//   const { runContractFunction: addProduct, isFetching, isLoading } = useWeb3Contract({
//     abi: main,
//     contractAddress: mainaddress,
//     functionName: "addProduct",
//     params: {productName, price, cashbackAmount, maxRedeemableTokens,imageUrl},
//   });

//   async function updateUIValues() {

//   }

//   useEffect(() => {
//     if (isWeb3Enabled) {
//       updateUIValues();
//     }
//   }, [isWeb3Enabled]);

//   const handleSuccess = async (tx) => {
//     try {
//       await tx.wait(1);
//       updateUIValues();
//       handleNewNotification(tx);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Add Product</h1>
//       <form>
//         <input
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
//         <button type="button" onClick={handleAddProduct}>
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProductPage;



import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import main from '../contracts/main.json';

const AddProductPage = () => {
  const { isWeb3Enabled } = useMoralis();
  const mainaddress = '0xFb13a718757131B902E0F963d5916C1578B7dFe6';

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [cashbackAmount, setCashbackAmount] = useState('');
  const [maxRedeemableTokens, setMaxRedeemableTokens] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState(false);

  const { runContractFunction: addProduct, isLoading } = useWeb3Contract({
    abi: main.abi,
    contractAddress: mainaddress,
    functionName: 'addProduct',
    params: {},
  });

  async function updateUIValues() {
    // Update UI as needed
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleAddProduct = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    setIsTransactionPending(true);
    
    try {
      const tx = await addProduct(
        productName,
        price,
        cashbackAmount,
        maxRedeemableTokens,
        imageUrl
      );

      setIsTransactionPending(false);
      setIsTransactionSuccessful(true);
      
      // Wait for the transaction to be mined
      await tx.wait(1);

      updateUIValues();
    } catch (error) {
      setIsTransactionPending(false);
      setIsTransactionSuccessful(false);
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form>
      <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cashback Amount"
          value={cashbackAmount}
          onChange={(e) => setCashbackAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Redeemable Tokens"
          value={maxRedeemableTokens}
          onChange={(e) => setMaxRedeemableTokens(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAddProduct}
          disabled={isTransactionPending || isLoading}
        >
          {isTransactionPending ? 'Adding...' : 'Add Product'}
        </button>
        {isLoading ? <p>Loading...</p> : null}
        {isTransactionSuccessful ? <p>Product added successfully!</p> : null}
      </form>
    </div>
  );
};

export default AddProductPage;

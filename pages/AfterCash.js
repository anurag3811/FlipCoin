import React from 'react';
import { useRouter } from "next/router";
import Header from '../components/Header'

import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import main from "../contracts/main.json"


const AfterCash = () => {
    const router = useRouter();
    const cashValue = router.query.cash;
    const coinsValue = router.query.coins;
    const productId = router.query.productId;

    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const mainaddress = "0xFb13a718757131B902E0F963d5916C1578B7dFe6";
    const [bal, setbal] = useState(null);

    const handleNewNotification = () => {
        dispatch({
          type: 'info',
          message: '',
          title: 'redeemed',
          position: 'topR',
          icon: 'bell',
        });
      };


      const {
        runContractFunction: giveCashback,
        isFetching1,
        isLoading1,
      } = useWeb3Contract({
        abi: main,
        contractAddress: mainaddress,
        functionName: 'giveCashback',
        params: {
            user: account, 
            amount: coinsValue, 
            productId:productId
        },
      });

    const { runContractFunction: showBalance1, isFetching, isLoading } = useWeb3Contract({
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
    
      const handleSuccess = async (tx) => {
        try {
          await tx.wait(1);
          updateUIValues();
          handleNewNotification(tx);
        } catch (error) {
          console.log(error);
        }
      };

    console.log(router.query)
  return (
    <>
    <Header />
    <div style={balanceStyle}>
        Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
      </div>
    <div style={containerStyle}>

      <div style={confirmationStyle}>
        Redirected to payment gateway and collected cash payment of ${cashValue} for productId {productId}
      </div>
      <div style={messageStyle}>
        After confirmation of cash payment
      </div>
      {/* <button style={claimButtonStyle}>Claim Cashback of {coinsValue} FlipCoins</button> */}
      <button
                // className={styles1.trybtn}
                style={claimButtonStyle}
                disabled={
                   isLoading1 || isFetching1
                }
                onClick={async () =>{await giveCashback({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                  })
                 
                } 
                }
              >
                {' '}
                {isLoading || isFetching ? (
                  <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full '></div>
                ) : (
                    `Claim Cashback of ${coinsValue} FlipCoins`
                )}</button>
    </div>
    </>

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

const confirmationStyle = {
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
};

const messageStyle = {
  fontSize: '18px',
  marginBottom: '20px',
};

const claimButtonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
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

export default AfterCash;

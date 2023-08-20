import { useRouter } from "next/router";
import React from 'react';
// import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import main from "../contracts/main.json"
import { useEffect, useState } from "react";
import MainProductCard from '../components/MainProductCard';



const Addr = () => {
  const { query } = useRouter(); // Destructure query from the router

  const pid = query.Addr; // Access the Addr query parameter
  console.log(query.Addr);

  const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
const mainaddress = "0xFb13a718757131B902E0F963d5916C1578B7dFe6";
const [bal, setbal] = useState(null);
const [all, setall] = useState(null);

const { runContractFunction: getAllProducts, isFetching1, isLoading1 } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getAllProducts",
    params: {},
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

    const newall = await getAllProducts();
    setall(newall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const product = all ? all[pid] : null


  return (
  <>
      <Header />
      <div style={balanceStyle}>
        Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
      </div>

    {all? (    <MainProductCard
              key={1}
              productId={product[0].toString()}
              name={product[1].toString()}
              price={product[2].toString()}
              cashbackAmount={product[3].toString()}
              maxRedeemableTokens={product[4].toString()}
              imageUrl={product[5].toString()}
            />):(<div> Loading ... </div>) }



      {/* <div>{pid ? pid : ""}</div> */}
      </>
  );
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

export default Addr;

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '../components/Header'
import { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import main from "../contracts/main.json"
import ProductCard from '../components/ProductCard'; 

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
  const mainaddress = "0xFb13a718757131B902E0F963d5916C1578B7dFe6";
  const [bal, setbal] = useState(null);
  const [all, setall] = useState(null);


  const { runContractFunction: showBalance1, isFetching, isLoading } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getBalance",
    params: {account},
  });

  const { runContractFunction: getAllProducts, isFetching1, isLoading1 } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getAllProducts",
    params: {},
  });

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

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      updateUIValues();
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

console.log(all == null ? "": all['0'][1]);
  return (
    <>
    <Header />
    <div style={balanceStyle}>
        Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
      </div>
    {all ? (
        <div className="pb-20 grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 w-full ml-2">
          {all.map((product, index) => (
            <ProductCard
              key={index}
              productId={product[0].toString()}
              name={product[1].toString()}
              price={product[2].toString()}
              cashbackAmount={product[3].toString()}
              maxRedeemableTokens={product[4].toString()}
              imageUrl={product[5].toString()}
            />
          ))}
        </div>
      ) : (
        <div>LOADING ... </div>
      )}
    </>
  )



}


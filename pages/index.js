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

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
  // const chainId = parseInt(chainIdHex);
  const mainaddress = "0x530Ff5e44aa56F8192b273555A6796639C043550";
  const [query, setquery] = useState("");
  const [arr1, setarr1] = useState([]);

  const { runContractFunction: getRecords, isFetching, isLoading } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getRecords",
    params: { item:query },
  });

  async function updateUIValues() {
    const finalarr = await getRecords();
    // const visitortemp = await getprofiles(account);
    setarr1(finalarr);
    // setvisitor(visitortemp);
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

  
console.log(arr1);
  return (
    <>
<Header />
<div className='flex justify-center'>
<input
          placeholder="Search by Item Number"
          onChange={(e) => setquery(e.target.value)}
          className="p-4 rounded-full  w-96 mt-8 mb-14"
          style={{ backgroundColor: "#272727" }}
        />
        <button className=' ml-4 pb-8 px-5 mt-10 py-4 rounded-2xl border-solid border-2 border-white h-8'
                // className="underline"
                disabled={isLoading || isFetching}
                // value={link}
                onClick={async (e) => {
                  // setremover(e.target.value);
                  await getRecords({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                  });
                  updateUIValues();
                }}
              >
                {isLoading || isFetching ? (
                  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full "></div>
                ) : (
                  "Search"
                )}
              </button></div>

  <div class="container">
  <ul class="responsive-table">
    <li class="table-header">
      
      <div class="col col-2">Sender</div>
      <div class="col col-3">Date</div>
      <div class="col col-4">Receiver</div>
    </li>
  {arr1? (arr1.map((entry) => {
    return (
      <li class="table-row text-black ">
      <div class="col col-2 text-black" data-label="Customer Name">{entry.from}</div>
      <div class="col col-3 text-black" data-label="Amount">{(new Date(parseInt(entry.timestamp)*1000)).toDateString()}</div>
      <div class="col col-4 text-black" data-label="Payment Status">{entry.to}</div>
    </li>
    )
  })):(<li><div>Search please</div><div>Search please</div><div>Search please</div></li>)}
    
  </ul>
</div>
    </>
  )
}


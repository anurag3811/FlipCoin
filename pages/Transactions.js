import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import main from '../contracts/main.json';
import Header from '../components/Header';

const Transactions = () => {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const mainaddress = "0xFb13a718757131B902E0F963d5916C1578B7dFe6";
    const [all, setAll] = useState(null);
    const [bal, setBal] = useState(null);

    const { runContractFunction: getTransactionsByAddress, isFetching, isLoading } = useWeb3Contract({
        abi: main,
        contractAddress: mainaddress,
        functionName: "getTransactionsByAddress",
        params: {user: account},
    });

    const { runContractFunction: showBalance1, isFetching1, isLoading1 } = useWeb3Contract({
        abi: main,
        contractAddress: mainaddress,
        functionName: "getBalance",
        params: {account},
    });

    async function updateUIValues() {
        const newBal = await showBalance1();
        setBal(newBal.toString());

        const newAll = await getTransactionsByAddress();
        setAll(newAll);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled]);

    return (
        <>
            <Header />
            <div style={containerStyle}>
                <div style={balanceStyle}>
                    Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
                </div>
                <div style={transactionContainerStyle}>
                    {all ? 
                        all.map((transaction, index) => (
                            <div key={index} style={transactionStyle}>
                                <p>Transaction Timestamp: {transaction.timestamp.toString()}</p>
                                <p>Amount: {transaction.amount.toString()}</p>
                                <p>Product ID: {transaction.productId.toString()}</p>
                                <p>Redeem: {transaction.isRedeem ? 'Yes' : 'No'}</p>
                            </div>
                        )) : (<div>Loading ...</div>)
                    }
                </div>
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

const balanceStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
};

const transactionContainerStyle = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
};

const transactionStyle = {
    backgroundColor: 'darkgray',
    margin: '10px',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    textAlign: 'left',
};

export default Transactions;

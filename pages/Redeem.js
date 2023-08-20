import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import main from '../contracts/main.json';
import Header from '../components/Header'
import { useRouter } from "next/router";

const Redeem = () => {
    const router = useRouter();
    const cashValue = router.query.cash;
    const coinsValue = router.query.coins;
    const productId = router.query.productId;
    const maxRedeemableTokens = router.query.maxRedeemableTokens;

    const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
    const mainaddress = '0xFb13a718757131B902E0F963d5916C1578B7dFe6';
    const [enable, setEnable] = useState(false);

    const handleNewNotification = () => {
        dispatch({
          type: 'info',
          message: '',
          title: 'redeemed',
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

    const {
        runContractFunction: redeem,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: main,
        contractAddress: mainaddress,
        functionName: 'redeem',
        params: {
            amount: maxRedeemableTokens,
            productId: productId
        },
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled]);

    function handlenext(){
        window.location.href = `/AfterCash?cash=${cashValue}&coins=${coinsValue}&productId=${productId}`;
    }

    const [bal, setBal] = useState(null);

    const { runContractFunction: showBalance1, isFetching11, isLoading11 } = useWeb3Contract({
        abi: main,
        contractAddress: mainaddress,
        functionName: "getBalance",
        params: { account },
    });

    async function updateUIValues() {
        const newBal = await showBalance1();
        setBal(newBal.toString());
    }

    return (
        <>
            <Header />
            <div style={balanceStyle}>
                Balance: {bal == null ? "Loading..." : `${bal} FlipCoins`}
            </div>
            <div style={containerStyle}>
                <button
                    style={redeemButtonStyle}
                    disabled={isLoading || isFetching || enable}
                    onClick={async () => {
                        await redeem({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        });
                        setEnable(true);
                    }}
                >
                    {isLoading || isFetching ? (
                        <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
                    ) : (
                        `Redeem ${maxRedeemableTokens} Flipcoins!`
                    )}
                </button>
                <button
                    style={proceedButtonStyle}
                    disabled={!enable}
                    onClick={handlenext}
                >
                    Proceed to cash payment of ${cashValue - maxRedeemableTokens}
                </button>
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

const redeemButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
};

const proceedButtonStyle = {
    backgroundColor: '#ccc',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    opacity: 0.6,
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

export default Redeem;

import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import './App.css';

function App() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [betAmount, setBetAmount] = useState(0.1);
    const [betSide, setBetSide] = useState('heads');
    const [betToken, setBetToken] = useState('SOL');
    const [result, setResult] = useState(null);
    const [balance, setBalance] = useState("connect to your wallet");
    const [error, setError] = useState('');
    const [coinClass, setCoinClass] = useState('');

    useEffect(() => {
        if (publicKey && betToken === 'SOL') {
            fetchBalance();
        }
    }, [publicKey, betToken]);

    const fetchBalance = async () => {
        try {
            const accountInfo = await connection.getAccountInfo(publicKey);
            const balanceInLamports = accountInfo?.lamports || 0;
            const balanceInSOL = balanceInLamports / 1e9;
            setBalance(balanceInSOL); // Placeholder for balance
            console.log(balanceInSOL);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setError('Failed to fetch balance.');
        }
    };

    const flipCoin = () => {
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        if (betAmount > balance) {
            alert('Insufficient balance!');
            return;
        }

        setCoinClass('flip'); // Trigger the flip animation
        const randomResult = Math.random() < 0.5 ? 'heads' : 'tails';

        setTimeout(() => {
            setCoinClass(randomResult); // Apply the final result class
            setResult(randomResult);
        }, 3000); // Match with the duration of the animation
    };

    return (
        <div className="App">
            <h1>Multi-Token Coin Flip Game</h1>
            <WalletMultiButton />
            <div className="game">
                <div>
                    <label>
                        Choose Token:
                        <select
                            value={betToken}
                            onChange={(e) => setBetToken(e.target.value)}
                        >
                            <option value="SOL">SOL</option>
                            <option value="ETH">ETH</option>
                            <option value="BTC">BTC</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Bet Amount ({betToken}):
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Choose Side:
                        <select
                            value={betSide}
                            onChange={(e) => setBetSide(e.target.value)}
                        >
                            <option value="heads">Heads</option>
                            <option value="tails">Tails</option>
                        </select>
                    </label>
                </div>
                <div id="coin" className={`coin ${coinClass}`}>
                    <div className="side-a"></div>
                    <div className="side-b"></div>
                </div>
                <button className='flipbtn' onClick={flipCoin}>Flip Coin</button>
                {result && (
                    <div className="result">
                        <h2>{`The coin landed on ${result}`}</h2>
                        {result === betSide ? <p>You win!</p> : <p>You lose!</p>}
                    </div>
                )}
                {error && <p className="error">{error}</p>}
                <p>Available Balance: {balance} {betToken}</p>
            </div>
        </div>
    );
}

export default App;

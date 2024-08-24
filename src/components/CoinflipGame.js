import React, { useState, useEffect } from 'react';
import { useWallet, WalletModalProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const CoinflipGame = () => {
    const { connected, publicKey } = useWallet();
    const [token, setToken] = useState('SOL');
    const [amount, setAmount] = useState('');
    const [side, setSide] = useState('Heads');
    const [balance, setBalance] = useState(null);

    const connection = new Connection(clusterApiUrl('devnet'));

    useEffect(() => {
        if (connected && publicKey) {
            // Fetch the user's balance
            connection.getBalance(publicKey).then((bal) => {
                setBalance(bal / 1e9); // Convert from lamports to SOL
            });
        }
    }, [connected, publicKey]);

    const handleTokenChange = (e) => setToken(e.target.value);
    const handleAmountChange = (e) => setAmount(e.target.value);
    const handleSideChange = (e) => setSide(e.target.value);

    const handleCoinflip = async () => {
        if (!connected) {
            alert('Please connect your wallet first.');
            return;
        }

        const userAmount = parseFloat(amount);

        if (isNaN(userAmount) || userAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (userAmount > balance) {
            alert(`Insufficient balance. Your balance is ${balance} ${token}.`);
            return;
        }

        // Perform the coinflip (you can replace this with a smart contract call)
        const flipResult = Math.random() < 0.5 ? 'Heads' : 'Tails';

        if (flipResult === side) {
            alert(`Congratulations! You won! The coin landed on ${flipResult}.`);
            // Double the user's amount
            // Handle the logic to transfer double the amount back to the user
        } else {
            alert(`Sorry, you lost. The coin landed on ${flipResult}.`);
            // Handle the logic to deduct the user's amount
        }
    };

    return (
        <div className="coinflip-game">
            <h2>Coinflip Game</h2>

            <div>
                <label>Select Token:</label>
                <select value={token} onChange={handleTokenChange}>
                    <option value="SOL">SOL</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                </select>
            </div>

            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                />
            </div>

            <div>
                <label>Select Side:</label>
                <select value={side} onChange={handleSideChange}>
                    <option value="Heads">Heads</option>
                    <option value="Tails">Tails</option>
                </select>
            </div>

            <button onClick={handleCoinflip}>Flip Coin</button>

            {connected && balance !== null && (
                <p>Your balance: {balance} {token}</p>
            )}
        </div>
    );
};

export default CoinflipGame;

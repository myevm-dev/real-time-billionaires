import React, { useState } from "react";
import { ethers } from "ethers";

const NavBar = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>Top Billionaires</h1>
      <div>
        {walletAddress ? (
          <div style={styles.walletInfo}>
            <span>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            <button style={styles.button} onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        ) : (
          <button style={styles.button} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  title: {
    fontSize: "1.5rem",
  },
  walletInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    backgroundColor: "#0070f3",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default NavBar;

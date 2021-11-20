import React, { useState } from 'react';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Counter from './artifacts/contracts/Counter.sol/Counter.json';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

// Update with the contract address logged out to the CLI when it was deployed
const greeterAddress = '0x86B2cf34879b30ad5cE3aF1A65557343beD9314d';
const counterAddress = '0x3B25D7c71E379849De842c8fB6EF8784C2B8b646';

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('');
  const [contractGreeting, setContractGreeting] = useState('');
  const [contractCounter, setContractCounter] = useState(0);

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log('data: ', data);
        setContractGreeting(data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  const getCounter = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        counterAddress,
        Counter.abi,
        provider
      );
      try {
        const data = await contract.getCount();
        console.log('data: ', data.toString());

        setContractCounter(data.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  };

  const increment = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(counterAddress, Counter.abi, signer);
      const transaction = await contract.increment();
      await transaction.wait();
      getCounter();
    }
  };

  const decrement = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(counterAddress, Counter.abi, signer);
      const transaction = await contract.decrement();
      await transaction.wait();
      getCounter();
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder='Set greeting'
        />
        {contractGreeting && contractGreeting}
      </header>
      <div>Counter</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={getCounter}>Get Counter</button>
      {contractCounter && contractCounter}
    </div>
  );
}

export default App;

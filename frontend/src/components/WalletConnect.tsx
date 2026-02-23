import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            fetchBalance(accounts[0]);
          }
        });
    }

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBalance = async (addr: string) => {
    if (!window.ethereum) return;
    try {
      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest']
      });
      const ethBalance = (parseInt(bal, 16) / 1e18).toFixed(4);
      setBalance(ethBalance);
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAddress(accounts[0]);
      fetchBalance(accounts[0]);

      // Switch to Base Sepolia
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x14a34' }], // 84532 in hex
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x14a34',
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org']
            }]
          });
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance('0');
    setShowDropdown(false);
    // Note: MetaMask doesn't support programmatic disconnect for security reasons
    // User must disconnect manually from MetaMask extension
    alert('Disconnected from app. To fully disconnect, go to MetaMask → Connected sites → Disconnect');
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert('Address copied!');
    }
  };

  if (address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-6 py-2 bg-white border border-app-border text-text-main rounded-xl font-medium hover:bg-app-hover transition-all flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-app-border rounded-xl shadow-floating p-4 z-50">
            <div className="mb-3">
              <div className="text-xs text-text-pale mb-1">Address</div>
              <div className="font-mono text-sm break-all">{address}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-xs text-text-pale mb-1">Balance</div>
              <div className="font-bold">{balance} ETH</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={copyAddress}
                className="w-full px-4 py-2 bg-app-hover text-text-main rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Copy Address
              </button>
              <button
                onClick={disconnect}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={connect}
      disabled={isConnecting}
      className="px-6 py-2 bg-accent-indigo text-white rounded-xl font-medium hover:shadow-premium transition-all disabled:opacity-50"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

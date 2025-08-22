'use client';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { TldParser, NetworkWithRpc } from '@onsol/tldparser';
import { getAddress } from 'ethers';

export default function DomainDisplay() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDomainData = async (userAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      // Configure Monad connection
      const RPC_URL = 'https://testnet-rpc.monad.xyz';
      const settings = new NetworkWithRpc('monad', 10143, RPC_URL);
      const parser = new TldParser(settings, 'monad');
      
      // Get the name record for the main domain
      const nameRecord = await parser.getMainDomain(getAddress(userAddress));
      
      if (nameRecord) {
        setDomainData({
          domain: `${nameRecord.domain_name}${nameRecord.tld}`,
          createdAt: new Date(nameRecord.created_at * 1000).toLocaleDateString(),
          expiresAt: new Date(nameRecord.expires_at * 1000).toLocaleDateString(),
          isTransferrable: nameRecord.transferrable
        });
      } else {
        setDomainData(null);
      }
    } catch (err) {
      console.error('Error fetching domain:', err);
      setError('Failed to fetch domain. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchDomainData(address);
    } else {
      setDomainData(null);
    }
  }, [isConnected, address]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Monad Domains</h1>
      
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-300">
            Connected: {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2 text-white">Loading domain...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 p-2 bg-red-900/20 rounded">{error}</div>
          ) : domainData ? (
            <div className="p-4 bg-gray-700 rounded space-y-2">
              <h2 className="text-lg font-semibold text-white">Your Monad Domain</h2>
              <p className="text-blue-300 text-xl">{domainData.domain}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-3">
                <div>
                  <span className="font-medium">Created:</span> {domainData.createdAt}
                </div>
                <div>
                  <span className="font-medium">Transferrable:</span> 
                  <span className={domainData.isTransferrable ? 'text-green-400' : 'text-red-400'}>
                    {domainData.isTransferrable ? ' Yes' : ' No'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-700 rounded text-white">
              No Monad domain found for this address
            </div>
          )}
          
          <button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
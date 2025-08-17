import { ReactNode, createContext, useContext, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface OnchainKitProviderProps {
  children: ReactNode;
}

export function OnchainKitProvider({ children }: OnchainKitProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connect = async () => {
    setIsConnecting(true);
    try {
      // Try Farcaster authentication first
      if (typeof sdk !== 'undefined') {
        try {
          const fid = await sdk.context.user.fid;
          if (fid) {
            // Generate a deterministic address based on FID for demo
            // In production, you'd use proper Farcaster auth
            const fidAddress = "0x" + fid.toString(16).padStart(40, '0');
            setAddress(fidAddress);
            console.log('🎯 Connected via Farcaster with FID:', fid);
            return;
          }
        } catch (farcasterError) {
          console.log('⚠️ Farcaster auth not available, using demo wallet');
        }
      }
      
      // Fallback to demo wallet for development
      const demoAddress = "0x" + Math.random().toString(16).substr(2, 40);
      setAddress(demoAddress);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnect = () => {
    setAddress(null);
  };
  
  const value: WalletContextType = {
    address,
    isConnected: !!address,
    isConnecting,
    connect,
    disconnect,
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useAccount must be used within OnchainKitProvider');
  }
  return context;
}

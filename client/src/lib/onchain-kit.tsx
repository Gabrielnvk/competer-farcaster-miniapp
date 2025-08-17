import { ReactNode, createContext, useContext, useState } from 'react';

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
      // Simulate wallet connection for demo purposes
      // In production, this would integrate with actual wallet providers
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

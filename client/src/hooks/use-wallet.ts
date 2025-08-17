import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useAccount } from "@/lib/onchain-kit";

export function useWallet() {
  const { address, isConnected, isConnecting, connect, disconnect } = useAccount();

  // Fetch or create user when wallet is connected
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/wallet", address],
    queryFn: async () => {
      if (!address) throw new Error("No wallet address");
      
      try {
        const response = await apiRequest("GET", `/api/users/wallet/${address}`);
        return response.json();
      } catch (error) {
        // User doesn't exist, create them
        const createResponse = await apiRequest("POST", "/api/users", {
          walletAddress: address,
          username: address.slice(0, 8) + "...",
        });
        return createResponse.json();
      }
    },
    enabled: !!address && isConnected,
  });

  return {
    address,
    isConnected,
    isConnecting,
    user,
    userLoading,
    connect,
    disconnect,
  };
}

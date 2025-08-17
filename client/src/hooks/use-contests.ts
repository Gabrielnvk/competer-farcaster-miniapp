import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contest, InsertContest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useContests(filters?: { status?: string; category?: string }) {
  return useQuery<Contest[]>({
    queryKey: ["/api/contests", filters?.status, filters?.category],
  });
}

export function useContest(id: string) {
  return useQuery<Contest>({
    queryKey: ["/api/contests", id],
    enabled: !!id,
  });
}

export function useCreateContest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contestData: InsertContest) => {
      const response = await apiRequest("POST", "/api/contests", contestData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contests"] });
    },
  });
}

export function useJoinContest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contestId, userId, entryTxHash }: {
      contestId: string;
      userId: string;
      entryTxHash?: string;
    }) => {
      const response = await apiRequest("POST", `/api/contests/${contestId}/join`, {
        userId,
        entryTxHash,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contests", variables.contestId] });
      queryClient.invalidateQueries({ queryKey: ["/api/contests"] });
    },
  });
}

export function usePlatformStats() {
  return useQuery<{
    totalPrizes: number;
    activeContests: number;
    totalParticipants: number;
    contestsCompleted: number;
  }>({
    queryKey: ["/api/stats"],
  });
}

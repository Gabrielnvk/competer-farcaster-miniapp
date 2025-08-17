import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/lib/onchain-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contest, ContestParticipant } from "@shared/schema";
import { Link } from "wouter";
import { Users, Trophy, Clock, DollarSign } from "lucide-react";

export default function MyContests() {
  const { address, isConnected } = useAccount();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/wallet", address],
    enabled: !!address,
  });

  // Fetch created contests
  const { data: createdContests, isLoading: loadingCreated } = useQuery<Contest[]>({
    queryKey: ["/api/users", user?.id, "created-contests"],
    enabled: !!user?.id,
  });

  // Fetch participated contests
  const { data: participatedContests, isLoading: loadingParticipated } = useQuery<Contest[]>({
    queryKey: ["/api/users", user?.id, "participated-contests"],
    enabled: !!user?.id,
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              You need to connect your wallet to view your contests.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Contests</h1>
          <p className="text-gray-300 text-lg">
            Manage your created contests and track your participation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* My Created Contests */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Created Contests</h2>
              <Link href="/create">
                <Button className="btn-accent" data-testid="create-new-contest">
                  Create New
                </Button>
              </Link>
            </div>
            
            {loadingCreated ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-primary animate-pulse h-48" data-testid="created-contest-skeleton">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : createdContests?.length === 0 ? (
              <Card className="text-center py-8" data-testid="no-created-contests">
                <CardContent>
                  <p className="text-gray-600 mb-4">You haven't created any contests yet.</p>
                  <Link href="/create">
                    <Button className="btn-accent">Create Your First Contest</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4" data-testid="created-contests-list">
                {createdContests?.map((contest) => (
                  <Card key={contest.id} className="card-primary border-l-4 border-l-accent" data-testid="created-contest-item">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-primary" data-testid="created-contest-title">
                            {contest.title}
                          </h4>
                          <p className="text-gray-600 text-sm" data-testid="created-contest-status">
                            {contest.status} • {contest.category}
                          </p>
                        </div>
                        <Badge className={
                          contest.status === "active" ? "bg-success text-success-foreground" :
                          contest.status === "completed" ? "bg-gray-500 text-white" :
                          "bg-secondary text-secondary-foreground"
                        }>
                          {contest.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-accent flex items-center justify-center">
                            <DollarSign size={16} className="mr-1" />
                            {parseFloat(contest.prizePool).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Prize Pool</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary flex items-center justify-center">
                            <Users size={16} className="mr-1" />
                            0
                          </div>
                          <div className="text-xs text-gray-500">Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {contest.maxParticipants}
                          </div>
                          <div className="text-xs text-gray-500">Max Participants</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          className="flex-1 btn-secondary" 
                          size="sm"
                          data-testid="manage-contest-button"
                        >
                          Manage Contest
                        </Button>
                        <Button 
                          className="flex-1 bg-gray-200 text-primary hover:bg-gray-300" 
                          size="sm"
                          data-testid="view-submissions-button"
                        >
                          View Submissions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* My Entered Contests */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Entered Contests</h2>
            
            {loadingParticipated ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-primary animate-pulse h-48" data-testid="participated-contest-skeleton">
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : participatedContests?.length === 0 ? (
              <Card className="text-center py-8" data-testid="no-participated-contests">
                <CardContent>
                  <p className="text-gray-600 mb-4">You haven't joined any contests yet.</p>
                  <Link href="/">
                    <Button className="btn-accent">Explore Contests</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4" data-testid="participated-contests-list">
                {participatedContests?.map((contest) => (
                  <Card key={contest.id} className="card-primary border-l-4 border-l-success" data-testid="participated-contest-item">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-primary" data-testid="participated-contest-title">
                            {contest.title}
                          </h4>
                          <p className="text-gray-600 text-sm" data-testid="participated-contest-position">
                            {contest.status === "active" ? "Contest in progress" : "Contest completed"}
                          </p>
                        </div>
                        <Badge className={
                          contest.status === "active" ? "bg-success text-success-foreground" :
                          contest.status === "completed" ? "bg-gray-500 text-white" :
                          "bg-accent text-accent-foreground"
                        }>
                          {contest.status === "active" ? "ACTIVE" : 
                           contest.status === "completed" ? "COMPLETED" : "IN PROGRESS"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-accent flex items-center justify-center">
                            <Trophy size={16} className="mr-1" />
                            ${parseFloat(contest.prizePool).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Potential Prize</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary flex items-center justify-center">
                            <Clock size={16} className="mr-1" />
                            {contest.status === "active" ? "Active" : "Ended"}
                          </div>
                          <div className="text-xs text-gray-500">Status</div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full btn-success" 
                        size="sm"
                        data-testid="view-contest-button"
                      >
                        {contest.status === "active" ? "View Contest" : "View Results"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ContestCard from "@/components/contest-card";
import { Link } from "wouter";
import { Contest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrizeRange, setSelectedPrizeRange] = useState<string>("all");
  const [freeEntryOnly, setFreeEntryOnly] = useState(false);
  const { toast } = useToast();

  // Fetch platform stats
  const { data: stats } = useQuery<{
    totalPrizes: number;
    activeContests: number;
    totalParticipants: number;
    contestsCompleted: number;
  }>({
    queryKey: ["/api/stats"],
  });

  // Fetch contests
  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ["/api/contests", selectedCategory !== "all" ? selectedCategory : undefined],
  });

  const handleJoinContest = (contestId: string) => {
    toast({
      title: "Join Contest",
      description: "Contest joining functionality will be implemented with smart contract integration.",
    });
  };

  const filteredContests = contests?.filter(contest => {
    if (freeEntryOnly && parseFloat(contest.entryFee) > 0) return false;
    if (selectedPrizeRange !== "all") {
      const prize = parseFloat(contest.prizePool);
      switch (selectedPrizeRange) {
        case "0-100":
          return prize >= 0 && prize <= 100;
        case "100-1000":
          return prize > 100 && prize <= 1000;
        case "1000-10000":
          return prize > 1000 && prize <= 10000;
        case "10000+":
          return prize > 10000;
        default:
          return true;
      }
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary py-16" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Win Big in <span className="text-accent">On-Chain</span> Contests
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Create and participate in decentralized contests with automated prize distribution on Base blockchain
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6" data-testid="stat-total-prizes">
              <div className="text-3xl font-bold text-accent">
                ${stats?.totalPrizes ? (stats.totalPrizes / 1000).toFixed(0) + "K" : "0"}
              </div>
              <div className="text-sm text-gray-200">Total Prizes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6" data-testid="stat-active-contests">
              <div className="text-3xl font-bold text-success">
                {stats?.activeContests || 0}
              </div>
              <div className="text-sm text-gray-200">Active Contests</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6" data-testid="stat-total-participants">
              <div className="text-3xl font-bold text-white">
                {stats?.totalParticipants ? (stats.totalParticipants / 1000).toFixed(1) + "K" : "0"}
              </div>
              <div className="text-sm text-gray-200">Participants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6" data-testid="stat-contests-completed">
              <div className="text-3xl font-bold text-accent">
                {stats?.contestsCompleted || 0}
              </div>
              <div className="text-sm text-gray-200">Completed</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="btn-accent transform hover:scale-105" size="lg" data-testid="explore-contests-button">
              Explore Contests
            </Button>
            <Link href="/create">
              <Button 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-lg transition-all duration-200"
                size="lg"
                data-testid="create-contest-button"
              >
                Create Contest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contest Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Active Contests</h2>
            <p className="text-gray-400">Join ongoing competitions and win prizes</p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4" data-testid="contest-filters">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-primary border-primary-light text-white" data-testid="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hackathon">Hackathons</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="sports">Sports Betting</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="prediction">Prediction Markets</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPrizeRange} onValueChange={setSelectedPrizeRange}>
              <SelectTrigger className="w-48 bg-primary border-primary-light text-white" data-testid="prize-filter">
                <SelectValue placeholder="Prize Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prizes</SelectItem>
                <SelectItem value="0-100">$0 - $100</SelectItem>
                <SelectItem value="100-1000">$100 - $1K</SelectItem>
                <SelectItem value="1000-10000">$1K - $10K</SelectItem>
                <SelectItem value="10000+">$10K+</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-lg border border-primary-light">
              <Checkbox 
                id="freeEntry" 
                checked={freeEntryOnly}
                onCheckedChange={setFreeEntryOnly}
                data-testid="free-entry-filter"
              />
              <label htmlFor="freeEntry" className="text-white text-sm cursor-pointer">
                Free Entry
              </label>
            </div>
          </div>
        </div>

        {/* Contest Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-primary animate-pulse h-80" data-testid="contest-skeleton">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-16 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center py-12" data-testid="no-contests">
            <p className="text-gray-400 text-lg mb-4">No contests match your filters</p>
            <Link href="/create">
              <Button className="btn-accent">Create the First Contest</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" data-testid="contests-grid">
            {filteredContests.map((contest, index) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onJoin={handleJoinContest}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, DollarSign, Share2 } from "lucide-react";
import { Contest } from "@shared/schema";
import { sdk } from "@farcaster/miniapp-sdk";

interface ContestCardProps {
  contest: Contest & {
    participantCount?: number;
    timeRemaining?: string;
  };
  onJoin?: (contestId: string) => void;
  featured?: boolean;
  className?: string;
}

export default function ContestCard({ contest, onJoin, featured = false, className = "" }: ContestCardProps) {
  const handleShare = async () => {
    try {
      // Try Farcaster sharing first
      if (typeof sdk !== 'undefined') {
        try {
          await sdk.actions.share({
            url: `${window.location.origin}/contest/${contest.id}`,
            text: `🏆 Check out this contest: ${contest.title}\n💰 Prize Pool: ${contest.prizePool} ETH\n🎯 ${contest.description}`
          });
          return;
        } catch (farcasterError) {
          console.log('⚠️ Farcaster share not available');
        }
      }
      
      // Fallback to Web Share API
      if (navigator.share) {
        await navigator.share({
          title: `🏆 ${contest.title}`,
          text: `Check out this contest! Prize Pool: ${contest.prizePool} ETH`,
          url: `${window.location.origin}/contest/${contest.id}`
        });
      } else {
        // Copy to clipboard fallback
        const shareText = `🏆 ${contest.title}\n💰 Prize Pool: ${contest.prizePool} ETH\n${window.location.origin}/contest/${contest.id}`;
        await navigator.clipboard.writeText(shareText);
        alert('Contest link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "upcoming":
        return "bg-secondary text-secondary-foreground";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "ACTIVE";
      case "draft":
        return "UPCOMING";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return status.toUpperCase();
    }
  };

  const cardContent = (
    <div className="card-primary h-full">
      <div className="flex justify-between items-start mb-4">
        <Badge className={getStatusColor(contest.status)} data-testid="contest-status">
          {featured ? "FEATURED" : getStatusLabel(contest.status)}
        </Badge>
        <div className="flex items-center space-x-1 text-sm">
          <Clock size={14} />
          <span className="text-success font-semibold" data-testid="contest-time-remaining">
            {contest.timeRemaining || "5d 8h left"}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-primary" data-testid="contest-title">
        {contest.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3" data-testid="contest-description">
        {contest.description}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent" data-testid="contest-prize-pool">
            ${parseFloat(contest.prizePool).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Prize Pool</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary" data-testid="contest-participants">
            {contest.participantCount || 0}
          </div>
          <div className="text-xs text-gray-500">Participants</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex items-center space-x-1">
          <DollarSign size={14} />
          <span className="text-gray-600">
            Entry Fee: {" "}
            <span className="font-semibold text-primary" data-testid="contest-entry-fee">
              {parseFloat(contest.entryFee) === 0 ? "FREE" : `${contest.entryFee} ETH`}
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Users size={14} />
          <span className="text-gray-600">
            Max: <span data-testid="contest-max-participants">{contest.maxParticipants}</span>
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          className={`flex-1 ${featured ? "gradient-secondary" : "btn-secondary"} transform hover:scale-105`}
          onClick={() => onJoin?.(contest.id)}
          disabled={contest.status === "completed" || contest.status === "cancelled"}
          data-testid="contest-join-button"
        >
          {contest.status === "completed" ? "View Results" : 
           contest.status === "draft" ? "Register for Contest" : "Join Contest"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="px-3 hover:bg-accent hover:text-accent-foreground"
          title="Share on Farcaster"
        >
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );

  if (featured) {
    return (
      <div className={`bg-gradient-to-br from-secondary to-accent p-1 rounded-xl ${className}`} data-testid="featured-contest-card">
        {cardContent}
      </div>
    );
  }

  return (
    <div className={`card-primary hover:shadow-lg transition-all duration-200 ${className}`} data-testid="contest-card">
      {cardContent}
    </div>
  );
}

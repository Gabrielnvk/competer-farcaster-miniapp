import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertContestSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "@/lib/onchain-kit";

const contestFormSchema = insertContestSchema.extend({
  duration: z.number().min(1).max(30),
}).omit({
  contractAddress: true,
  startTime: true,
  endTime: true,
  status: true,
});

type ContestFormData = z.infer<typeof contestFormSchema>;

export default function CreateContest() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeploying, setIsDeploying] = useState(false);

  const form = useForm<ContestFormData>({
    resolver: zodResolver(contestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "hackathon",
      creatorId: "", // Will be set when user connects wallet
      prizePool: "0",
      entryFee: "0",
      maxParticipants: 100,
      prizeType: "winner-takes-all",
    },
  });

  const createContestMutation = useMutation({
    mutationFn: async (data: ContestFormData) => {
      if (!isConnected || !address) {
        throw new Error("Please connect your wallet first");
      }

      // Create user if doesn't exist
      try {
        await apiRequest("POST", "/api/users", {
          walletAddress: address,
          username: address,
        });
      } catch (error) {
        // User might already exist, continue
      }

      // Get user by wallet address
      const userResponse = await apiRequest("GET", `/api/users/wallet/${address}`);
      const user = await userResponse.json();

      const contestData = {
        ...data,
        creatorId: user.id,
        startTime: new Date(),
        endTime: new Date(Date.now() + data.duration * 24 * 60 * 60 * 1000),
        status: "active" as const,
      };

      const response = await apiRequest("POST", "/api/contests", contestData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Contest Created Successfully!",
        description: "Your contest has been deployed and is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contests"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Contest",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContestFormData) => {
    setIsDeploying(true);
    try {
      await createContestMutation.mutateAsync(data);
    } finally {
      setIsDeploying(false);
    }
  };

  const watchedValues = form.watch();
  
  const calculatePrizePool = () => {
    const entryFee = parseFloat(watchedValues.entryFee || "0");
    const maxParticipants = watchedValues.maxParticipants || 0;
    return entryFee * maxParticipants;
  };

  const calculatePlatformFee = () => {
    return calculatePrizePool() * 0.02;
  };

  const calculateTotalCost = () => {
    return 2.5 + calculatePlatformFee();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              You need to connect your wallet to create contests.
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
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Contest</h1>
          <p className="text-gray-300 text-lg">
            Launch a contest, set the rules, and let the community compete for prizes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contest Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20" data-testid="contest-form">
            <CardHeader>
              <CardTitle className="text-white">Contest Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Contest Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter contest title..."
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Describe your contest..."
                            className="bg-white/20 border-white/30 text-white placeholder-gray-300 resize-none"
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hackathon">Hackathon</SelectItem>
                              <SelectItem value="gaming">Gaming</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                              <SelectItem value="creative">Creative</SelectItem>
                              <SelectItem value="prediction">Prediction</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Duration (days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="30"
                              placeholder="7"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              data-testid="input-duration"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="entryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Entry Fee (ETH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              placeholder="0.01"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                              {...field}
                              data-testid="input-entry-fee"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Max Participants</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="2"
                              placeholder="100"
                              className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              data-testid="input-max-participants"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="prizeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Prize Distribution</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                            data-testid="radio-prize-type"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="winner-takes-all" id="winner-takes-all" />
                              <label htmlFor="winner-takes-all" className="text-white cursor-pointer">
                                Winner Takes All
                              </label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="top-three" id="top-three" />
                              <label htmlFor="top-three" className="text-white cursor-pointer">
                                Top 3 Split (50% / 30% / 20%)
                              </label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="sponsor-funded" id="sponsor-funded" />
                              <label htmlFor="sponsor-funded" className="text-white cursor-pointer">
                                Sponsor Funded Prize Pool
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Preview and Submit */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20" data-testid="contest-preview">
            <CardHeader>
              <CardTitle className="text-white">Contest Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="card-primary">
                <h4 className="text-lg font-bold mb-2" data-testid="preview-title">
                  {watchedValues.title || "Your Contest Title"}
                </h4>
                <p className="text-gray-600 text-sm mb-4" data-testid="preview-description">
                  {watchedValues.description || "Contest description will appear here"}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent" data-testid="preview-prize-pool">
                      ${calculatePrizePool().toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Estimated Prize</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-secondary" data-testid="preview-max-participants">
                      {watchedValues.maxParticipants || 0}
                    </div>
                    <div className="text-xs text-gray-500">Max Participants</div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  Entry Fee: <span className="font-semibold" data-testid="preview-entry-fee">
                    {watchedValues.entryFee && parseFloat(watchedValues.entryFee) > 0 
                      ? `${watchedValues.entryFee} ETH` 
                      : "FREE"}
                  </span>
                </div>
              </div>
              
              {/* Cost Breakdown */}
              <div className="bg-dark/30 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3">Creation Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Smart Contract Deployment</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Platform Fee (2%)</span>
                    <span data-testid="preview-platform-fee">${calculatePlatformFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span data-testid="preview-total-cost">${calculateTotalCost().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isDeploying || createContestMutation.isPending}
                className="w-full gradient-secondary transform hover:scale-105"
                data-testid="button-deploy-contest"
              >
                {isDeploying ? "Deploying..." : "Deploy Contest Contract"}
              </Button>
              
              <p className="text-gray-300 text-xs text-center">
                By creating a contest, you agree to our Terms of Service and accept responsibility for prize distribution.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

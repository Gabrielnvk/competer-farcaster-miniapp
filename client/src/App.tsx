import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnchainKitProvider } from "./lib/onchain-kit";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import CreateContest from "@/pages/create-contest";
import MyContests from "@/pages/my-contests";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create" component={CreateContest} />
          <Route path="/my-contests" component={MyContests} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </OnchainKitProvider>
    </QueryClientProvider>
  );
}

export default App;

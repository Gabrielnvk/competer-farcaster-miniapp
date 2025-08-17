import { Link, useLocation } from "wouter";
import { useAccount } from "@/lib/onchain-kit";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, isConnected, connect, disconnect } = useAccount();

  const navItems = [
    { path: "/", label: "Discover" },
    { path: "/create", label: "Create" },
    { path: "/my-contests", label: "My Contests" },
  ];

  return (
    <header className="bg-primary border-b border-primary-light sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer" data-testid="logo">
                <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-white">Competer</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`font-medium transition-colors ${
                      location === item.path
                        ? "text-white"
                        : "text-gray-300 hover:text-accent"
                    }`}
                    data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Network indicator */}
            <div className="hidden sm:flex items-center space-x-2 bg-primary-light px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-gray-300">Base Network</span>
            </div>
            
            {/* Wallet connection */}
            <Button
              onClick={isConnected ? disconnect : connect}
              className="bg-gradient-to-r from-secondary to-accent hover:shadow-lg transition-all duration-200"
              data-testid="connect-wallet-button"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-light" data-testid="mobile-menu">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                    location === item.path
                      ? "text-white bg-primary-light"
                      : "text-gray-300 hover:text-accent hover:bg-primary-light"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

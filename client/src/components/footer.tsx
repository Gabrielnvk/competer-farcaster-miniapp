import { Github, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-primary-light mt-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">Competer</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The premier on-chain contest platform built on Base. Create, participate, and win in decentralized competitions with automated prize distribution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" data-testid="social-twitter">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" data-testid="social-discord">
                <span className="sr-only">Discord</span>
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" data-testid="social-github">
                <span className="sr-only">GitHub</span>
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-discover">Discover Contests</a></li>
              <li><a href="/create" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-create">Create Contest</a></li>
              <li><a href="/my-contests" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-my-contests">My Contests</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-how-it-works">How It Works</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-docs">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-contracts">Smart Contracts</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-terms">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent transition-colors" data-testid="footer-privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-light mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Competer. Built on Base blockchain with ❤️</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">Powered by</span>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-white font-medium">Base</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-white font-medium">OnchainKit</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

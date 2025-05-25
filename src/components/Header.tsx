import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <nav className="flex items-center justify-between p-6 lg:px-8">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Imaginary Sass</span>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a
          href="#features"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Pricing
        </a>
        <a
          href="#about"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          About
        </a>
        <SignedOut>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Get Started
          </button>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
                userButtonAvatarImage: "rounded-full",
                userButtonActionButton: "hidden",
                userButtonDetails: "hidden",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Search, Mic } from "lucide-react";

export default function SearchUI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Container */}
      <div className="container mx-auto pt-32 px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Search Engine
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 pr-12 py-6 rounded-full border-2 focus-visible:ring-2"
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="rounded-full px-6 py-6"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-2xl mx-auto space-y-4">
          {results.map((result, index) => (
            <Card
              key={index}
              className="p-4 hover:bg-accent cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Score: {result.score.toFixed(4)}
                </div>
                <CardTitle className="text-blue-600 hover:underline">
                  {result.title}
                </CardTitle>
                <CardDescription>
                  {result.content.length > 200
                    ? `${result.content.substring(0, 200)}...`
                    : result.content}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

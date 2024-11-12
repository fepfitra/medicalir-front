"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Heart, AlertTriangle, User, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MedicalSearchUI() {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getRiskLevelColor = (level) => {
    const level_lower = level.toLowerCase();
    if (level_lower.includes("tinggi")) return "bg-red-500";
    if (level_lower.includes("sedang")) return "bg-yellow-500";
    if (level_lower.includes("rendah")) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h1 className="text-4xl font-bold text-primary">
              Medical Information System
            </h1>
          </div>
          <p className="text-muted-foreground">
            Search for diseases, symptoms, treatments, and medical specialists
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10 py-6 rounded-lg border-2"
                placeholder="Search for diseases, symptoms, or treatments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              className="px-6 py-6"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-3xl mx-auto space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-primary">
                    {result.disease}
                  </CardTitle>
                  <Badge
                    className={`${getRiskLevelColor(result.risk_level)} text-white`}
                  >
                    Risk Level: {result.risk_level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Symptoms:</h3>
                      <p className="text-muted-foreground">{result.symptoms}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Pill className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Treatment:</h3>
                      <p className="text-muted-foreground">
                        {result.treatment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Specialist:</h3>
                      <p className="text-muted-foreground">{result.doctor}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

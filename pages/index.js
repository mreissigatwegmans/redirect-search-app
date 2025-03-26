
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RedirectSearch() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/search-redirect?source=${encodeURIComponent(sourceUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Search Redirect</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter source URL (e.g. /old-page)"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading || !sourceUrl}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p className="text-red-500">❌ {error}</p>}

      {result && (
        <Card>
          <CardContent className="p-4">
            {result.found ? (
              <div>
                <p>✅ <strong>Source:</strong> {result.source}</p>
                <p>➡️ <strong>Destination:</strong> {result.destination}</p>
              </div>
            ) : (
              <p>⚠️ No redirect found for: {result.source}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

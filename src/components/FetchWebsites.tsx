
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchWebsites } from "@/api/dataService";
import { Search } from "lucide-react";

interface FetchWebsitesProps {
  onWebsitesFetched: (websites: string[]) => void;
  isActive: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const FetchWebsites = ({ onWebsitesFetched, isActive, setIsLoading }: FetchWebsitesProps) => {
  const [country, setCountry] = useState("");
  const [stateCity, setStateCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [count, setCount] = useState(100);
  const { toast } = useToast();

  const handleFetchWebsites = async () => {
    if (!industry) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an industry keyword",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const websites = await fetchWebsites(industry, country, stateCity, count);
      onWebsitesFetched(websites);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch websites. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Fetch Websites</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Input
            id="country"
            type="text"
            placeholder="Enter country name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="state-city" className="block text-sm font-medium text-gray-700 mb-1">
            State/city keyword
          </label>
          <Input
            id="state-city"
            type="text"
            placeholder="Enter state/city"
            value={stateCity}
            onChange={(e) => setStateCity(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry keyword
          </label>
          <Input
            id="industry"
            type="text"
            placeholder="Eyeglasses store"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
            Count
          </label>
          <Input
            id="count"
            type="number"
            value={count}
            min={1}
            max={500}
            onChange={(e) => setCount(parseInt(e.target.value) || 100)}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleFetchWebsites}
          disabled={!isActive || !industry}
        >
          <Search className="mr-2 h-4 w-4" />
          Fetch Websites
        </Button>
      </div>
    </div>
  );
};

export default FetchWebsites;

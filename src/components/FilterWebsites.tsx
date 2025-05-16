
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { filterWebsites, processCSVFile } from "@/api/dataService";

interface FilterWebsitesProps {
  websites: string[];
  onWebsitesFiltered: (websites: string[]) => void;
  isActive: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const FilterWebsites = ({ websites, onWebsitesFiltered, isActive, setIsLoading }: FilterWebsitesProps) => {
  const [isDomainActive, setIsDomainActive] = useState(false);
  const [isShopify, setIsShopify] = useState(false);
  const [checkLoadTime, setCheckLoadTime] = useState(false);
  const [excludeWebsites, setExcludeWebsites] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleApplyFilters = async () => {
    if (websites.length === 0 && !csvFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No websites to filter. Please fetch websites first or upload a CSV file.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let sitesToFilter = [...websites];
      
      // If a CSV file was uploaded, process it
      if (csvFile && websites.length === 0) {
        sitesToFilter = await processCSVFile(csvFile);
      }
      
      // Create excluded websites array
      const excludedSites = excludeWebsites
        ? excludeWebsites.split(',').map(site => site.trim())
        : [];
      
      // Apply filters
      const filteredSites = await filterWebsites(sitesToFilter, {
        isDomainActive,
        isShopify,
        loadTimeCheck: checkLoadTime,
        excludedWebsites: excludedSites
      });
      
      onWebsitesFiltered(filteredSites);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to filter websites. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCsvFile(file);
    toast({
      title: "CSV Uploaded",
      description: `${file.name} uploaded successfully. Ready to filter.`,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Filter Websites</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="domain-active" 
            checked={isDomainActive} 
            onCheckedChange={(checked) => setIsDomainActive(checked === true)}
          />
          <label htmlFor="domain-active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Domain Active
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="shopify" 
            checked={isShopify} 
            onCheckedChange={(checked) => setIsShopify(checked === true)}
          />
          <label htmlFor="shopify" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Only Shopify websites
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="load-time" 
            checked={checkLoadTime} 
            onCheckedChange={(checked) => setCheckLoadTime(checked === true)}
          />
          <label htmlFor="load-time" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Loads within 5 secs
          </label>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Input
            placeholder="Exclude the websites"
            value={excludeWebsites}
            onChange={(e) => setExcludeWebsites(e.target.value)}
          />
          <p className="text-xs text-gray-500">Comma separated domains to exclude</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="csv-upload" className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded cursor-pointer transition-colors">
            Upload CSV
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            className="grow" 
            onClick={handleApplyFilters}
            disabled={!isActive && !csvFile}
          >
            Apply Filters
          </Button>
        </div>
        
        {csvFile && (
          <p className="text-xs text-green-600">
            {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
          </p>
        )}
      </div>
    </div>
  );
};

export default FilterWebsites;

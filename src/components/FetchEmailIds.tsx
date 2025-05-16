
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { extractEmails, processCSVFile } from "@/api/dataService";
import { Mail } from "lucide-react";

interface FetchEmailIdsProps {
  websites: string[];
  onEmailsExtracted: (results: Array<{website: string, emails: string[]}>) => void;
  isActive: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const FetchEmailIds = ({ websites, onEmailsExtracted, isActive, setIsLoading }: FetchEmailIdsProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // File drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current?.classList.add("bg-blue-50", "border-blue-300");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current?.classList.remove("bg-blue-50", "border-blue-300");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current?.classList.remove("bg-blue-50", "border-blue-300");
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.dataTransfer.files[0].name} is ready for processing.`,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} is ready for processing.`,
      });
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleExtractEmails = async () => {
    if (websites.length === 0 && !file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No websites to process. Please fetch and filter websites first or upload a CSV file.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let sitesToProcess = [...websites];
      
      // If a CSV file was uploaded and no websites are in the flow, process the CSV
      if (file && websites.length === 0) {
        sitesToProcess = await processCSVFile(file);
      }
      
      // Extract emails from the websites
      const results = await extractEmails(sitesToProcess);
      onEmailsExtracted(results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to extract emails. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Fetch Email IDs</h2>
      
      <div className="space-y-4">
        <div
          ref={dropAreaRef}
          className="border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseFiles}
        >
          <div className="flex flex-col items-center">
            <Mail className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Drop your CSV file here or<br />
              <span className="text-blue-500">browse files</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {websites.length > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
              Websites_filtered.csv <span className="text-green-500">({websites.length})</span>
            </div>
          )}
          {file && (
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
              {file.name}
            </div>
          )}
          {!websites.length && !file && (
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded col-span-2">
              No files selected
            </div>
          )}
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleExtractEmails}
          disabled={(!isActive && !file) || (websites.length === 0 && !file)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Fetch Email IDs
        </Button>
      </div>
    </div>
  );
};

export default FetchEmailIds;

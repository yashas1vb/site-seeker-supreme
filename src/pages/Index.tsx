
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import FetchWebsites from "@/components/FetchWebsites";
import FilterWebsites from "@/components/FilterWebsites";
import FetchEmailIds from "@/components/FetchEmailIds";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  // Global state to track the current data flow
  const [fetchedWebsites, setFetchedWebsites] = useState<string[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<string[]>([]);
  const [emailResults, setEmailResults] = useState<Array<{website: string, emails: string[]}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fetch'); // 'fetch', 'filter', 'email'
  const { toast } = useToast();

  // Handler for when websites are fetched
  const handleWebsitesFetched = (websites: string[]) => {
    setFetchedWebsites(websites);
    setActiveTab('filter');
    toast({
      title: "Websites fetched successfully",
      description: `Found ${websites.length} websites matching your criteria.`,
    });
  };

  // Handler for when websites are filtered
  const handleWebsitesFiltered = (websites: string[]) => {
    setFilteredWebsites(websites);
    setActiveTab('email');
    toast({
      title: "Websites filtered successfully",
      description: `${websites.length} websites remain after filtering.`,
    });
  };

  // Handler for when emails are extracted
  const handleEmailsExtracted = (results: Array<{website: string, emails: string[]}>) => {
    setEmailResults(results);
    toast({
      title: "Email extraction complete",
      description: `Extracted emails from ${results.length} websites.`,
    });
  };

  // Helper function to export results to CSV
  const exportToCSV = (data: Array<{website: string, emails: string[]}>) => {
    let csvContent = "Website,Email\n";
    
    data.forEach(item => {
      if (item.emails.length === 0) {
        csvContent += `${item.website},""\n`;
      } else {
        item.emails.forEach(email => {
          csvContent += `${item.website},${email}\n`;
        });
      }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "email_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fetch Websites Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FetchWebsites 
              onWebsitesFetched={handleWebsitesFetched} 
              isActive={activeTab === 'fetch'}
              setIsLoading={setIsLoading}
            />
          </div>
          
          {/* Filter Websites Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FilterWebsites 
              websites={fetchedWebsites}
              onWebsitesFiltered={handleWebsitesFiltered}
              isActive={activeTab === 'filter'}
              setIsLoading={setIsLoading}
            />
          </div>
          
          {/* Fetch Email IDs Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FetchEmailIds 
              websites={filteredWebsites}
              onEmailsExtracted={handleEmailsExtracted}
              isActive={activeTab === 'email'}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
        
        {/* Results Section */}
        {emailResults.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Results</h2>
              <Button onClick={() => exportToCSV(emailResults)}>
                <span className="mr-2">Export in CSV</span>
                <span className="text-xs">↓</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website/Email ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailResults.map((result, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.website}
                        </td>
                      </tr>
                      {result.emails.map((email, emailIndex) => (
                        <tr key={`${index}-${emailIndex}`}>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 pl-10">
                            {email}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg font-medium">Processing, please wait</p>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;

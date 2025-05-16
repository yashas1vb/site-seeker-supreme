// This file simulates the API endpoints that would connect to the Python backend
// In a real application, this would make actual HTTP requests to your backend server

/**
 * Fetches websites based on search criteria
 */
export const fetchWebsites = async (
  keyword: string, 
  country?: string, 
  location?: string, 
  count: number = 50
): Promise<string[]> => {
  // This would be an actual API call in a real app
  console.log(`Fetching websites with keyword: ${keyword}, country: ${country}, location: ${location}, count: ${count}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate results
  return Array.from({ length: count }, (_, i) => {
    const domainName = keyword.toLowerCase().replace(/\s+/g, '') + 
                     (country ? country.toLowerCase().slice(0, 2) : '') + 
                     (i + 1);
    return `${domainName}.com`;
  });
};

/**
 * Filters websites based on selected criteria
 */
export const filterWebsites = async (
  websites: string[],
  filters: {
    isDomainActive?: boolean,
    isShopify?: boolean,
    loadTimeCheck?: boolean,
    excludedWebsites?: string[]
  }
): Promise<string[]> => {
  // This would be an actual API call in a real app
  console.log(`Filtering ${websites.length} websites with filters:`, filters);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Apply mock filtering
  let filteredSites = [...websites];
  
  if (filters.isDomainActive) {
    // Simulate checking if domains are active by keeping ~70% randomly
    filteredSites = filteredSites.filter(() => Math.random() > 0.3);
  }
  
  if (filters.isShopify) {
    // Simulate checking for Shopify sites by keeping ~60% randomly
    filteredSites = filteredSites.filter(() => Math.random() > 0.4);
  }
  
  if (filters.loadTimeCheck) {
    // Simulate checking load times by keeping ~80% randomly
    filteredSites = filteredSites.filter(() => Math.random() > 0.2);
  }
  
  // Handle excluded websites
  if (filters.excludedWebsites?.length) {
    filteredSites = filteredSites.filter(site => 
      !filters.excludedWebsites?.some(exclude => 
        site.toLowerCase().includes(exclude.toLowerCase())
      )
    );
  }
  
  return filteredSites;
};

/**
 * Extracts emails from websites
 */
export const extractEmails = async (
  websites: string[]
): Promise<Array<{website: string, emails: string[]}>> => {
  // This would be an actual API call in a real app
  console.log(`Extracting emails from ${websites.length} websites`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock email results
  return websites.map(website => {
    // Generate 0-3 mock emails for each website
    const emailCount = Math.floor(Math.random() * 4);
    const emails = Array.from({ length: emailCount }, (_, i) => {
      const username = ["info", "contact", "support", "hello", "admin"][Math.floor(Math.random() * 5)];
      return `${username}@${website}`;
    });
    
    return { website, emails };
  });
};

/**
 * Processes an uploaded CSV file
 * In a real application, this would send the file to the backend
 */
export const processCSVFile = async (
  file: File
): Promise<string[]> => {
  console.log(`Processing CSV file: ${file.name}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock results from CSV
  const mockWebsitesCount = Math.floor(Math.random() * 20) + 5;
  return Array.from({ length: mockWebsitesCount }, (_, i) => `website-from-csv-${i + 1}.com`);
};

/**
 * Exports data to CSV and returns a download URL
 * In a real app, this might create the CSV server-side
 */
export const exportToCSV = (data: Array<{website: string, emails: string[]}>): string => {
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
  return URL.createObjectURL(blob);
};

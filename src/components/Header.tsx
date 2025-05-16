
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <h1 className="text-xl font-medium text-gray-800">E-Com Data Finder</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;


const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">© {currentYear} Modaka Technologies Pvt. Ltd.</p>
      </div>
    </footer>
  );
};

export default Footer;

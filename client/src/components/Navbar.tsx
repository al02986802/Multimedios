import { useState } from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // Implement search functionality
  };

  return (
    <header className="bg-white shadow-md flex justify-between items-center px-4 h-16 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-neutral-100 mr-2 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="material-icons text-neutral-400">menu</span>
        </button>
        <h1 className="text-xl font-medium text-neutral-500 flex items-center">
          <span className="material-icons text-primary mr-2">location_on</span>
          Sistema de Monitoreo de Dispositivos
        </h1>
      </div>
      <div className="flex items-center">
        <form onSubmit={handleSearch} className="relative mr-2">
          <input 
            type="text" 
            placeholder="Buscar dispositivos..." 
            className="pl-10 pr-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 hidden md:block"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-icons absolute left-3 top-2 text-neutral-400">search</span>
        </form>
        <button className="p-2 rounded-full hover:bg-neutral-100 md:hidden">
          <span className="material-icons text-neutral-400">search</span>
        </button>
        <button className="p-2 rounded-full hover:bg-neutral-100 ml-2">
          <span className="material-icons text-neutral-400">notifications</span>
        </button>
        <button className="p-2 rounded-full hover:bg-neutral-100 ml-2">
          <span className="material-icons text-neutral-400">account_circle</span>
        </button>
      </div>
    </header>
  );
}

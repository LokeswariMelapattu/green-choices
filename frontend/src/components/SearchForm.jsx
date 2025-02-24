import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

const SearchForm = ({ onSearch }) => {
  const [source, setSource] = useState('Toronto, Canada');
  const [destination, setDestination] = useState('Sydney, Australia');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(source, destination);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Find Routes</h2>
      
      <div className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Source Location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Search Routes
      </Button>
    </form>
  );
};

export default SearchForm;

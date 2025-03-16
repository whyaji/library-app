import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { ModeToggle } from './components/mode-toogle';
import api from './lib/api';

function App() {
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    async function fetchTotalBooks() {
      const response = await api.books.total.$get();
      const data = await response.json();
      setTotalBooks(data.total);
    }

    fetchTotalBooks();
  }, []);

  return (
    <div className="w-[350px] m-auto">
      <ModeToggle />
      <Card>
        <CardHeader>Total Books</CardHeader>
        <CardContent>{totalBooks}</CardContent>
      </Card>
    </div>
  );
}

export default App;

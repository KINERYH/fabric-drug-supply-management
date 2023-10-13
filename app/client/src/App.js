import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/drugs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload test.
        </p>
        <div>
          <button onClick={fetchData}>Get all drugs</button>
          <div>
            {data && (
              <pre>
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

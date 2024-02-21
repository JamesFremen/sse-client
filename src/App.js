import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      // this works when the server is running locally
      //const events = new EventSource('http://localhost:8787/events');

      // this works when the server is running on Cloudflare
      const events = new EventSource('https://sse-proto.james-fremen.workers.dev/events');

      events.onmessage = (event) => {
        console.log(`Stringified event: ${JSON.stringify(event)}`)
        console.log(`Received event: ${event.data}`)
        const parsedData = JSON.parse(event.data);
        console.log(`parsedData: ${JSON.stringify(parsedData)}`)

        setFacts((facts) => facts.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, facts]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact.info}</td>
              <td>{fact.source}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;
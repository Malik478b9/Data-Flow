// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
 
import FlowCanvas from "./components/DataLineageFlow/FlowCanvas";
import Gallery from './components/Gallery';
import ExampleOne from './components/dataLineageExamples/ExampleOne';
import ExampleTwo from './components/dataLineageExamples/ExampleTwo';
import ExampleThree from './components/dataLineageExamples/EcommerceFlow';
import ExampleFour from './components/dataLineageExamples/Telecom';
import ExampleFive from './components/dataLineageExamples/HrFlow';
import logo from './images/logo.png'; // Ensure this file exists
 
const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw",margin: 0, padding: 0  }}>
 
      {/* Header */}
      {/* <header style={{
        height: '60px',
        backgroundColor: '#216482',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: "'Nunito Sans', sans-serif"
      }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: '40px',
            position: 'absolute',
            left: '20px'
          }}
        />
 
        <h1 style={{
          color: 'white',
          fontSize: '20px',
          margin: 0
        }}>
          Data Lineage Flow
        </h1>
      </header> */}
 
      {/* Main Content */}
      <main style={{ flex: 1,  }}>
        <ReactFlowProvider>
         
          <Routes>
          <Route path="/" element={<Navigate to="/gallery" replace />} />
            <Route path="/flow" element={<FlowCanvas />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/BankFlow" element={<ExampleOne />} />
            <Route path="/gallery/PharmaFlow" element={<ExampleTwo />} />
                    <Route path="/gallery/Ecommerce" element={<ExampleThree />} />
                    <Route path="/gallery/TelecomFlow" element={<ExampleFour />} />
                    <Route path="/gallery/HRFlow" element={<ExampleFive />} />
 
 
          </Routes>
        </ReactFlowProvider>
      </main>
 
      {/* Footer */}
      <footer
  style={{
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: '32px', // reduced height
    backgroundColor: '#216482',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px', // smaller font
    fontFamily: "'Nunito Sans', sans-serif",
    padding: '4px 8px', // smaller padding
    boxSizing: 'border-box',
    cursor: 'pointer',
    zIndex: 1000,
  }}
>
  <a
    href=""
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: 'white',
      textDecoration: 'none',
      width: '100%',
      textAlign: 'center',
    }}
  >
    malik mohammed
  </a>
</footer>

    </div>
  );
};
 
export default App;
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import image1 from '../images/bankFlow.png';
import image2 from '../images/pharma.png';
import ecommerceImg from '../images/ecommerce.png';
import telecomImg from '../images/telecom.png';
import logo from '../images/logo.png';
import hrImg from '../images/hr.png';
import { Download } from 'lucide-react';
import { LineageData as BankFlowData } from './dataLineageExamples/ExampleOne'; // Import LineageData for Bank Flow
import { LineageData as PharmaFlowData } from './dataLineageExamples/ExampleTwo'; // Import LineageData for Pharma Flow
import { LineageData as EcommerceFlowData } from './dataLineageExamples/EcommerceFlow'; // Import LineageData for E-commerce Flow
import { LineageData as TelecomFlowData } from './dataLineageExamples/Telecom'; // Import LineageData for Telecom Flow
import { LineageData as HRFlowData } from './dataLineageExamples/HrFlow'; // Import LineageData for HR Flow


const imageData = [
  {
    id: 1,
    title: "Bank Flow",
    imageUrl: image1,
    route: "/gallery/BankFlow",
    description: "Visualizes financial transaction flows across banking operations, including customer channels and risk engines.",
    lastUpdatedBy: "Sarah Johnson",
    lastUpdatedDate: "May 10, 2025",
    jsonData: BankFlowData,
  },
  {
    id: 2,
    title: "Pharma Flow",
    imageUrl: image2,
    route: "/gallery/PharmaFlow",
    description: "Maps pharmaceutical supply chain processes, including regulatory compliance and distribution.",
    lastUpdatedBy: "Michael Chen",
    lastUpdatedDate: "May 7, 2025",
    jsonData: PharmaFlowData,
  },
  {
    id: 3,
    title: "E-commerce Flow",
    imageUrl: ecommerceImg,
    route: "/gallery/Ecommerce",
    description: "Tracks order processing, inventory management, and customer interactions in an e-commerce platform.",
    lastUpdatedBy: "Emily Davis",
    lastUpdatedDate: "May 5, 2025",
    jsonData: EcommerceFlowData,
  },
  {
    id: 4,
    title: "Telecom Flow",
    imageUrl: telecomImg,
    route: "/gallery/TelecomFlow",
    description: "Illustrates telecom service provisioning, billing, and network management workflows.",
    lastUpdatedBy: "Raj Patel",
    lastUpdatedDate: "May 3, 2025",
    jsonData: TelecomFlowData,
  },
  {
    id: 5,
    title: "HR Onboarding Flow",
    imageUrl: hrImg,
    route: "/gallery/HRFlow",
    description: "Details employee onboarding processes, including documentation and training workflows.",
    lastUpdatedBy: "Laura Wilson",
    lastUpdatedDate: "May 1, 2025",
    jsonData: HRFlowData,
  },
];

const Gallery = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Lineage Gallery");
  const [jsonInput, setJsonInput] = useState("");
  const customJsonRef = useRef(null); // REFERENCE TO CUSTOM CARD


  const handleDownloadJson = (e, item) => {
    e.stopPropagation(); // Prevent navigation when clicking download button
    const data = item.jsonData || {
      initialNodes: [],
      pathEdgesMap: {},
      newEdges: [],
      tracePaths: {},
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>
      {showSidebar && (
        <div style={{ backgroundColor: '#0f172a', width: '20%', height: '100vh', position: 'fixed', top: 0, left: 0, padding: '20px', color: '#e2e8f0', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            {/* <a href="https://mushroom.solutions/" target="_blank" rel="noopener noreferrer" title="Go to Mushroom Solutions">
              <img src={logo} alt="Mushroom Solutions Logo" style={{ height: '33px', cursor: 'pointer' }} />
            </a> */}

            <button onClick={() => setShowSidebar(false)} style={{ background: 'transparent', color: '#e2e8f0', border: 'none', fontSize: '20px', cursor: 'pointer' }} title="Hide Sidebar">✕</button>
          </div>
          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '16px', lineHeight: '2.2', cursor: 'pointer' }}>
            <li onClick={() => setSelectedMenu("Lineage Gallery")} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: selectedMenu === "Lineage Gallery" ? 'rgb(57 78 113)' : 'transparent', color: selectedMenu === "Lineage Gallery" ? '#fff' : '#e2e8f0' }}> FlowGenX Library</li>
            <li onClick={() => navigate("/flow")} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: currentLocation.pathname === "/flow" ? 'rgb(57 78 113)' : 'transparent', color: currentLocation.pathname === "/flow" ? '#fff' : '#e2e8f0' }}>🌐 Explore</li>
            <li
              onClick={() => {
                setSelectedMenu("Lineage Gallery");
                setTimeout(() => {
                  customJsonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100); // Slight delay to ensure gallery is rendered
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: selectedMenu === "Custom JSON Input" ? 'rgb(57 78 113)' : 'transparent',
                color: '#e2e8f0',
              }}
            >
              ✏️ Your Gallery
            </li>

          </ul>
        </div>
      )}
      <div style={{ backgroundColor: '#f9fafb', flex: 1, marginLeft: showSidebar ? '20%' : '0', padding: '20px', boxSizing: 'border-box' }}>
        {!showSidebar && (
          <div style={{ marginBottom: '15px' }}>
            <button onClick={() => setShowSidebar(true)} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' }}>☰</button>
          </div>
        )}

        {/* Hero Section */}
        <div
          style={{
            padding: "10px 30px",
            background: "linear-gradient(135deg, #1e3a8a, #0f172a)",
            color: "#ffffff",
            borderRadius: "12px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centers children horizontally
            justifyContent: "center", // optional: centers vertically if needed
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              marginBottom: "10px",
              fontWeight: 600,
              marginTop: "10px",
            }}
          >
            FlowGenX
          </h1>
          <p
            style={{
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          >
            Explore our interactive data lineage visualizations across industries. Click any card to begin tracing your data flows.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#e2e8f0',
            padding: '16px 30px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: '1.75rem',
              color: '#1e293b',
              margin: 0,
            }}
          >
            {selectedMenu}
          </h2>

          <button
            onClick={() => {
              const data = {
                initialNodes: [],
                pathEdgesMap: {},
                newEdges: [],
                tracePaths: {},
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "lineageData.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              padding: '8px 14px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Download Sample JSON
          </button>
        </div>

        {selectedMenu === "Lineage Gallery" && (
          <div
            style={{
              height: 'calc(100vh - 64px - 85px)',
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '30px',
              justifyContent: 'flex-start',
              marginLeft: '20px',
            }}
          >

            {imageData.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: '1 1 calc(33.333% - 40px)',
                  maxWidth: '360px',
                  minWidth: '300px',
                  boxSizing: 'border-box',
                  borderRadius: '10px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#fff',
                  padding: '12px',
                }}

                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Card image and download button container */}
                <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '10vw', objectFit: 'cover' }}
                    onClick={() => navigate(item.route)}
                  />
                  <button
                    onClick={(e) => handleDownloadJson(e, item)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)')}
                    title="Download JSON"
                  >
                    <Download size={20} color="#1e293b" />
                  </button>
                </div>

                {/* Card content */}
                <div
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}
                  onClick={() => navigate(item.route)}
                >
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    {item.title}
                  </div>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      flex: 1,
                    }}
                  >
                    {item.description}
                  </p>
                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0 12px' }}></div>
                  {/* Footer with last updated info */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                    }}
                  >
                    <div>
                      Last updated by: <span style={{ fontWeight: 500 }}>{item.lastUpdatedBy}</span>
                    </div>
                    <div>{item.lastUpdatedDate}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* JSON Input Card */}
            <div
              ref={customJsonRef}
              style={{
                flex: '1 1 calc(33.333% - 40px)',
                maxWidth: '360px',
                minWidth: '300px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
              }}

            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                Custom JSON Input
              </div>
              <textarea
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                style={{
                  height: '150px',
                  resize: 'none',
                  padding: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '10px',
                }}
              />
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    if (parsed.initialNodes && parsed.pathEdgesMap && parsed.newEdges && parsed.tracePaths) {
                      navigate("/flow", { state: { uploadedJson: parsed } });
                    } else {
                      alert("Invalid structure.");
                    }
                  } catch (err) {
                    alert("Invalid JSON format.");
                  }
                }}
                style={{
                  padding: '10px',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Submit JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
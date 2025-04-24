import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css'; // Importing CSS for styling
import html2pdf from "html2pdf.js";

function App() {
  // -----------------------------------
  //  State variables
  // -----------------------------------
  const [name, setName] = useState('BHARTIYA SAMAJIK PARTY');
  const [totalValue, setTotalValue] = useState('');
  const [items, setItems] = useState('');
  const [itemBreakdown, setItemBreakdown] = useState([]);

  // New fields:
  const [titleValue, setTitleValue] = useState("Wave Multitrade");
  const [addressValue, setAddressValue] = useState(
    "M/28, FIR Mz 10/21, Flox Chamber,\nRoad No.-1, Roxy Cinema,\nOpera House, Girgaon, District - 400004\nE-mail: wavemultitrade@gmail.com"
  );
  const [forValue, setForValue] = useState("Wave Multitrade");

  const [selectedLayout, setSelectedLayout] = useState("layout1");
  // -----------------------------------
  //  Utility functions
  // -----------------------------------

  // Generates a random breakdown, ensuring amounts are at least 19% of total and end in 00
  const generateUnevenBreakdown = () => {
    if (name && totalValue && items) {
      const itemList = items.split(',').map(item => item.trim());
      let totalAmount = parseInt(totalValue, 10);

      const numItems = itemList.length;
      const minAmount = Math.ceil((19 / 100) * totalAmount);
      if (minAmount * numItems > totalAmount) {
        console.error("Total value is too low to satisfy the 19% minimum requirement for all items.");
        return;
      }

      let amounts = [];
      let remainingAmount = totalAmount;

      // Distribute minimum amounts first
      for (let i = 0; i < numItems; i++) {
        amounts.push(minAmount);
        remainingAmount -= minAmount;
      }

      // Add randomness
      for (let i = 0; i < numItems - 1; i++) {
        let maxAddable = Math.min(remainingAmount, Math.floor(totalAmount / numItems));
        let randomAddition = Math.floor(Math.random() * maxAddable);
        amounts[i] += randomAddition;
        remainingAmount -= randomAddition;
      }

      // Add leftover to the last item
      amounts[numItems - 1] += remainingAmount;

      // Round to nearest hundred
      amounts = amounts.map(amount => Math.floor(amount / 100) * 100);

      // Shuffle amounts
      amounts.sort(() => Math.random() - 0.5);

      // Build breakdown
      const breakdown = itemList.map((item, index) => ({
        name: item,
        value: amounts[index],
      }));

      setItemBreakdown(breakdown);
    }
  };

  // Convert numbers to words
  const numberToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const c = ['Hundred', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return 'Zero';

    const makeWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
      if (n < 1000) return a[Math.floor(n / 100)] + ' ' + c[0] + ' ' + makeWords(n % 100);
      if (n < 100000) return makeWords(Math.floor(n / 1000)) + ' ' + c[1] + ' ' + makeWords(n % 1000);
      if (n < 10000000) return makeWords(Math.floor(n / 100000)) + ' ' + c[2] + ' ' + makeWords(n % 100000);
      return makeWords(Math.floor(n / 10000000)) + ' ' + c[3] + ' ' + makeWords(n % 10000000);
    };
    return makeWords(num).trim() + ' Rupees Only';
  };

  // Download as PDF (html2pdf)
  const handleDownload = () => {
    const element = document.getElementById("content-to-pdf");
    html2pdf(element, {
      filename: "downloaded-content.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    });
  };

  // -----------------------------------
  //  Layout Components
  // -----------------------------------

  // LAYOUT #1 (Default)
  const Layout1 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          padding: '6px',
          borderRadius: '0px',
          border: '1px solid black',
          display: 'flex',
          minHeight: '800px',
          marginTop: '50px',
        }}
      >
        <div style={{
          borderRadius: '0px',
          width: '800px',
          border: '1px solid black',
          boxShadow: '0 0 0 1px black',
          color: 'black',

        }}>
          {/* Title & Address */}
          <div style={{
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            marginBottom: '22px',
          }}>
            <span style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '42px',
              fontFamily: 'ui-sans-serif',
              fontWeight: 'bolder',
              marginTop: '12px',
              marginLeft: '12px',
              textTransform: 'uppercase'
            }}>
              {titleValue}
            </span>
            <span style={{ fontWeight: 'bold', fontSize: '12px', whiteSpace: 'pre-line' }}>
              {addressValue}
            </span>
          </div>
          <div style={{
            height: '1px',
            backgroundColor: 'black',
            width: '100%'
          }}></div>
          {/* Invoice Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '10px',
            marginTop: '10px',
            borderBottom: '1px solid black',
            paddingBottom: '10px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0'
            }}>INVOICE</h2>
          </div>
          {/* Sr No / Date Row */}
          <div style={{
            paddingLeft: '6px',
            paddingRight: '6px',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
          }}>
            <div style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
              <p>
                <strong>Sr. No.</strong> &nbsp;&nbsp;
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                paddingRight: '12px',
              }}>
                <p><strong>Date:</strong></p>
                <p style={{
                  width: '100px',
                  marginLeft: '6px',
                  borderBottom: '1px dotted black',
                }}>
                  {/* dynamic date if needed */}
                </p>
              </div>
            </div>
          </div>
          {/* Name Row */}
          <div style={{
            paddingLeft: '6px',
            paddingRight: '6px',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            marginTop: '10px',
          }}>
            <div style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row'
            }}>
              <div style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                paddingRight: '12px',
              }}>
                <p><strong>Name:</strong></p>
                <p style={{
                  width: '100%',
                  marginLeft: '6px',
                  borderBottom: '1px dotted black',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom:"20px"
                }}>{name}</p>
              </div>
            </div>
          </div>
          {/* Extra row if needed */}
          
          {/* Items Table */}
          <div>
            <table className="preview-table">
              <thead>
                <tr>
                  <th style={{
                    borderTop: '1px solid black',
                    borderBottom: '1px solid black',
                    borderRight: '1px solid black',
                    width: "52px",
                    fontSize:'16px'

                  }}>Sr. No.</th>
                  <th
                    style={{
                      borderTop: '1px solid black',
                      borderBottom: '1px solid black',
                      borderRight: '1px solid black',
                    fontSize:'16px'

                    }}
                  >Description</th>
                  <th
                    style={{
                      borderTop: '1px solid black',
                      borderBottom: '1px solid black',
                    fontSize:'16px'

                    }}
                  >Amount (₹)</th>
                </tr>
              </thead>
              <tbody style={{ fontWeight: 'bold' }}>
                {itemBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td style={{
                      borderTop: '1px solid black',
                      borderBottom: '1px solid black',
                      borderRight: '1px solid black',
                      padding:"10px",
                      fontSize:"16px"
                    }}>{index + 1}.</td>
                    <td style={{
                      borderTop: '1px solid black',
                      borderBottom: '1px solid black',
                      borderRight: '1px solid black',
                      fontSize:"16px"

                    }}>{item.name}</td>
                    <td style={{
                      borderTop: '1px solid black',
                      borderBottom: '1px solid black',
                      fontSize:"16px"

                    }}>₹{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Amount in words & total row */}
          <table style={{ marginTop: '-22px' }} className="preview-table">
            <tbody style={{ fontWeight: 'bold' }}>
              <tr>
                <td style={{
                  width: '322px',
                  borderBottom: '1px solid black',
                  borderRight: '1px solid black',
                  fontSize:"16px"

                }}>
                  <strong style={{ fontSize: '16px' }}>
                    Amount (in words) Rs:&nbsp;
                  </strong>
                  <span style={{ borderBottom: '1px solid black' }}>
                    {numberToWords(total)}
                  </span>
                </td>
                <td style={{ borderBottom: '1px solid black', fontSize:"16px" }}>
                  <strong>
                    Total: ₹{total}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
          {/* Terms / Signatory */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: '6px',
            paddingRight: '6px',
            marginTop: '40%',
           
          }}>
            <div>
              <p><strong>Terms and Conditions:</strong></p>
              <ol style={{ fontWeight: '500', margin: '10px' }}>
                <li>Goods once sold will not be taken back.</li>
                <li>No responsibility for breakages during transit.</li>
                <li>All Disputes subject to District Jurisdiction only.</li>
                <li>E.&amp; O.E.</li>
              </ol>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <p style={{ fontWeight: 'bolder', fontSize: '16px' }}>
                <strong>For {forValue}</strong>
              </p>
              <p><strong>Authorised Signatory</strong></p>
            </div>
          </div>
        
        </div>
      </div>
    );
  };

  // LAYOUT #2 – Improved Boxed, professional layout
  const Layout2 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);

    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '20px',
          border: '1px solid #333',
          width: '800px',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f9f9f9',
          minHeight: '800px',
          color: 'black'

        }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: '0', fontSize: '36px', letterSpacing: '2px' }}>{titleValue}</h1>
          <div style={{ fontSize: '12px', marginTop: '5px', whiteSpace: 'pre-line' }}>
            {addressValue}
          </div>
          <hr style={{ marginTop: '15px', border: 'none', borderTop: '1px solid #333' }} />
        </div>

        {/* Invoice Title / Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold' }}>Invoice</p>
          </div>
          <div style={{ marginRight: '40px', fontSize: '14px' }}>
            <div><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></div>
            <div><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></div>
          </div>
        </div>

        {/* Client Details */}
        <div style={{ marginBottom: '15px' }}>
          <strong>Bill To:</strong>
          <span style={{
            marginLeft: '8px',
            borderBottom: '1px dotted #000',
            padding: '0 4px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {name}
          </span>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '8px', border: '1px solid #333' }}>Sr. No.</th>
              <th style={{ padding: '8px', border: '1px solid #333' }}>Item Description</th>
              <th style={{ padding: '8px', border: '1px solid #333' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={{ padding: '8px', border: '1px solid #333' }}>{index + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #333', textAlign: 'left' }}>{item.name}</td>
                <td style={{ padding: '8px', border: '1px solid #333' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Subtotal & Amount in words */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '60%' }}>
            <p style={{ margin: '5px 0' }}><strong>Amount in words:</strong></p>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>Total: ₹{total}</p>
          </div>
        </div>
        <hr style={{ marginTop: '20px', borderTop: '1px solid #333' }} />
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', marginTop: '50%' }}>
          <div style={{ fontSize: '12px' }}>
            <strong>Terms and Conditions:</strong>
            <ul style={{ marginTop: '5px', paddingLeft: '18px' }}>
              <li>Goods once sold will not be taken back.</li>
              <li>No responsibility for breakages during transit.</li>
              <li>All disputes subject to District Jurisdiction only.</li>
              <li>E.& O.E.</li>
            </ul>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '40px' }}>For {forValue}</p>
            <p style={{ borderTop: '1px solid #333', width: '180px', margin: '0 auto' }}>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT #3 – Improved Bold Header variant
  const Layout3 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);

    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '20px',
          border: '2px solid #555',
          width: '800px',
          minHeight: '800px',
          fontFamily: 'Tahoma, sans-serif',
          backgroundColor: '#fffbe6',
          color: 'black'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ margin: 0, fontSize: '38px', letterSpacing: '1px', color: '#333' }}>{titleValue}</h1>
          <p style={{ margin: '5px 0', fontSize: '14px', whiteSpace: 'pre-line', color: '#555' }}>
            {addressValue}
          </p>
        </div>
        <div style={{
          height: '2px',
          background: '#555',
          marginBottom: '15px'
        }}></div>

        {/* Invoice Title */}
        <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '2px solid #555' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingBottom: '10px'
          }}>
            INVOICE
          </h2>
        </div>


        {/* Top Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Name:</strong>
              <span style={{
                borderBottom: '1px dotted #000',
                marginLeft: '5px',
                padding: '0 4px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {name}
              </span>
            </div>
          </div>
          <div style={{ marginRight: '40px' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
            </p>
          </div>
        </div>
        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
          <thead>
            <tr style={{ background: '#f7f7f7', border: '1px solid #555' }}>
              <th style={{ padding: '8px', border: '1px solid #555', width: '50px' }}>Sr.</th>
              <th style={{ padding: '8px', border: '1px solid #555', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '8px', border: '1px solid #555', width: '120px' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #555', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #555' }}>{item.name}</td>
                <td style={{ padding: '8px', border: '1px solid #555', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Totals & Amount in words */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px'
        }}>
          <div style={{ maxWidth: '60%' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Amount in Words:</p>
            <p style={{ marginTop: '6px', fontStyle: 'italic' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Total: ₹{total}</p>
          </div>
        </div>
        <div style={{
          marginTop: '20px',
          height: '2px',
          background: '#555'
        }}></div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginTop: '40%' }}>
          <div style={{ fontSize: '12px' }}>
            <strong>Terms and Conditions:</strong>
            <ul style={{ marginTop: '5px', paddingLeft: '18px' }}>
              <li>Goods once sold will not be taken back.</li>
              <li>No responsibility for breakages during transit.</li>
              <li>All disputes subject to District Jurisdiction only.</li>
              <li>E.& O.E.</li>
            </ul>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '40px' }}>For {forValue}</p>
            <p style={{ borderTop: '1px solid #555', width: '180px', margin: '0 auto' }}>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT #4 – New Minimalistic, modern layout
  const Layout4 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '30px',
          border: 'none',
          width: '800px',
          minHeight: '800px',
          fontFamily: 'Verdana, sans-serif',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          color: 'black'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{titleValue}</h2>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#777', whiteSpace: 'pre-line' }}>
            {addressValue}
          </p>
        </div>
        {/* Invoice details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
          <div>
            <strong>Invoice</strong>
          </div>
          <div style={{marginRight: '40px'}}>
            <strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
            <br />
            <strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
          </div>
        </div>
        {/* Client details */}
        <div style={{ marginBottom: '20px', fontSize: '14px' }}>
          <strong>Bill To:</strong>
          <span style={{
            marginLeft: '8px',
            borderBottom: '1px dotted #000',
            padding: '0 4px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {name}
          </span>
        </div>
        {/* Items Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Sr. No.</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Item Description</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ maxWidth: '65%' }}>
            <strong>Amount in words:</strong>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Total: ₹{total}</strong>
          </div>
        </div>
        {/* Footer */}
        <div style={{ marginTop: '35%', borderTop: '1px solid #ddd', fontSize: '12px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Terms and Conditions:</strong>
            <ul style={{ margin: '5px 0 0 20px' }}>
              <li>Goods once sold will not be taken back.</li>
              <li>No responsibility for breakages during transit.</li>
              <li>All disputes subject to District Jurisdiction only.</li>
              <li>E.& O.E.</li>
            </ul>
          </div>
          <div style={{ textAlign: 'center', }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>For {forValue}</p>
            <p style={{  borderTop: '1px solid #000', width: '150px', margin: '0 auto' }}>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------
  // New Layouts (5 to 10)
  // -------------------------------

  // LAYOUT #5 - Minimalistic Clean Layout
  const Layout5 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '20px',
          border: '1px solid #ddd',
          width: '800px',
          minHeight: '800px',
          fontFamily: 'Calibri, sans-serif',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          color: 'black'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '32px' }}>{titleValue}</h2>
          <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '5px 0' }}>{addressValue}</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ margin: 0, fontSize: '32px' }}>INVOICE</h2>
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div>
            <strong>Bill To:</strong> <span style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</span>
          </div>
          <div style={{ marginRight: '40px' }}>
            <strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
            <br />
            <strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ background: '#f2f2f2' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Sr. No.</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ maxWidth: '70%' }}>
            <strong>Amount in Words:</strong>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Total: ₹{total}</strong>
          </div>
        </div>
        <div style={{ marginTop: '30%', fontSize: '12px' }}>
          <strong>Terms and Conditions:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            <li>Goods once sold will not be taken back.</li>
            <li>No responsibility for breakages during transit.</li>
            <li>All disputes subject to District Jurisdiction only.</li>
            <li>E.& O.E.</li>
          </ul>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>For {forValue}</p>
          <p style={{ borderTop: '1px solid #000', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
        </div>
      </div>
    );
  };

  // LAYOUT #6 - Two-column Modern Layout
  const Layout6 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '30px',
          minHeight: '800px',
          border: '2px solid #4CAF50',
          width: '800px',
          fontFamily: 'Segoe UI, sans-serif',
          backgroundColor: '#ffffff',
          color: 'black'
        }}>

        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #4CAF50' }}>
          <h1 style={{ 
            fontSize: '32px', 
            color: '#4CAF50',
            margin: '0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            INVOICE
          </h1>
        </div>



        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0 }}>{titleValue}</h2>
            <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '5px 0' }}>{addressValue}</p>
          </div>
          <div style={{ marginRight: '40px' }}>
            <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
            <p><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
          </div>
        </div>
        <hr style={{ border: '1px solid #4CAF50' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
          <div>
            <strong>Bill To:</strong> <span style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</span>
          </div>
          <div>
            <strong>For:</strong> <span style={{ borderBottom: '1px dotted #000' }}>{forValue}</span>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ background: '#e8f5e9' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #4CAF50' }}>Sr. No.</th>
              <th style={{ padding: '10px', border: '1px solid #4CAF50' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #4CAF50' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #4CAF50', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #4CAF50' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #4CAF50', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ maxWidth: '70%' }}>
            <strong>Amount in Words:</strong>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Total: ₹{total}</strong>
          </div>
        </div>
        <div style={{ marginTop: '30%', fontSize: '12px' }}>
        <div style={{ marginTop: '20px', fontSize: '12px' }}>
          <strong>Terms and Conditions:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            <li>Goods once sold will not be taken back.</li>
            <li>No responsibility for breakages during transit.</li>
            <li>All disputes subject to District Jurisdiction only.</li>
            <li>E.& O.E.</li>
          </ul>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px' }}>
          <p style={{ fontWeight: 'bold' }}>For {forValue}</p>
          <p style={{ borderTop: '1px solid #4CAF50', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
        </div>
        </div>
      </div>

    );
  };

  // LAYOUT #7 - Elegant Layout with Classic Serif Fonts
  const Layout7 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '40px',
          minHeight: '800px',
          width: '800px',
          fontFamily: 'Georgia, serif',
          backgroundColor: '#fafafa',
          border: '1px solid #aaa',
          color: 'black'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0', fontSize: '34px' }}>{titleValue}</h2>
          <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '5px 0' }}>{addressValue}</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #aaa', borderTop: '1px solid #aaa' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            // paddingBottom: 'px'
          }}>
            INVOICE
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '20px' }}>
          <div>
            <strong>Bill To:</strong> <span style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</span>
          </div>
          <div style={{ marginRight: '40px' }}>
            <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
            <p><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ background: '#eaeaea' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Sr. No.</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ maxWidth: '70%' }}>
            <strong>Amount in Words:</strong>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Total: ₹{total}</strong>
          </div>
        </div>
        <div style={{ marginTop: '23%', fontSize: '12px' }}>
          <strong>Terms and Conditions:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            <li>Goods once sold will not be taken back.</li>
            <li>No responsibility for breakages during transit.</li>
            <li>All disputes subject to District Jurisdiction only.</li>
            <li>E.& O.E.</li>
          </ul>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>For {forValue}</p>
          <p style={{ borderTop: '1px solid #000', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
        </div>
      </div>
    );
  };

  // LAYOUT #8 - Modern Layout with Colored Header
  const Layout8 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          width: '800px',
          minHeight: '800px',
          fontFamily: 'Helvetica, sans-serif',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          border: '1px solid #007BFF',
          borderRadius: '5px',
          padding: '20px',
          color: 'black'
        }}>
        <div style={{ backgroundColor: '#007BFF', color: '#fff', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '34px' }}>{titleValue}</h2>
          <p style={{ margin: '5px 0', fontSize: '12px', whiteSpace: 'pre-line' }}>{addressValue}</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #007BFF' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0',
            color: '#007BFF',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingBottom: '5px'
          }}>
            INVOICE
          </h2>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
            <div>
              <strong>Bill To:</strong> <span style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</span>
            </div>
            <div style={{ marginRight: '40px' }}>
              <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
              <p><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ background: '#f1f1f1' }}>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Sr. No.</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {itemBreakdown.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>₹{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <div style={{ maxWidth: '70%' }}>
              <strong>Amount in Words:</strong>
              <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Total: ₹{total}</strong>
            </div>
          </div>
          <div style={{ marginTop: '20%', fontSize: '12px' }}>
            <strong>Terms and Conditions:</strong>
            <ul style={{ margin: '5px 0 0 20px' }}>
              <li>Goods once sold will not be taken back.</li>
              <li>No responsibility for breakages during transit.</li>
              <li>All disputes subject to District Jurisdiction only.</li>
              <li>E.& O.E.</li>
            </ul>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>For {forValue}</p>
            <p style={{ borderTop: '1px solid #000', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT #9 - Layout with a Side Panel for Client Details
  const Layout9 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          width: '800px',
          minHeight: '800px',
          fontFamily: 'Trebuchet MS, sans-serif',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          color: 'black'
        }}
      >
        <div style={{ display: 'flex' }}>
          
          <div style={{ width: '30%', backgroundColor: '#f0f0f0', padding: '20px' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>INVOICE</h2>
          </div>
            <h3 style={{ marginTop: 0 }}>{titleValue}</h3>
            <p style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{addressValue}</p>
            <div style={{ marginTop: '20px', fontSize: '14px' }}>
              <p><strong>Bill To:</strong></p>
              <p style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</p>
              <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
              <p><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
            </div>
          </div>
          <div style={{ width: '70%', padding: '20px' }}>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: '#ddd' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ccc' }}>Sr. No.</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc' }}>Description</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {itemBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{item.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>₹{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ maxWidth: '70%' }}>
                <strong>Amount in Words:</strong>
                <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Total: ₹{total}</strong>
              </div>
            </div>
            <div style={{ marginTop: '80%', fontSize: '12px' }}>
              <strong>Terms and Conditions:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '18px' }}>
                <li>Goods once sold will not be taken back.</li>
                <li>No responsibility for breakages during transit.</li>
                <li>All disputes subject to District Jurisdiction only.</li>
                <li>E.& O.E.</li>
              </ul>
              <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px' }}>
              <p style={{ fontWeight: 'bold' }}>For {forValue}</p>
              <p style={{ borderTop: '1px solid #000', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
            </div>
            </div>
           
          </div>
        </div>
      </div>
    );
  };

  // LAYOUT #10 - Classic and Formal Layout
  const Layout10 = () => {
    const total = itemBreakdown.reduce((sum, itm) => sum + itm.value, 0);
    return (
      <div
        className="pdf-preview"
        style={{
          margin: '60px auto',
          padding: '40px',
          minHeight: '800px',
          width: '800px',
          fontFamily: 'Times New Roman, serif',
          backgroundColor: '#f5f5f5',
          border: '1px solid #bbb',
          color: 'black'

        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0', fontSize: '36px' }}>{titleValue}</h1>
          <p style={{ fontSize: '12px', whiteSpace: 'pre-line', margin: '5px 0' }}>{addressValue}</p>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #999', borderTop: '1px solid #999' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '0',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              paddingBottom: '10px'
            }}>
              INVOICE
            </h2>
          </div>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
         
          <div>
            <strong>Client:</strong> <span style={{ borderBottom: '1px dotted #000', fontWeight: 'bold', fontSize: '16px' }}>{name}</span>
          </div>
          <div style={{ marginRight: '40px' }}>
            <p><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
            <p><strong>Invoice #:</strong> <span style={{ borderBottom: '1px dotted #000', padding: '0 8px' }}></span></p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '20px' }}>
          <thead style={{ background: '#e0e0e0' }}>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #999' }}>Sr. No.</th>
              <th style={{ padding: '10px', border: '1px solid #999' }}>Item Description</th>
              <th style={{ padding: '10px', border: '1px solid #999' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {itemBreakdown.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #999' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #999', textAlign: 'right' }}>₹{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ maxWidth: '70%' }}>
            <strong>Amount in Words:</strong>
            <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{numberToWords(total)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Total: ₹{total}</strong>
          </div>
        </div>
        <div style={{ marginTop: '20%', fontSize: '12px' }}>
          <strong>Terms and Conditions:</strong>
          <ul >
            <li>Goods once sold will not be taken back.</li>
            <li>No responsibility for breakages during transit.</li>
            <li>All disputes subject to District Jurisdiction only.</li>
            <li>E.& O.E.</li>
          </ul>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>For {forValue}</p>
          <p style={{ borderTop: '1px solid #000', width: '150px', margin: '10px auto 0' }}>Authorized Signatory</p>
        </div>
      </div>
    );
  };

  // -----------------------------------
  //  Render Selected Layout
  // -----------------------------------
  const renderSelectedLayout = () => {
    switch (selectedLayout) {
      case "layout2":
        return <Layout2 />;
      case "layout3":
        return <Layout3 />;
      case "layout4":
        return <Layout4 />;
      case "layout5":
        return <Layout5 />;
      case "layout6":
        return <Layout6 />;
      case "layout7":
        return <Layout7 />;
      case "layout8":
        return <Layout8 />;
      case "layout9":
        return <Layout9 />;
      case "layout10":
        return <Layout10 />;
      default:
        return <Layout1 />;
    }
  };

  // -----------------------------------
  //  Main UI
  // -----------------------------------
  return (
    <div className="App">
      <h1>Invoice Generator</h1>

      {/* Input form */}
      <div className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: 'auto' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Enter Name (e.g., Client Name)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="Enter Total Value (e.g., 50000)"
          value={totalValue}
          onChange={(e) => setTotalValue(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Enter Comma-separated Items"
          value={items}
          onChange={(e) => setItems(e.target.value)}
        />
        <button className="generate-btn" onClick={generateUnevenBreakdown}>
          Generate Breakdown
        </button>

        {/* New fields for Title, Address, and "For" */}
        <input
          type="text"
          placeholder="Enter Invoice Title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          style={{ marginTop: '12px' }}
        />
        <textarea
          placeholder="Enter Address"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          rows={4}
          style={{ resize: 'vertical' }}
        />
        <input
          type="text"
          placeholder='Enter "For" text (e.g., "Wave Multitrade")'
          value={forValue}
          onChange={(e) => setForValue(e.target.value)}
        />
      </div>

      {/* Dropdown to pick layout */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <label htmlFor="layoutSelect" style={{ marginRight: '8px' }}>Select Layout:</label>
        <select
          id="layoutSelect"
          value={selectedLayout}
          onChange={(e) => setSelectedLayout(e.target.value)}
        >
          <option value="layout1">Layout 1 (Default)</option>
          <option value="layout2">Layout 2 (Boxed, Improved)</option>
          <option value="layout3">Layout 3 (Bold Header, Improved)</option>
          <option value="layout4">Layout 4 (Modern Minimalistic)</option>
          <option value="layout5">Layout 5 (Minimalistic Clean)</option>
          <option value="layout6">Layout 6 (Two-column Modern)</option>
          <option value="layout7">Layout 7 (Elegant Classic)</option>
          <option value="layout8">Layout 8 (Colored Header)</option>
          <option value="layout9">Layout 9 (Side Panel)</option>
          <option value="layout10">Layout 10 (Classic Formal)</option>
        </select>
      </div>

      {/* Item breakdown list (optional) */}
      <div className="breakdown-container" style={{ textAlign: 'center' }}>
        {itemBreakdown.length > 0 && (
          <>
            <h2>Item Breakdown:</h2>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {itemBreakdown.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  {item.name}: ₹{item.value}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* The preview / printable area */}
      <div
        id="content-to-pdf"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontSize: '12px',
        }}
      >
        {renderSelectedLayout()}
      </div>

      {/* Download button */}
      <div style={{ textAlign: 'center', marginTop: "40px" }}>
        <button
          className="download-btn"
          onClick={handleDownload}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import './CompanyRequests.css'; // Import your CSS styles

const CompanyRequests = () => {
  const [companies, setCompanies] = useState([]);
  
    useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = (err) => {
    alert(err);
    window.location.href = "/error"; // Redirect to error page
  };
 
  // Fetch would return status: "error" if the user is not an admin
  useEffect(() => {
    fetch('/api/company/pending')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => checkAdminAuth(err));
  }, []);

  const handleDecision = (id, decision) => {
    // Example: send decision to server
    fetch(`/api/company/approve`, { method: 'POST' })
    .then((res) => {
        if (res.ok) {
          // Update the state to remove the company from the list
          setCompanies(companies.filter((company) => company.id !== id));
          alert(`Company ${id} has been ${decision}`);
        } else {
          alert('Error processing request');
        }
      })
      .catch((err) => console.error('Error approving company:', err));
  };

  return (
    <div className="container">
      <h2>Company Requests</h2>
      <table className="company-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>NIT</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Business Type</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.nit}</td>
              <td>{company.address}</td>
              <td>{company.phone}</td>
              <td>{company.businessType}</td>
              <td>{company.email}</td>
              <td>
                <button
                  className="btn accept"
                  onClick={() => handleDecision(company.id, 'accepted')}
                >
                  Accept
                </button>
                <button
                  className="btn reject"
                  onClick={() => handleDecision(company.id, 'rejected')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyRequests;

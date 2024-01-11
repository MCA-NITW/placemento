import CompanyCard from './CompanyCard';
import React, { useState, useEffect } from 'react';
import { getCompanies, addCompany } from '../../api/companyApi';
import CompanyForm from './CompanyForm';
import './Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getCompanies()
      .then(res => {
        setCompanies(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleAddCompanyClick = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  return (
    <div className="container">
      <h1 className="page-heading">Companies</h1>
      <div className="companies">
        {companies && companies.map(company => <CompanyCard key={company._id} company={company} />)}
      </div>
      <button className="btn btn-primary" onClick={handleAddCompanyClick}>
        Add Company
      </button>
      <div
        className={`modal ${isFormOpen ? 'show' : ''}`}
        id="companyFormModal"
        tabIndex="-1"
        aria-labelledby="companyFormModalLabel"
        aria-hidden={!isFormOpen}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <CompanyForm actionFunction={addCompany} />
            <button type="button" className="close-button" data-bs-dismiss="modal" onClick={handleFormClose}>
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;

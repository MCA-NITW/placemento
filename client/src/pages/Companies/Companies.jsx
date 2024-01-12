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
        setCompanies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleAddCompanyClick = () => {
    setFormOpen(true);
    document.body.classList.add('unscrollable');
  };

  const handleFormClose = () => {
    setFormOpen(false);
    document.body.classList.remove('unscrollable');
  };

  const renderCompanies = () => {
    if (companies.length === 0) {
      return <h1>No Companies</h1>;
    } else {
      return companies.map(company => <CompanyCard key={company._id} company={company} />);
    }
  };

  return (
    <div className="container">
      <h1 className="page-heading">Companies</h1>
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
            <CompanyForm actionFunction={addCompany} handleFormClose={handleFormClose} setCompanies={setCompanies} />
            <button type="button" className="close-button" data-bs-dismiss="modal" onClick={handleFormClose}>
              ❌
            </button>
          </div>
        </div>
      </div>
      <div className="companies">{renderCompanies()}</div>
    </div>
  );
};

export default Companies;

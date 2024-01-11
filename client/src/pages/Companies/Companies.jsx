import CompanyCard from './CompanyCard';
import React, { useState, useEffect } from 'react';
import { getCompanies , addCompany } from '../../api/companyApi';
import CompanyForm from './CompanyForm';

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getCompanies()
      .then(res => {
        setCompanies(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);



  return (
    <div className="container">
      <h1 className="page-heading">Companies</h1>
      <div className="companies">
        {companies && companies.map(company => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
      <div className="companies__add">
        <CompanyForm actionFunction={addCompany} />
      </div>
    </div>
  );
};

export default Companies;

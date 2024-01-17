import React, { useState } from 'react';
import CompanyForm from './CompanyForm';
import CompanyTable from './CompanyTable';
import './Companies.css';

const Companies = () => {
	const [isFormOpen, setFormOpen] = useState(false);

	const handleAddCompanyClick = () => {
		setFormOpen(true);
	};

	const handleFormClose = () => {
		setFormOpen(false);
	};

	return (
		<div className="container">
			<h1 className="page-heading">Companies</h1>
			<button className="btn-primary" onClick={handleAddCompanyClick}>
				Add Company
			</button>
			<div className={`modal ${isFormOpen ? 'show' : ''}`} id="companyFormModal" aria-hidden={!isFormOpen}>
				<div className="modal-dialog">
					<div className="modal-content">
						<CompanyForm handleFormClose={handleFormClose} />
					</div>
				</div>
			</div>
			<CompanyTable key={isFormOpen} />
		</div>
	);
};

export default Companies;

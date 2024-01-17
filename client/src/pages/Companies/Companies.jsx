import React, { useState, useEffect } from 'react';
import { getCompanies, addCompany, updateCompany, deleteCompany } from '../../api/companyApi';
import CompanyForm from './CompanyForm';
import CompanyTable from './CompanyTable';
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
					</div>
				</div>
			</div>
			{companies.length !== 0 && (
				<div className="ag-theme-quartz">
					<CompanyTable companies={companies} />
				</div>
			)}
		</div>
	);
};

export default Companies;

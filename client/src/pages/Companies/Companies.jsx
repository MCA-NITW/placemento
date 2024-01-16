import React, { useState, useEffect } from 'react';
import { getCompanies, addCompany, updateCompany } from '../../api/companyApi';
import CompanyForm from './CompanyForm';
import CompanyTable from './CompanyTable';
import './Companies.css';

const Companies = () => {
	const [companies, setCompanies] = useState([]);
	const [isFormOpen, setFormOpen] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [isEdit, setIsEdit] = useState(false);

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
		if (isEdit) {
			setIsEdit(false);
		}
		setSelectedCompany(null);
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
						<CompanyForm
							actionFunction={isEdit ? updateCompany : addCompany}
							handleFormClose={handleFormClose}
							setCompanies={setCompanies}
							selectedCompany={selectedCompany}
						/>
					</div>
				</div>
			</div>
			{/* Render the updated table */}
			{companies.length === 0 ? (
				<h1>No Companies</h1>
			) : (
				<div className="ag-theme-quartz">
					<CompanyTable companies={companies} />
				</div>
			)}
		</div>
	);
};

export default Companies;

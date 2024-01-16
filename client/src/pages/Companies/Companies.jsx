import CompanyCard from './CompanyCard';
import React, { useState, useEffect } from 'react';
import { getCompanies, addCompany, updateCompany } from '../../api/companyApi';
import CompanyForm from './CompanyForm';
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
		document.body.classList.add('unscrollable');
	};

	const handleFormClose = () => {
		setFormOpen(false);
		if (isEdit) {
			setIsEdit(false);
		}
		setSelectedCompany(null);
		document.body.classList.remove('unscrollable');
	};

	const handleEditClick = company => {
		setSelectedCompany(company);
		setFormOpen(true);
		setIsEdit(true);
		document.body.classList.add('unscrollable');
	};

	const renderCompanies = () => {
		if (companies.length === 0) {
			return <h1>No Companies</h1>;
		} else {
			return companies.map(company => (
				<CompanyCard key={company._id} company={company} onEditClick={handleEditClick} />
			));
		}
	};

	return (
		<div className="container">
			<div className="companies__content">
				<h1 className="page-heading">Companies</h1>
				<button className="btn-primary" onClick={handleAddCompanyClick}>
					Add Company
				</button>
				<div className="companies">{renderCompanies()}</div>
			</div>
			<div
				className={`modal ${isFormOpen ? 'show' : ''}`}
				id="companyFormModal"
				tabIndex="-1"
				aria-labelledby="companyFormModalLabel"
				aria-hidden={!isFormOpen}
			>
				<div className="modal-content">
					<CompanyForm
						actionFunction={isEdit ? updateCompany : addCompany}
						handleFormClose={handleFormClose}
						setCompanies={setCompanies}
						initialData={selectedCompany}
					/>
				</div>
			</div>
		</div>
	);
};

export default Companies;

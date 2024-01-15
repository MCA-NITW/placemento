import React from 'react';
import './CompanyCard.css';

const CompanyCard = ({ company, onEditClick }) => {
  function renderCutoffItem(label, cgpa, percentage) {
    return (
      <div className="company-card__cutoff__item">
        <span className="company-card__cutoff__label">{label}:</span>
        {cgpa !== 0 && <span className="company-card__cutoff__sublabel">{cgpa} CGPA</span>}
        {cgpa === 0 && <span className="company-card__cutoff__sublabel">{percentage}%</span>}
      </div>
    );
  }
  return (
    <div className="company-card">
      <div className="company-card__header">
        <h3 className="company-card__header__text">{company.name}</h3>
        <div className="company-card__header__buttons">
          <button className="btn-edit" onClick={() => onEditClick(company)}>
            Edit
          </button>
          <button className="btn-danger">Delete</button>
        </div>
      </div>
      <div className="company-card__body">
        <div className="company-card__cutoff">
          <h4 className="company-card__cutoff__heading">Cutoffs: </h4>
          {renderCutoffItem('PG', company.cutoffs.pg.cgpa, company.cutoffs.pg.percentage)}
          {renderCutoffItem('UG', company.cutoffs.ug.cgpa, company.cutoffs.ug.percentage)}
          {renderCutoffItem('12th', company.cutoffs.twelth.cgpa, company.cutoffs.twelth.percentage)}
          {renderCutoffItem('10th', company.cutoffs.tenth.cgpa, company.cutoffs.tenth.percentage)}
        </div>
        <div className="company-card__details">
          <div className="company-card__selects">
            <h4 className="company-card__selects__heading">Selects Details: </h4>
            <div className="company-card__selects__item">
              <span className="company-card__selects__label">InterView/Intern Shortlists Count: </span>{' '}
              {company.interviewShortlist}
            </div>
            <div className="company-card__selects__item">
              <span className="company-card__selects__label">Final Selects Count: </span> {company.selected}
            </div>
            <div className="company-card__selects__item">
              <span className="company-card__selects__label">Students Selected are: </span>{' '}
              {company.selectedStudentsRollNo.map(rollNo => (
                <div className="company-card__selects__subitem">{rollNo} </div>
              ))}
            </div>
            <div className="company-card__selects__item">
              <span className="company-card__selects__label">Date of Offer</span>{' '}
              {new Date(company.dateOfOffer).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>

          <div className="company-card__offer">
            <h4 className="company-card__offer__heading">Offer Details: </h4>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">Type of Offer:</span> {company.typeOfOffer}
            </div>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">Profile:</span> {company.profile}
            </div>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">CTC:</span> {company.ctc}
            </div>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">CTC Breakup:</span>
              <div className="company-card__offer__subitem">
                <span className="company-card__offer__sublabel">Base:</span> {company.ctcBreakup.base}
              </div>
              <div className="company-card__offer__subitem">
                <span className="company-card__offer__sublabel">Other:</span> {company.ctcBreakup.other}
              </div>
            </div>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">Bond:</span> {company.bond}
            </div>
            <div className="company-card__offer__item">
              <span className="company-card__offer__label">Locations</span>{' '}
              {company.locations.map(location => (
                <div className="company-card__offer__subitem">{location} </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

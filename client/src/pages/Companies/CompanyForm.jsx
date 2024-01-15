import React, { useState } from 'react';

const CompanyForm = ({ actionFunction, handleFormClose, setCompanies, initialData }) => {
  const [formData, setFormData] = useState(
    (initialData && {
      name: initialData.name,
      status: initialData.status,
      interviewShortlist: initialData.interviewShortlist,
      selectedStudents: initialData.selectedStudentsRollNo,
      dateOfOffer: new Date(initialData.dateOfOffer),
      locations: initialData.locations,
      cutoff_pg: initialData.cutoffs.pg.cgpa || initialData.cutoffs.pg.percentage,
      cutoff_ug: initialData.cutoffs.ug.cgpa || initialData.cutoffs.ug.percentage,
      cutoff_12: initialData.cutoffs.twelth.cgpa || initialData.cutoffs.twelth.percentage,
      cutoff_10: initialData.cutoffs.tenth.cgpa || initialData.cutoffs.tenth.percentage,
      typeOfOffer: initialData.typeOfOffer,
      profile: initialData.profile,
      ctc: initialData.ctc,
      ctcBase: initialData.ctcBreakup.base,
      bond: initialData.bond,
    }) || {
      name: '',
      status: 'upcoming',
      interviewShortlist: 0,
      selectedStudents: [],
      dateOfOffer: new Date(),
      locations: [],
      cutoff_pg: 0,
      cutoff_ug: 0,
      cutoff_12: 0,
      cutoff_10: 0,
      typeOfOffer: 'FTE',
      profile: '',
      ctc: 0.0,
      ctcBase: 0.0,
      bond: 0,
    },
  );

  const handleChange = (field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleLocationsChange = value => {
    handleChange(
      'locations',
      value.split(',').map(loc => loc.trim()),
    );
  };

  const handleSelectedStudentsChange = value => {
    handleChange(
      'selectedStudents',
      value.split(',').map(rollNo => rollNo.trim()),
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newCompany = {
      name: formData.name,
      status: formData.status,
      interviewShortlist: formData.interviewShortlist,
      selected: formData.selectedStudents.length,
      selectedStudentsRollNo: formData.selectedStudents,
      dateOfOffer: formData.dateOfOffer,
      locations: formData.locations,
      cutoffs: {
        pg: {
          cgpa: formData.cutoff_pg <= 10 ? formData.cutoff_pg : 0,
          percentage: formData.cutoff_pg > 10 ? formData.cutoff_pg : 0,
        },
        ug: {
          cgpa: formData.cutoff_ug <= 10 ? formData.cutoff_ug : 0,
          percentage: formData.cutoff_ug > 10 ? formData.cutoff_ug : 0,
        },
        twelth: {
          cgpa: formData.cutoff_12 <= 10 ? formData.cutoff_12 : 0,
          percentage: formData.cutoff_12 > 10 ? formData.cutoff_12 : 0,
        },
        tenth: {
          cgpa: formData.cutoff_10 <= 10 ? formData.cutoff_10 : 0,
          percentage: formData.cutoff_10 > 10 ? formData.cutoff_10 : 0,
        },
      },
      typeOfOffer: formData.typeOfOffer,
      profile: formData.profile,
      ctc: formData.ctc,
      ctcBreakup: {
        base: formData.ctcBase,
        other: (formData.ctc - formData.ctcBase).toFixed(2),
      },
      bond: formData.bond,
    };
    await actionFunction(newCompany);
    setCompanies(prevCompanies => [...prevCompanies, newCompany]);
    handleFormClose();
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          id="companyName"
          className="form-control"
          placeholder="Company Name"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          className="form-select"
          value={formData.status}
          onChange={e => handleChange('status', e.target.value)}
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="input-group">
        <div className="form-group">
          <label htmlFor="interviewShortlist">Interview/Intern Shortlists</label>
          <input
            type="number"
            id="interviewShortlist"
            className="form-control"
            placeholder="Interview/Intern Shortlist"
            value={formData.interviewShortlist}
            onChange={e => handleChange('interviewShortlist', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="selectedStudents">Selected Students</label>
        <textarea
          id="selectedStudents"
          className="form-control"
          placeholder="(Comma separated roll numbers of selected students)"
          value={formData.selectedStudents.join(', ')}
          onChange={e => handleSelectedStudentsChange(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateOfOffer">Date of Offer</label>
        <input
          type="date"
          id="dateOfOffer"
          className="form-control"
          placeholder="Date of Offer"
          value={formData.dateOfOffer}
          onChange={e => handleChange('dateOfOffer', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="locations">Locations</label>
        <textarea
          id="locations"
          className="form-control"
          placeholder="Locations  (Separate multiple locations with commas)"
          value={formData.locations.join(', ')}
          onChange={e => handleLocationsChange(e.target.value)}
        />
      </div>

      <div className="input-group-out">
        <div className="input-group">
          <div className="form-group">
            <label htmlFor="cutoffPG">Cutoff PG</label>
            <input
              type="number"
              id="cutoffPG"
              className="form-control"
              placeholder="Cutoff PG"
              value={formData.cutoff_pg}
              onChange={e => handleChange('cutoff_pg', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cutoffUG">Cutoff UG</label>
            <input
              type="number"
              id="cutoffUG"
              className="form-control"
              placeholder="Cutoff UG"
              value={formData.cutoff_ug}
              onChange={e => handleChange('cutoff_ug', e.target.value)}
            />
          </div>
        </div>
        <div className="input-group">
          <div className="form-group">
            <label htmlFor="cutoff12">Cutoff 12</label>
            <input
              type="number"
              id="cutoff12"
              className="form-control"
              placeholder="Cutoff 12"
              value={formData.cutoff_12}
              onChange={e => handleChange('cutoff_12', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cutoff10">Cutoff 10</label>
            <input
              type="number"
              id="cutoff10"
              className="form-control"
              placeholder="Cutoff 10"
              value={formData.cutoff_10}
              onChange={e => handleChange('cutoff_10', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="typeOfOffer">Offer</label>
        <select
          id="typeOfOffer"
          className="form-select"
          value={formData.typeOfOffer}
          onChange={e => handleChange('typeOfOffer', e.target.value)}
        >
          <option value="" disabled>
            Select Type of Offer
          </option>
          <option value="PPO">PPO</option>
          <option value="FTE">FTE</option>
          <option value="6M+FTE">6M+FTE</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="profile">Profile</label>
        <input
          type="text"
          id="profile"
          className="form-control"
          placeholder="Profile"
          value={formData.profile}
          onChange={e => handleChange('profile', e.target.value)}
        />
      </div>

      <div className="input-group">
        <div className="form-group">
          <label htmlFor="ctc">CTC</label>
          <input
            type="number"
            id="ctc"
            className="form-control"
            placeholder="CTC"
            value={formData.ctc}
            onChange={e => handleChange('ctc', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ctcBase">CTC Base</label>
          <input
            type="number"
            id="ctcBase"
            className="form-control"
            placeholder="CTC Base"
            value={formData.ctcBase}
            onChange={e => handleChange('ctcBase', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="bond">Bond</label>
        <input
          type="number"
          id="bond"
          className="form-control"
          placeholder="Bond in Months"
          value={formData.bond}
          onChange={e => handleChange('bond', e.target.value)}
        />
      </div>
      <div className="company-form__buttons">
        <button type="submit" className="company-button">
          Add Company
        </button>
        <button type="button" className="btn-danger" onClick={handleFormClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;

import React, { useState } from 'react';

const CompanyForm = ({ actionFunction }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [interviewShortlist, setInterviewShortlist] = useState('');
  const [selected, setSelected] = useState('');
  const [locations, setLocations] = useState([]);
  const [cutoff_pg, setCutoff_pg] = useState('');
  const [cutoff_ug, setCutoff_ug] = useState('');
  const [cutoff_12, setCutoff_12] = useState('');
  const [cutoff_10, setCutoff_10] = useState('');
  const [typeOfOffer, setTypeOfOffer] = useState('');
  const [profile, setProfile] = useState('');
  const [ctc, setCtc] = useState('');
  const [ctcBase, setCtcBase] = useState('');
  const [ctcOther, setCtcOther] = useState('');
  const [bond, setBond] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const companyData = {
      name,
      status,
      interviewShortlist,
      selected,
      locations,
      cutoffs: {
        pg: cutoff_pg > 10 ? { percentage: cutoff_pg } : { cgpa: cutoff_pg },
        ug: cutoff_ug > 10 ? { percentage: cutoff_ug } : { cgpa: cutoff_ug },
        twelth: cutoff_12 > 10 ? { percentage: cutoff_12 } : { cgpa: cutoff_12 },
        tenth: cutoff_10 > 10 ? { percentage: cutoff_10 } : { cgpa: cutoff_10 },
      },
      typeOfOffer,
      profile,
      ctc,
      ctcBreakup: {
        base: ctcBase,
        other: ctcOther,
      },
      bond,
    };

    actionFunction(companyData);
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Company Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value={null} default disabled>
            Status
          </option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-3">
        <div>
          <input
            type="number"
            className="form-control"
            placeholder="Interview Shortlist"
            value={interviewShortlist}
            onChange={e => setInterviewShortlist(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Selected"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Locations (Separate multiple locations with commas)"
          value={locations.join(', ')}
          onChange={e => setLocations(e.target.value.split(',').map(loc => loc.trim()))}
        />
      </div>

      <div className="mb-3">
        <div>
          <input
            type="number"
            className="form-control"
            placeholder="Cutoff PG"
            value={cutoff_pg}
            onChange={e => setCutoff_pg(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Cutoff UG"
            value={cutoff_ug}
            onChange={e => setCutoff_ug(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Cutoff 12th"
            value={cutoff_12}
            onChange={e => setCutoff_12(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Cutoff 10th"
            value={cutoff_10}
            onChange={e => setCutoff_10(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <select className="form-select" value={typeOfOffer} onChange={e => setTypeOfOffer(e.target.value)}>
          <option value="PPO">PPO</option>
          <option value="FTE">FTE</option>
          <option value="6M+FTE">6M+FTE</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Profile"
          value={profile}
          onChange={e => setProfile(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <div>
          <input
            type="number"
            className="form-control"
            placeholder="CTC"
            value={ctc}
            onChange={e => setCtc(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="CTC Base"
            value={ctcBase}
            onChange={e => setCtcBase(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="CTC Other"
            value={ctcOther}
            onChange={e => setCtcOther(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Bond"
          value={bond}
          onChange={e => setBond(e.target.value)}
        />
      </div>

      <button type="submit" className="company-button">
        Submit
      </button>
    </form>
  );
};

export default CompanyForm;

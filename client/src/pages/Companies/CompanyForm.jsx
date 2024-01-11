
import React, { useState } from 'react';

const CompanyForm = ({ actionFunction }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [interviewShortlist, setInterviewShortlist] = useState('');
    const [selected, setSelected] = useState('');
    const [locations, setLocations] = useState('');
    const [typeOfOffer, setTypeOfOffer] = useState('');
    const [profile, setProfile] = useState('');
    const [ctc, setCtc] = useState('');
    const [ctcBreakup, setCtcBreakup] = useState('');
    const [bond, setBond] = useState('');
    const [cutoffs, setCutoffs] = useState('');
    
    const handleSubmit = e => {
        e.preventDefault();
    
        const companyData = {
        name,
        status,
        interviewShortlist,
        selected,
        locations,
        typeOfOffer,
        profile,
        ctc,
        ctcBreakup,
        bond,
        cutoffs
        };
    
        actionFunction(companyData);
    };
    
    return (
        <div className="company-form">
        <h2 className="company-form__heading">Add Company</h2>
        <form onSubmit={handleSubmit}>
            <div className="company-form__group">
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="status">Status</label>
            <input
                type="text"
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="interviewShortlist">Interview Shortlist</label>
            <input
                type="text"
                id="interviewShortlist"
                value={interviewShortlist}
                onChange={e => setInterviewShortlist(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="selected">Selected</label>
            <input
                type="text"
                id="selected"
                value={selected}
                onChange={e => setSelected(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="locations">Locations</label>
            <input
                type="text"
                id="locations"
                value={locations}
                onChange={e => setLocations(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="typeOfOffer">Type of Offer</label>
            <input
                type="text"
                id="typeOfOffer"
                value={typeOfOffer}
                onChange={e => setTypeOfOffer(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="profile">Profile</label>
            <input
                type="text"
                id="profile"
                value={profile}
                onChange={e => setProfile(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="ctc">CTC</label>
            <input
                type="text"
                id="ctc"
                value={ctc}
                onChange={e => setCtc(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="ctcBreakup">CTC Breakup</label>
            <input
                type="text"
                id="ctcBreakup"
                value={ctcBreakup}
                onChange={e => setCtcBreakup(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="bond">Bond</label>
            <input
                type="text"
                id="bond"
                value={bond}
                onChange={e => setBond(e.target.value)}
                required
            />
            </div>
            <div className="company-form__group">
            <label htmlFor="cutoffs">Cutoffs</label>
            <input
                type="text"
                id="cutoffs"
                value={cutoffs}
                onChange={e => setCutoffs(e.target.value)}
                required
            />
            </div>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
}

export default CompanyForm;
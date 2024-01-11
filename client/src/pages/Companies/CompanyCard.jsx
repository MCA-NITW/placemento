const CompanyCard = ({ company }) => {
  return (
    <div className="company-card">
      <h2 className="company-card__name">{company.name}</h2>
      <div className="company-card__details">
        <p className="company-card__status">Status: {company.status}</p>
        <p className="company-card__interview">Interview Shortlist: {company.interviewShortlist}</p>
        <p className="company-card__selected">Selected: {company.selected}</p>
        <p className="company-card__locations">Locations: {company.locations.join(', ')}</p>
        <p className="company-card__offer">Type of Offer: {company.typeOfOffer}</p>
        <p className="company-card__profile">Profile: {company.profile}</p>
        <p className="company-card__ctc">CTC: {company.ctc}</p>
        <div className="company-card__ctc-breakup">
          <p>
            CTC Breakup - Base: {company.ctcBreakup.base}, Other: {company.ctcBreakup.other}
          </p>
        </div>
        <p className="company-card__bond">Bond: {company.bond}</p>
        <div className="company-card__cutoffs">
          <p>
            PG Cutoff - CGPA: {company.cutoffs.pg.cgpa}, Percentage: {company.cutoffs.pg.percentage}
          </p>
          <p>
            UG Cutoff - CGPA: {company.cutoffs.ug.cgpa}, Percentage: {company.cutoffs.ug.percentage}
          </p>
          <p>
            12th Cutoff - CGPA: {company.cutoffs.twelth.cgpa}, Percentage: {company.cutoffs.twelth.percentage}
          </p>
          <p>
            10th Cutoff - CGPA: {company.cutoffs.tenth.cgpa}, Percentage: {company.cutoffs.tenth.percentage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

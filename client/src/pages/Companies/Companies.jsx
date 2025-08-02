import CompanyTable from '../../components/Company/CompanyTable';
import './Companies.css';

const Companies = () => {
	return (
		<div className="container companies-container">
			<div className="companies-header animate-fadeInDown">
				<h1 className="companies-title">
					<span className="title-icon animate-float">🏢</span>
					Companies
					<div className="title-underline"></div>
				</h1>
				<p className="companies-subtitle animate-fadeInUp animate-delay-300">
					Explore top recruiting companies and their placement opportunities
				</p>
			</div>
			
			<div className="companies-content animate-fadeInUp animate-delay-500">
				<CompanyTable />
			</div>
		</div>
	);
};

export default Companies;

import CompanyTable from '../../components/Company/CompanyTable';
import './Companies.css';

const Companies = () => {
	return (
		<div className="container page-container">
			<div className="page-header animate-fadeInDown">
				<h1 className="page-title">
					<span className="title-icon animate-float">🏢</span>
					Companies
					<div className="title-underline title-underline-sm"></div>
				</h1>
				<p className="page-subtitle animate-fadeInUp animate-delay-300">
					Explore top recruiting companies and their placement opportunities
				</p>
			</div>
			
			<div className="page-content animate-fadeInUp animate-delay-500">
				<CompanyTable />
			</div>
		</div>
	);
};

export default Companies;

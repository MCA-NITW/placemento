import StudentTable from '../../components/Student/StudentTable';
import './Students.css';

const Students = () => {
	return (
		<div className="container page-container">
			<div className="page-header animate-fadeInDown">
				<h1 className="page-title">
					<span className="title-icon animate-bounce">👥</span>
					Students
					<div className="title-underline title-underline-sm"></div>
				</h1>
				<p className="page-subtitle animate-fadeInUp animate-delay-300">
					Manage and track student information and placement records
				</p>
			</div>
			
			<div className="page-content animate-fadeInUp animate-delay-500">
				<StudentTable />
			</div>
		</div>
	);
};

export default Students;

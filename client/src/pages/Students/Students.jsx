import StudentTable from '../../components/Student/StudentTable';
import './Students.css';

const Students = () => {
	return (
		<div className="container students-container">
			<div className="students-header animate-fadeInDown">
				<h1 className="students-title">
					<span className="title-icon animate-bounce">👥</span>
					Students
					<div className="title-underline"></div>
				</h1>
				<p className="students-subtitle animate-fadeInUp animate-delay-300">
					Manage and track student information and placement records
				</p>
			</div>
			
			<div className="students-content animate-fadeInUp animate-delay-500">
				<StudentTable />
			</div>
		</div>
	);
};

export default Students;

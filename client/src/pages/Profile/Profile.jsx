import { useEffect, useState } from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { getCompany } from '../../api/companyApi';
import { updateStudent } from '../../api/studentApi';
import ToastContent from '../../components/ToastContent/ToastContent';
import getUser from '../../utils/user.js';
import './Profile.css';

const Profile = () => {
	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState('');
	const [isEdited, setIsEdited] = useState(false);
	const [company, setCompany] = useState([]);
	const [prevUser, setPrevUser] = useState({});
	const [roleLabel, setRoleLabel] = useState('');

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getUser();
				setUser(user);
				if (user.role === 'student') setRoleLabel('Student');
				else if (user.role === 'admin') setRoleLabel('Admin');
				else setRoleLabel('Placement Coordinator');
				setPrevUser(user);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const fetchCompany = async (id) => {
			try {
				const response = await getCompany(id);
				response.data.locations.unshift('N/A');
				setCompany(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		if (user.placed) fetchCompany(user.placedAt.companyId);
	}, [user.placedAt, user.placed]);

	const handleInputChange = (name, value) => {
		setUser((prevState) => ({
			...prevState,
			[name]: value
		}));
		setIsEdited(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateStudent(user.id, user);
			setIsEditing('');
			toast.success(<ToastContent res="success" messages={['Profile updated successfully.']} />);
			setIsEdited(false);
			setPrevUser(user);
		} catch (error) {
			console.log(error.response.data.message);
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const onCancel = () => {
		const input = document.getElementById(isEditing);
		input.disabled = true;
		setIsEditing('');
	};

	const inputRenderer = (name, value) => {
		return (
			<input
				type="text"
				name={name}
				value={value}
				id={name}
				onChange={(e) => handleInputChange(name, e.target.value)}
				disabled={isEditing !== name}
			/>
		);
	};

	const dropdownRenderer = (name, value, options) => {
		return (
			<select
				value={value}
				onChange={(event) =>
					handleInputChange('placedAt', {
						...user.placedAt,
						[name]: event.target.value
					})
				}
				disabled={isEditing !== name}
				id={name}
				name={name}
			>
				{options.map((option) => (
					<option value={option} key={option}>
						{option}
					</option>
				))}
			</select>
		);
	};

	const fieldRenderer = (editable, label, name, value, options = [], isDropdown = false) => {
		return (
			<div className="item">
				<label htmlFor={name}>{label}</label>
				{isDropdown ? dropdownRenderer(name, value, options) : inputRenderer(name, value)}
				{editable && (
					<button onClick={() => (isEditing === name ? onCancel() : setIsEditing(name))}>
						{isEditing === name ? <RxCross1 /> : <MdOutlineModeEdit />}
					</button>
				)}
			</div>
		);
	};

	const buttons = () => {
		return (
			<div className="profile-buttons">
				<button onClick={handleSubmit} className="btn btn-primary">
					Update Changes
				</button>
				<button
					onClick={() => {
						setIsEdited(false);
						setUser(prevUser);
					}}
					className="btn btn-primary"
				>
					Discard Changes
				</button>
			</div>
		);
	};

	return (
		<div className="container">
			<h1>My Profile</h1>
			{Object.keys(user).length !== 0 && (
				<div className="profile">
					<div className="profile-items">
						<div className="item-group">
							<h2>Personal Information</h2>
							{fieldRenderer(false, 'Name', 'Name', user.name)}
							{fieldRenderer(false, 'Email', 'email', user.email)}
							{fieldRenderer(false, 'Roll No', 'rollNo', user.rollNo)}
							{fieldRenderer(false, 'Role', 'role', roleLabel)}
						</div>
						{user.placed && (
							<div className="item-group">
								<h2>Company Information</h2>
								{fieldRenderer(false, 'Company', 'company', user.placedAt.companyName)}
								<div className="item-subgroup">
									{fieldRenderer(false, 'CTC', 'ctc', user.placedAt.ctc)}
									{fieldRenderer(false, 'Base', 'base', user.placedAt.ctcBase)}
								</div>
								{fieldRenderer(false, 'Profile', 'profile', user.placedAt.profile)}
								{fieldRenderer(false, 'Offer', 'typeOfOffer', user.placedAt.offer)}
								{fieldRenderer(true, 'Location', 'location', user.placedAt.location, company.locations, true)}
							</div>
						)}
						<div className="item-group">
							<h2>Academic Information</h2>
							<div className="item-subgroup">
								<h3>PG</h3>
								{fieldRenderer(true, 'CGPA', 'pg.cgpa', user.pg.cgpa)}
								{fieldRenderer(true, '%', 'pg.percentage', user.pg.percentage)}
							</div>
							<div className="item-subgroup">
								<h3>UG</h3>
								{fieldRenderer(true, 'CGPA', 'ug.cgpa', user.ug.cgpa)}
								{fieldRenderer(true, '%', 'ug.percentage', user.ug.percentage)}
							</div>
							<div className="item-subgroup">
								<h3>12th</h3>
								{fieldRenderer(true, 'CGPA', 'hsc.cgpa', user.hsc.cgpa)}
								{fieldRenderer(true, '%', 'hsc.percentage', user.hsc.percentage)}
							</div>
							<div className="item-subgroup">
								<h3>10th</h3>
								{fieldRenderer(true, 'CGPA', 'ssc.cgpa', user.ssc.cgpa)}
								{fieldRenderer(true, '%', 'ssc.percentage', user.ssc.percentage)}
							</div>
							<div className="item-subgroup">
								{fieldRenderer(true, 'Backlogs', 'backlogs', user.backlogs)}
								{fieldRenderer(true, 'Gap', 'yearGap', user.totalGapInAcademics)}
							</div>
						</div>
						{isEdited && buttons()}
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;

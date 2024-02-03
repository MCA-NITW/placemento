import { useEffect, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { getStudent, updateStudent } from '../../api/studentApi';
import getUser from '../../utils/user.js';
import './Profile.css';

const Profile = () => {
	const userDetails = getUser();
	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState('');

	useEffect(() => {
		const fetchStudentDetails = async () => {
			try {
				const student = await getStudent(userDetails.id);
				setUser(student.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchStudentDetails();
	}, [userDetails.id]);

	const handleInputChange = (name, value) => {
		setUser((prevState) => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateStudent(userDetails.id, user);
			setUser(user);
			setIsEditing('');
		} catch (error) {
			console.log(error.response.data.message);
		}
	};

	const onCancel = () => {
		const input = document.getElementById(isEditing);
		input.disabled = true;
		setIsEditing('');
	};

	const item = (label, name, value) => {
		return (
			<div className="item">
				<label htmlFor={name}>{label}</label>
				<input
					type="text"
					name={name}
					value={value}
					id={name}
					onChange={(e) => handleInputChange(name, e.target.value)}
					disabled={isEditing !== name}
				/>
				{isEditing === name ? (
					<>
						<button onClick={handleSubmit}>
							<GiCheckMark />
						</button>
						<button onClick={onCancel}>
							<RxCross1 />
						</button>
					</>
				) : (
					<button
						onClick={() => {
							document.getElementById(name).disabled = false;
							setIsEditing(name);
						}}
					>
						<MdOutlineModeEdit />
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="container">
			<h1>My Profile</h1>
			{Object.keys(user).length !== 0 && (
				<div className="profile">
					<div className="item-group">
						<h2>Personal Information</h2>
						{item('Name', 'Name', user.name)}
						{item('Email', 'email', user.email)}
						{item('Roll No', 'rollNo', user.rollNo)}
					</div>
					<div className="item-group">
						<h2>Company Information</h2>
						{item('Company', 'company', user.placedAt.companyName)}
						{item('Location', 'location', user.placedAt.location)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;

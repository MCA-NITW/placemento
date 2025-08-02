import { useState } from 'react';
import { toast } from 'react-toastify';
import { addExperience, updateExperience } from '../../api/experienceApi';
import getUser from '../../utils/user';
import ToastContent from '../ToastContent/ToastContent';

const ExperienceForm = ({ closeExperienceAddModal, initialData, isAdd }) => {
	const [formData, setFormData] = useState({
		companyName: initialData?.companyName || '',
		content: initialData?.content || '',
		tags: initialData?.tags?.join(', ') || '',
		rating: initialData?.rating || 5,
		interviewProcess: initialData?.interviewProcess || '',
		tips: initialData?.tips || '',
		difficulty: initialData?.difficulty || 'Medium'
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const user = await getUser();

			const experienceData = {
				...formData,
				tags: formData.tags
					.split(',')
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0) || ['General'],
				studentDetails: {
					rollNo: user.rollNo,
					name: user.name,
					batch: user.batch
				}
			};

			if (isAdd) {
				await addExperience(experienceData);
			} else {
				await updateExperience(initialData._id, experienceData);
			}

			toast.success(<ToastContent res="Success" messages={[`Experience ${isAdd ? 'added' : 'updated'} successfully!`]} />);
			closeExperienceAddModal(true);
		} catch (error) {
			console.error('Error submitting experience:', error);
			toast.error(<ToastContent res="Error" messages={error.response?.data?.errors || ['Failed to submit experience']} />);
		} finally {
			setLoading(false);
		}
	};

	const inputStyle = {
		width: '100%',
		padding: '0.75rem',
		marginTop: '0.5rem',
		border: '1px solid transparent',
		borderRadius: '0.5rem',
		fontSize: '1rem',
		fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
		outline: 'none',
		background: 'var(--color-bg)',
		color: 'var(--color-white)',
		transition: 'all 0.4s ease-in-out',
		resize: 'vertical'
	};

	const labelStyle = {
		display: 'block',
		marginBottom: '0.25rem',
		fontWeight: '600',
		color: 'var(--color-light)',
		fontSize: '1rem',
		fontFamily: "'Comic Sans MS', 'Comic Sans', cursive"
	};

	const formGroupStyle = {
		marginBottom: '1.5rem'
	};

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1000,
				fontFamily: "'Comic Sans MS', 'Comic Sans', cursive"
			}}
		>
			<form
				onSubmit={handleSubmit}
				style={{
					background: 'var(--color-bg-variant)',
					padding: '2rem',
					borderRadius: '1rem',
					minWidth: '500px',
					maxWidth: '600px',
					maxHeight: '90vh',
					overflowY: 'auto',
					boxShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
					border: '1px solid var(--color-bg-variant-2)',
					opacity: '0.95',
					transition: 'all 0.4s ease-in-out'
				}}
			>
				<div
					style={{
						textAlign: 'center',
						marginBottom: '2rem',
						borderBottom: '2px solid var(--color-primary-variant)',
						paddingBottom: '1rem'
					}}
				>
					<h2
						style={{
							margin: 0,
							color: 'var(--color-primary)',
							fontSize: '2rem',
							fontWeight: '600',
							fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
							textShadow: '0 0 10px rgba(255, 204, 102, 0.3)'
						}}
					>
						{isAdd ? 'Add New Experience' : 'Edit Experience'}
					</h2>
				</div>

				<div style={formGroupStyle}>
					<label style={labelStyle}>Company Name *</label>
					<input
						type="text"
						value={formData.companyName}
						onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
						placeholder="Enter company name"
						required
						style={inputStyle}
						onFocus={(e) => {
							e.target.style.borderColor = 'var(--color-primary-variant)';
							e.target.style.transform = 'scale(1.02)';
							e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
						}}
						onBlur={(e) => {
							e.target.style.borderColor = 'transparent';
							e.target.style.transform = 'scale(1)';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				<div style={formGroupStyle}>
					<label style={labelStyle}>Experience Content *</label>
					<textarea
						value={formData.content}
						onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
						placeholder="Share your detailed experience..."
						required
						rows={6}
						style={inputStyle}
						onFocus={(e) => {
							e.target.style.borderColor = 'var(--color-primary-variant)';
							e.target.style.transform = 'scale(1.02)';
							e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
						}}
						onBlur={(e) => {
							e.target.style.borderColor = 'transparent';
							e.target.style.transform = 'scale(1)';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				<div style={formGroupStyle}>
					<label style={labelStyle}>Tags</label>
					<input
						type="text"
						value={formData.tags}
						onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
						placeholder="Enter tags separated by commas (e.g., Technical, HR, Final Round)"
						style={inputStyle}
						onFocus={(e) => {
							e.target.style.borderColor = 'var(--color-primary-variant)';
							e.target.style.transform = 'scale(1.02)';
							e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
						}}
						onBlur={(e) => {
							e.target.style.borderColor = 'transparent';
							e.target.style.transform = 'scale(1)';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
					<div>
						<label style={labelStyle}>Overall Rating *</label>
						<select
							value={formData.rating}
							onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseInt(e.target.value) }))}
							required
							style={inputStyle}
							onFocus={(e) => {
								e.target.style.borderColor = 'var(--color-primary-variant)';
								e.target.style.transform = 'scale(1.02)';
								e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
							}}
							onBlur={(e) => {
								e.target.style.borderColor = 'transparent';
								e.target.style.transform = 'scale(1)';
								e.target.style.boxShadow = 'none';
							}}
						>
							<option value={1}>1 - Poor</option>
							<option value={2}>2 - Fair</option>
							<option value={3}>3 - Good</option>
							<option value={4}>4 - Very Good</option>
							<option value={5}>5 - Excellent</option>
						</select>
					</div>

					<div>
						<label style={labelStyle}>Difficulty Level *</label>
						<select
							value={formData.difficulty}
							onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
							required
							style={inputStyle}
							onFocus={(e) => {
								e.target.style.borderColor = 'var(--color-primary-variant)';
								e.target.style.transform = 'scale(1.02)';
								e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
							}}
							onBlur={(e) => {
								e.target.style.borderColor = 'transparent';
								e.target.style.transform = 'scale(1)';
								e.target.style.boxShadow = 'none';
							}}
						>
							<option value="Easy">Easy</option>
							<option value="Medium">Medium</option>
							<option value="Hard">Hard</option>
						</select>
					</div>
				</div>

				<div style={formGroupStyle}>
					<label style={labelStyle}>Interview Process</label>
					<textarea
						value={formData.interviewProcess}
						onChange={(e) => setFormData((prev) => ({ ...prev, interviewProcess: e.target.value }))}
						placeholder="Describe the interview process, rounds, etc."
						rows={4}
						style={inputStyle}
						onFocus={(e) => {
							e.target.style.borderColor = 'var(--color-primary-variant)';
							e.target.style.transform = 'scale(1.02)';
							e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
						}}
						onBlur={(e) => {
							e.target.style.borderColor = 'transparent';
							e.target.style.transform = 'scale(1)';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				<div style={formGroupStyle}>
					<label style={labelStyle}>Tips & Advice</label>
					<textarea
						value={formData.tips}
						onChange={(e) => setFormData((prev) => ({ ...prev, tips: e.target.value }))}
						placeholder="Share tips and advice for future candidates..."
						rows={4}
						style={inputStyle}
						onFocus={(e) => {
							e.target.style.borderColor = 'var(--color-primary-variant)';
							e.target.style.transform = 'scale(1.02)';
							e.target.style.boxShadow = '0 0 15px rgba(255, 204, 102, 0.3)';
						}}
						onBlur={(e) => {
							e.target.style.borderColor = 'transparent';
							e.target.style.transform = 'scale(1)';
							e.target.style.boxShadow = 'none';
						}}
					/>
				</div>

				<div
					style={{
						display: 'flex',
						gap: '1rem',
						justifyContent: 'flex-end',
						marginTop: '2rem',
						paddingTop: '1rem',
						borderTop: '2px solid var(--color-primary-variant)'
					}}
				>
					<button
						type="submit"
						disabled={loading}
						style={{
							padding: '1rem 2rem',
							backgroundColor: loading ? 'var(--color-bg-variant-2)' : 'var(--color-primary)',
							color: loading ? 'var(--color-light)' : 'var(--color-bg)',
							border: '1px solid transparent',
							borderRadius: '0.5rem',
							fontSize: '1rem',
							fontWeight: '600',
							fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
							cursor: loading ? 'not-allowed' : 'pointer',
							minWidth: '140px',
							transition: 'all 0.4s ease-in-out',
							textShadow: loading ? 'none' : '0 0 5px rgba(0, 0, 0, 0.3)'
						}}
						onMouseEnter={(e) => {
							if (!loading) {
								e.target.style.backgroundColor = 'var(--color-primary-variant)';
								e.target.style.borderColor = 'var(--color-primary)';
								e.target.style.transform = 'translateY(-2px)';
								e.target.style.boxShadow = '0 5px 15px rgba(255, 204, 102, 0.4)';
							}
						}}
						onMouseLeave={(e) => {
							if (!loading) {
								e.target.style.backgroundColor = 'var(--color-primary)';
								e.target.style.borderColor = 'transparent';
								e.target.style.transform = 'translateY(0)';
								e.target.style.boxShadow = 'none';
							}
						}}
					>
						{loading ? 'Saving...' : isAdd ? 'Add Experience' : 'Update Experience'}
					</button>
					<button
						type="button"
						onClick={() => closeExperienceAddModal(false)}
						disabled={loading}
						style={{
							padding: '1rem 2rem',
							backgroundColor: 'var(--color-bg-variant-2)',
							color: 'var(--color-light)',
							border: '1px solid var(--color-bg-variant-2)',
							borderRadius: '0.5rem',
							fontSize: '1rem',
							fontWeight: '600',
							fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
							cursor: loading ? 'not-allowed' : 'pointer',
							minWidth: '140px',
							transition: 'all 0.4s ease-in-out'
						}}
						onMouseEnter={(e) => {
							if (!loading) {
								e.target.style.backgroundColor = 'var(--color-danger)';
								e.target.style.borderColor = 'var(--color-danger)';
								e.target.style.color = 'var(--color-white)';
								e.target.style.transform = 'translateY(-2px)';
								e.target.style.boxShadow = '0 5px 15px rgba(255, 102, 102, 0.4)';
							}
						}}
						onMouseLeave={(e) => {
							if (!loading) {
								e.target.style.backgroundColor = 'var(--color-bg-variant-2)';
								e.target.style.borderColor = 'var(--color-bg-variant-2)';
								e.target.style.color = 'var(--color-light)';
								e.target.style.transform = 'translateY(0)';
								e.target.style.boxShadow = 'none';
							}
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default ExperienceForm;

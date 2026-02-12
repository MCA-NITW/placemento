import { type FormEvent, type MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { addExperience, updateExperience } from '../../api/experienceApi';
import type { ApiError, ExperienceFormProps } from '../../types';
import getUser from '../../utils/user';
import ToastContent from '../ToastContent/ToastContent';

const ExperienceForm = ({ closeExperienceAddModal, initialData, isAdd }: ExperienceFormProps) => {
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

	const handleSubmit = async (e: FormEvent) => {
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
				await updateExperience(initialData._id!, experienceData);
			}

			toast.success(<ToastContent res="Success" messages={[`Experience ${isAdd ? 'added' : 'updated'} successfully!`]} />);
			closeExperienceAddModal(true);
		} catch (err) {
			const error = err as ApiError;
			console.error('Error submitting experience:', err);
			toast.error(<ToastContent res="Error" messages={error.response?.data?.errors || ['Failed to submit experience']} />);
		} finally {
			setLoading(false);
		}
	};

	const inputStyle: React.CSSProperties = {
		width: '100%',
		padding: '0.75rem',
		marginTop: '0.5rem',
		border: '1px solid transparent',
		borderRadius: '0.5rem',
		fontSize: '1rem',
		fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		outline: 'none',
		background: 'var(--color-bg)',
		color: 'var(--color-white)',
		transition: 'all 0.4s ease-in-out',
		resize: 'vertical'
	};

	const labelStyle: React.CSSProperties = {
		display: 'block',
		marginBottom: '0.25rem',
		fontWeight: '600',
		color: 'var(--color-light)',
		fontSize: '1rem',
		fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
	};

	const formGroupStyle: React.CSSProperties = {
		marginBottom: '1.5rem'
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const target = e.target as HTMLElement;
		target.style.borderColor = 'var(--color-primary-variant)';
		target.style.transform = 'scale(1.02)';
		target.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.2)';
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const target = e.target as HTMLElement;
		target.style.borderColor = 'transparent';
		target.style.transform = 'scale(1)';
		target.style.boxShadow = 'none';
	};

	const handleButtonMouseEnter = (e: MouseEvent<HTMLButtonElement>, isSubmit: boolean) => {
		if (loading) return;
		const target = e.currentTarget;
		if (isSubmit) {
			target.style.backgroundColor = 'var(--color-primary-variant)';
			target.style.borderColor = 'var(--color-primary)';
			target.style.transform = 'translateY(-2px)';
			target.style.boxShadow = '0 5px 15px rgba(124, 58, 237, 0.3)';
		} else {
			target.style.backgroundColor = 'var(--color-danger)';
			target.style.borderColor = 'var(--color-danger)';
			target.style.color = 'var(--color-white)';
			target.style.transform = 'translateY(-2px)';
			target.style.boxShadow = '0 5px 15px rgba(255, 102, 102, 0.4)';
		}
	};

	const handleButtonMouseLeave = (e: MouseEvent<HTMLButtonElement>, isSubmit: boolean) => {
		if (loading) return;
		const target = e.currentTarget;
		if (isSubmit) {
			target.style.backgroundColor = 'var(--color-primary)';
			target.style.borderColor = 'transparent';
			target.style.transform = 'translateY(0)';
			target.style.boxShadow = 'none';
		} else {
			target.style.backgroundColor = 'var(--color-bg-variant-2)';
			target.style.borderColor = 'var(--color-bg-variant-2)';
			target.style.color = 'var(--color-light)';
			target.style.transform = 'translateY(0)';
			target.style.boxShadow = 'none';
		}
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
				fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
							fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
							textShadow: '0 0 10px rgba(124, 58, 237, 0.2)'
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
						onFocus={handleFocus}
						onBlur={handleBlur}
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
						onFocus={handleFocus}
						onBlur={handleBlur}
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
						onFocus={handleFocus}
						onBlur={handleBlur}
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
							onFocus={handleFocus}
							onBlur={handleBlur}
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
							onFocus={handleFocus}
							onBlur={handleBlur}
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
						onFocus={handleFocus}
						onBlur={handleBlur}
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
						onFocus={handleFocus}
						onBlur={handleBlur}
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
							fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
							cursor: loading ? 'not-allowed' : 'pointer',
							minWidth: '140px',
							transition: 'all 0.4s ease-in-out',
							textShadow: loading ? 'none' : '0 0 5px rgba(0, 0, 0, 0.3)'
						}}
						onMouseEnter={(e) => handleButtonMouseEnter(e, true)}
						onMouseLeave={(e) => handleButtonMouseLeave(e, true)}
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
							fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
							cursor: loading ? 'not-allowed' : 'pointer',
							minWidth: '140px',
							transition: 'all 0.4s ease-in-out'
						}}
						onMouseEnter={(e) => handleButtonMouseEnter(e, false)}
						onMouseLeave={(e) => handleButtonMouseLeave(e, false)}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default ExperienceForm;

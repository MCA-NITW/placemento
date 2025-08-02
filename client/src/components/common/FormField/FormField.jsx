import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './FormField.css';

// Reusable Input Field Component
const FormField = ({
	label,
	type = 'text',
	placeholder,
	value,
	onChange,
	name,
	id,
	disabled = false,
	required = false,
	error,
	className = '',
	showPasswordToggle = false,
	suffix,
	prefix,
	step,
	min,
	max,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

	const handlePasswordToggle = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className={`form-field ${className} ${error ? 'form-field--error' : ''}`}>
			{label && (
				<label htmlFor={id || name} className="form-field__label">
					{label}
					{required && <span className="form-field__required">*</span>}
				</label>
			)}

			<div className="form-field__input-container">
				{prefix && <div className="form-field__prefix">{prefix}</div>}

				<input
					type={inputType}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					name={name}
					id={id || name}
					disabled={disabled}
					required={required}
					className="form-field__input"
					step={step}
					min={min}
					max={max}
					{...props}
				/>

				{suffix && <div className="form-field__suffix">{suffix}</div>}

				{showPasswordToggle && type === 'password' && (
					<button
						type="button"
						className="form-field__password-toggle"
						onClick={handlePasswordToggle}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				)}
			</div>

			{error && <div className="form-field__error-message">{error}</div>}
		</div>
	);
};

// Reusable Select Field Component
const SelectField = ({
	label,
	value,
	onChange,
	options = [],
	name,
	id,
	disabled = false,
	required = false,
	error,
	className = '',
	placeholder = 'Select an option',
	...props
}) => {
	return (
		<div className={`form-field ${className} ${error ? 'form-field--error' : ''}`}>
			{label && (
				<label htmlFor={id || name} className="form-field__label">
					{label}
					{required && <span className="form-field__required">*</span>}
				</label>
			)}

			<select
				value={value}
				onChange={onChange}
				name={name}
				id={id || name}
				disabled={disabled}
				required={required}
				className="form-field__select"
				{...props}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{error && <div className="form-field__error-message">{error}</div>}
		</div>
	);
};

// Reusable TextArea Field Component
const TextAreaField = ({
	label,
	placeholder,
	value,
	onChange,
	name,
	id,
	disabled = false,
	required = false,
	error,
	className = '',
	rows = 3,
	...props
}) => {
	return (
		<div className={`form-field ${className} ${error ? 'form-field--error' : ''}`}>
			{label && (
				<label htmlFor={id || name} className="form-field__label">
					{label}
					{required && <span className="form-field__required">*</span>}
				</label>
			)}

			<textarea
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				name={name}
				id={id || name}
				disabled={disabled}
				required={required}
				className="form-field__textarea"
				rows={rows}
				{...props}
			/>

			{error && <div className="form-field__error-message">{error}</div>}
		</div>
	);
};

FormField.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string,
	id: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	error: PropTypes.string,
	className: PropTypes.string,
	showPasswordToggle: PropTypes.bool,
	suffix: PropTypes.node,
	prefix: PropTypes.node,
	step: PropTypes.string,
	min: PropTypes.string,
	max: PropTypes.string
};

SelectField.propTypes = {
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			label: PropTypes.string.isRequired
		})
	),
	name: PropTypes.string,
	id: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	error: PropTypes.string,
	className: PropTypes.string,
	placeholder: PropTypes.string
};

TextAreaField.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string,
	id: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	error: PropTypes.string,
	className: PropTypes.string,
	rows: PropTypes.number
};

export { FormField, SelectField, TextAreaField };

import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
	children,
	variant = 'primary',
	size = 'medium',
	type = 'button',
	disabled = false,
	loading = false,
	onClick,
	className = '',
	icon,
	iconPosition = 'left',
	fullWidth = false,
	...props
}) => {
	const buttonClasses = ['btn', `btn--${variant}`, `btn--${size}`, loading && 'btn--loading', fullWidth && 'btn--full-width', className]
		.filter(Boolean)
		.join(' ');

	const handleClick = (e) => {
		if (!disabled && !loading && onClick) {
			onClick(e);
		}
	};

	return (
		<button type={type} className={buttonClasses} disabled={disabled || loading} onClick={handleClick} {...props}>
			{loading && <span className="btn__spinner" />}
			{!loading && icon && iconPosition === 'left' && <span className="btn__icon btn__icon--left">{icon}</span>}
			<span className="btn__content">{children}</span>
			{!loading && icon && iconPosition === 'right' && <span className="btn__icon btn__icon--right">{icon}</span>}
		</button>
	);
};

// Specialized button components
const PrimaryButton = (props) => <Button variant="primary" {...props} />;
const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
const DangerButton = (props) => <Button variant="danger" {...props} />;
const IconButton = ({ icon, ...props }) => <Button variant="icon" icon={icon} {...props} />;

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'text', 'icon']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	onClick: PropTypes.func,
	className: PropTypes.string,
	icon: PropTypes.node,
	iconPosition: PropTypes.oneOf(['left', 'right']),
	fullWidth: PropTypes.bool
};

PrimaryButton.propTypes = Button.propTypes;
SecondaryButton.propTypes = Button.propTypes;
DangerButton.propTypes = Button.propTypes;
IconButton.propTypes = {
	...Button.propTypes,
	icon: PropTypes.node.isRequired
};

export { Button, DangerButton, IconButton, PrimaryButton, SecondaryButton };

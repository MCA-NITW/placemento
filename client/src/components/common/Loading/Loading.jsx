import PropTypes from 'prop-types';
import './Loading.css';

const Loading = ({ size = 'medium', variant = 'spinner', text = 'Loading...', fullScreen = false, overlay = false, className = '' }) => {
	const containerClasses = ['loading', fullScreen && 'loading--fullscreen', overlay && 'loading--overlay', className].filter(Boolean).join(' ');

	const spinnerClasses = ['loading__spinner', `loading__spinner--${size}`, `loading__spinner--${variant}`].join(' ');

	const renderSpinner = () => {
		switch (variant) {
			case 'dots':
				return (
					<div className={spinnerClasses}>
						<div className="loading__dot"></div>
						<div className="loading__dot"></div>
						<div className="loading__dot"></div>
					</div>
				);
			case 'bars':
				return (
					<div className={spinnerClasses}>
						<div className="loading__bar"></div>
						<div className="loading__bar"></div>
						<div className="loading__bar"></div>
						<div className="loading__bar"></div>
					</div>
				);
			case 'pulse':
				return <div className={`${spinnerClasses} loading__pulse`}></div>;
			default:
				return (
					<div className={spinnerClasses}>
						<div className="loading__circle"></div>
					</div>
				);
		}
	};

	return (
		<div className={containerClasses}>
			<div className="loading__content">
				{renderSpinner()}
				{text && <div className="loading__text">{text}</div>}
			</div>
		</div>
	);
};

Loading.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	variant: PropTypes.oneOf(['spinner', 'dots', 'bars', 'pulse']),
	text: PropTypes.string,
	fullScreen: PropTypes.bool,
	overlay: PropTypes.bool,
	className: PropTypes.string
};

export default Loading;

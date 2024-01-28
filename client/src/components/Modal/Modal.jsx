import PropType from 'prop-types';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, message, buttonTitle, hasInput = null }) => {
	if (!isOpen) return null;
	return ReactDOM.createPortal(
		<div className={classes.overlay}>
			<div className={classes.modal}>
				<p>{message}</p>
				{hasInput && (
					<div className={classes['modal__input-container']}>
						<input type="text" id="input" placeholder={hasInput.placeholder} />
					</div>
				)}
				<div className={classes['modal__buttons']}>
					<button className="btn btn-danger" onClick={onConfirm}>
						{buttonTitle}
					</button>
					<button className="btn btn-primary" onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>,
		document.getElementById('modal-root'),
	);
};

Modal.propTypes = {
	isOpen: PropType.bool.isRequired,
	onClose: PropType.func.isRequired,
	onConfirm: PropType.func.isRequired,
	message: PropType.string.isRequired,
	buttonTitle: PropType.string.isRequired,
};

export default Modal;

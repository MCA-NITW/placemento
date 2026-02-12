import ReactDOM from 'react-dom';
import type { ModalProps } from '../../types';
import classes from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, message, buttonTitle, HasInput = undefined, rootid = 'modal-root' }: ModalProps) => {
	if (!isOpen) return null;
	return ReactDOM.createPortal(
		<div className="overlay">
			<div className={classes.modal}>
				<p>{message}</p>
				{HasInput && <HasInput />}
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
		document.getElementById(rootid)!
	);
};

export default Modal;

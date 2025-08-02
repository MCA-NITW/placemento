import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { DangerButton, SecondaryButton } from '../common';
import classes from './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message, 
  buttonTitle, 
  HasInput = null, 
  rootid = 'modal-root',
  confirmVariant = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;
  
  const ConfirmButton = confirmVariant === 'danger' ? DangerButton : SecondaryButton;
  
  return ReactDOM.createPortal(
    <div className="overlay">
      <div className={classes.modal}>
        <p>{message}</p>
        {HasInput && <HasInput />}
        <div className={classes['modal__buttons']}>
          <ConfirmButton onClick={onConfirm} loading={loading}>
            {buttonTitle}
          </ConfirmButton>
          <SecondaryButton onClick={onClose} disabled={loading}>
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </div>,
    document.getElementById(rootid)
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  HasInput: PropTypes.elementType,
  rootid: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['danger', 'primary']),
  loading: PropTypes.bool
};

export default Modal;

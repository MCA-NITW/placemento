import ReactDOM from 'react-dom';

interface Props {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	message: string;
	confirmText?: string;
	children?: React.ReactNode;
}

const overlay: React.CSSProperties = {
	position: 'fixed',
	inset: 0,
	background: 'rgba(0,0,0,.55)',
	backdropFilter: 'blur(10px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 100,
	animation: 'fadeIn .15s ease'
};
const card: React.CSSProperties = {
	background: 'var(--bg2)',
	border: '1px solid var(--border)',
	borderRadius: 'var(--r3)',
	padding: '2rem',
	minWidth: 320,
	maxWidth: 440,
	textAlign: 'center'
};
const btn: React.CSSProperties = {
	padding: '0.55rem 1.4rem',
	border: 'none',
	borderRadius: 'var(--r1)',
	fontWeight: 600,
	fontSize: '.9rem',
	cursor: 'pointer',
	transition: 'all .15s'
};

const Modal = ({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', children }: Props) => {
	if (!open) return null;
	const root = document.getElementById('modal-root');
	if (!root) return null;

	return ReactDOM.createPortal(
		<div style={overlay} onClick={onClose}>
			<div style={card} onClick={(e) => e.stopPropagation()}>
				{title && <h3 style={{ color: 'var(--primary)', marginBottom: '.75rem', fontSize: '1.1rem' }}>{title}</h3>}
				<p style={{ color: 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.5, fontSize: '.95rem' }}>{message}</p>
				{children && <div style={{ marginBottom: '1rem' }}>{children}</div>}
				<div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center' }}>
					<button onClick={onConfirm} style={{ ...btn, background: 'var(--danger)', color: '#fff' }}>
						{confirmText}
					</button>
					<button onClick={onClose} style={{ ...btn, background: 'var(--bg3)', color: 'var(--dim)' }}>
						Cancel
					</button>
				</div>
			</div>
		</div>,
		root
	);
};

export default Modal;

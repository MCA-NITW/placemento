import type { ToastContentProps } from '../../types';
import './ToastContent.css';

const ToastContent = ({ res, messages }: ToastContentProps) => (
	<div className="toast-content">
		<h3 className="toast-res">{res}</h3>
		<div className="toast-messages">
			{messages.map((message) => (
				<div key={message} className="toast-message">
					{message}
				</div>
			))}
		</div>
	</div>
);

export default ToastContent;

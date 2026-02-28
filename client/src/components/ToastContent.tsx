import type { ToastContentProps } from '../types';

const ToastContent = ({ res, messages }: ToastContentProps) => (
	<div>
		<strong style={{ display: 'block', marginBottom: 3, color: 'var(--text)' }}>{res}</strong>
		{messages.map((m, i) => (
			<div key={i} style={{ fontSize: '.85em', color: 'var(--dim)' }}>
				{m}
			</div>
		))}
	</div>
);

export default ToastContent;

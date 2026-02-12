import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from '../src/components/Modal/Modal';
import ToastContent from '../src/components/ToastContent/ToastContent';

describe('Modal', () => {
	beforeEach(() => {
		const modalRoot = document.createElement('div');
		modalRoot.id = 'modal-root';
		document.body.appendChild(modalRoot);
	});

	afterEach(() => {
		const modalRoot = document.getElementById('modal-root');
		if (modalRoot) document.body.removeChild(modalRoot);
	});

	it('should render when isOpen is true', () => {
		render(
			<Modal
				isOpen={true}
				onClose={vi.fn()}
				onConfirm={vi.fn()}
				message="Are you sure?"
				buttonTitle="Confirm"
			/>
		);

		expect(screen.getByText('Are you sure?')).toBeInTheDocument();
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	it('should not render when isOpen is false', () => {
		render(
			<Modal
				isOpen={false}
				onClose={vi.fn()}
				onConfirm={vi.fn()}
				message="Are you sure?"
				buttonTitle="Confirm"
			/>
		);

		expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
	});

	it('should call onConfirm when confirm button is clicked', () => {
		const onConfirm = vi.fn();

		render(
			<Modal
				isOpen={true}
				onClose={vi.fn()}
				onConfirm={onConfirm}
				message="Delete this?"
				buttonTitle="Delete"
			/>
		);

		fireEvent.click(screen.getByText('Delete'));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it('should call onClose when cancel button is clicked', () => {
		const onClose = vi.fn();

		render(
			<Modal
				isOpen={true}
				onClose={onClose}
				onConfirm={vi.fn()}
				message="Delete this?"
				buttonTitle="Delete"
			/>
		);

		fireEvent.click(screen.getByText('Cancel'));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('ToastContent', () => {
	it('should render success state', () => {
		render(<ToastContent res="success" messages={['Operation completed']} />);
		expect(screen.getByText('Operation completed')).toBeInTheDocument();
	});

	it('should render error state with multiple messages', () => {
		render(<ToastContent res="error" messages={['Error 1', 'Error 2']} />);
		expect(screen.getByText('Error 1')).toBeInTheDocument();
		expect(screen.getByText('Error 2')).toBeInTheDocument();
	});

	it('should render empty messages gracefully', () => {
		const { container } = render(<ToastContent res="success" messages={[]} />);
		expect(container).toBeDefined();
	});
});

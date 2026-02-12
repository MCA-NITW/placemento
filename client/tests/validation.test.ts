import { describe, expect, it } from 'vitest';
import { UTILS, VALIDATION } from '../src/constants/options';

describe('VALIDATION patterns', () => {
	describe('EMAIL_REGEX', () => {
		it('should match valid NITW student emails', () => {
			expect(VALIDATION.EMAIL_REGEX.test('test@student.nitw.ac.in')).toBe(true);
			expect(VALIDATION.EMAIL_REGEX.test('22mcf1r01@student.nitw.ac.in')).toBe(true);
		});

		it('should reject non-NITW emails', () => {
			expect(VALIDATION.EMAIL_REGEX.test('test@gmail.com')).toBe(false);
			expect(VALIDATION.EMAIL_REGEX.test('test@nitw.ac.in')).toBe(false);
			expect(VALIDATION.EMAIL_REGEX.test('')).toBe(false);
		});
	});

	describe('ROLL_NO_REGEX', () => {
		it('should match valid roll numbers', () => {
			expect(VALIDATION.ROLL_NO_REGEX.test('22MCF1R01')).toBe(true);
			expect(VALIDATION.ROLL_NO_REGEX.test('21MCF1R99')).toBe(true);
			expect(VALIDATION.ROLL_NO_REGEX.test('23MCF1R100')).toBe(true);
		});

		it('should reject invalid roll numbers', () => {
			expect(VALIDATION.ROLL_NO_REGEX.test('22MCF1R')).toBe(false);
			expect(VALIDATION.ROLL_NO_REGEX.test('ABCDEFGH')).toBe(false);
			expect(VALIDATION.ROLL_NO_REGEX.test('')).toBe(false);
			expect(VALIDATION.ROLL_NO_REGEX.test('22mcf1r01')).toBe(false);
		});
	});

	describe('PASSWORD_REGEX', () => {
		it('should match valid passwords', () => {
			expect(VALIDATION.PASSWORD_REGEX.test('Password1')).toBe(true);
			expect(VALIDATION.PASSWORD_REGEX.test('MyP4ssword')).toBe(true);
			expect(VALIDATION.PASSWORD_REGEX.test('Abcdef1')).toBe(true);
		});

		it('should reject weak passwords', () => {
			expect(VALIDATION.PASSWORD_REGEX.test('password')).toBe(false); // no uppercase, no digit
			expect(VALIDATION.PASSWORD_REGEX.test('PASSWORD1')).toBe(false); // no lowercase
			expect(VALIDATION.PASSWORD_REGEX.test('Pass1')).toBe(false); // too short
			expect(VALIDATION.PASSWORD_REGEX.test('Abcdef')).toBe(false); // no digit
		});
	});
});

describe('UTILS', () => {
	describe('formatDate', () => {
		it('should format dates as YYYY-MM-DD', () => {
			expect(UTILS.formatDate(new Date(2025, 0, 15))).toBe('2025-01-15');
			expect(UTILS.formatDate(new Date(2024, 11, 5))).toBe('2024-12-05');
		});

		it('should pad single-digit months and days', () => {
			expect(UTILS.formatDate(new Date(2025, 0, 1))).toBe('2025-01-01');
			expect(UTILS.formatDate(new Date(2025, 8, 9))).toBe('2025-09-09');
		});
	});

	describe('formatEmail', () => {
		it('should append NITW domain to bare username', () => {
			expect(UTILS.formatEmail('test')).toBe('test@student.nitw.ac.in');
		});

		it('should trim and lowercase the input', () => {
			expect(UTILS.formatEmail('  TEST  ')).toBe('test@student.nitw.ac.in');
		});
	});

	describe('checkCTCRange', () => {
		it('should return true when no ranges selected', () => {
			expect(UTILS.checkCTCRange(15, [])).toBe(true);
		});

		it('should check < 10 LPA range', () => {
			expect(UTILS.checkCTCRange(5, [10])).toBe(true);
			expect(UTILS.checkCTCRange(15, [10])).toBe(false);
		});

		it('should check 10-20 LPA range', () => {
			expect(UTILS.checkCTCRange(15, [20])).toBe(true);
			expect(UTILS.checkCTCRange(5, [20])).toBe(false);
		});

		it('should check 20-30 LPA range', () => {
			expect(UTILS.checkCTCRange(25, [30])).toBe(true);
			expect(UTILS.checkCTCRange(15, [30])).toBe(false);
		});

		it('should check > 30 LPA range', () => {
			expect(UTILS.checkCTCRange(35, [31])).toBe(true);
			expect(UTILS.checkCTCRange(25, [31])).toBe(false);
		});
	});

	describe('checkBaseRange', () => {
		it('should return true when no ranges selected', () => {
			expect(UTILS.checkBaseRange(10, [])).toBe(true);
		});

		it('should check < 5 LPA range', () => {
			expect(UTILS.checkBaseRange(3, [5])).toBe(true);
			expect(UTILS.checkBaseRange(7, [5])).toBe(false);
		});

		it('should check 5-10 LPA range', () => {
			expect(UTILS.checkBaseRange(7, [10])).toBe(true);
			expect(UTILS.checkBaseRange(3, [10])).toBe(false);
		});

		it('should check 10-15 LPA range', () => {
			expect(UTILS.checkBaseRange(12, [15])).toBe(true);
			expect(UTILS.checkBaseRange(7, [15])).toBe(false);
		});

		it('should check >= 15 LPA range', () => {
			expect(UTILS.checkBaseRange(20, [16])).toBe(true);
			expect(UTILS.checkBaseRange(12, [16])).toBe(false);
		});
	});
});

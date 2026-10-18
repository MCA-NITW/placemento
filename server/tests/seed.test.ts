import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';
import Company from '../src/models/Company';
import User from '../src/models/User';
import { buildDemoData, DEMO_ACCOUNTS, DEMO_CREDENTIAL } from '../src/seed/demoData';
import { seedDatabase } from '../src/seed/seedDatabase';
import validateUser from '../src/utils/validateUser';

describe('demo dataset', () => {
	it('is deterministic', () => {
		expect(buildDemoData()).toEqual(buildDemoData());
	});

	it('passes the signup validator for every user', () => {
		for (const user of buildDemoData().users) {
			expect(validateUser({ ...user, password: DEMO_CREDENTIAL })).toEqual([]);
		}
	});

	it('has unique emails and roll numbers', () => {
		const { users } = buildDemoData();
		expect(new Set(users.map((u) => u.email)).size).toBe(users.length);
		expect(new Set(users.map((u) => u.rollNo)).size).toBe(users.length);
	});
});

describe('seedDatabase', () => {
	it('lets every demo account sign in', async () => {
		await seedDatabase();
		for (const account of DEMO_ACCOUNTS) {
			const res = await request(app).post('/auth/login').send({ email: account.email, password: DEMO_CREDENTIAL });
			expect(res.status).toBe(200);
			expect(res.body.data.token).toBeDefined();
		}
	});

	it('keeps student placedAt and company selections consistent', async () => {
		const summary = await seedDatabase();
		const companies = await Company.find().lean();
		const placed = await User.find({ placed: true }).lean();

		expect(placed).toHaveLength(summary.placedStudents);
		expect(placed.length).toBeGreaterThan(0);
		for (const student of placed) {
			const company = companies.find((c) => String(c._id) === student.placedAt.companyId);
			expect(company).toBeDefined();
			expect(company!.selectedStudentsRollNo).toContain(student.rollNo);
			expect(student.pg.cgpa).toBeGreaterThanOrEqual(company!.cutoffs.pg.cgpa);
		}
		const selections = companies.reduce((n, c) => n + c.selectedStudentsRollNo.length, 0);
		expect(selections).toBe(placed.length);
	});
});

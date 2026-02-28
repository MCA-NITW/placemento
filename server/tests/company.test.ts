import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';
import Company from '../src/models/Company';
import User from '../src/models/User';

async function createVerifiedUser(overrides: Record<string, unknown> = {}) {
	const hashedPassword = await bcrypt.hash('Password1', 4);
	const user = await new User({
		name: 'Admin User',
		email: 'admin@student.nitw.ac.in',
		password: hashedPassword,
		rollNo: '22MCF1R01',
		batch: 2025,
		role: 'admin',
		isVerified: true,
		...overrides
	}).save();
	const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
	return { user, token };
}

const validCompany = {
	name: 'Google',
	status: 'ongoing',
	profileCategory: 'Software',
	typeOfOffer: 'FTE',
	profile: 'SDE',
	ctc: 25,
	ctcBreakup: { base: 20, other: 5 },
	locations: ['Bangalore', 'Hyderabad'],
	bond: 0
};

describe('POST /companies/add', () => {
	it('should create a company as admin', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send(validCompany);

		expect(res.status).toBe(201);
		expect(res.body.name).toBe('Google');

		const company = await Company.findOne({ name: 'Google' });
		expect(company).not.toBeNull();
	});

	it('should reject company creation by student', async () => {
		const { token } = await createVerifiedUser({ role: 'student', email: 'student@student.nitw.ac.in', rollNo: '22MCF1R02' });

		const res = await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send(validCompany);

		expect(res.status).toBe(403);
	});

	it('should validate required fields', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send({ ctc: 10 });

		expect(res.status).toBe(400);
		expect(res.body.errors).toBeDefined();
		expect(res.body.errors.length).toBeGreaterThan(0);
	});

	it('should reject without authentication', async () => {
		const res = await request(app).post('/companies/add').send(validCompany);

		expect(res.status).toBe(401);
	});
});

describe('GET /companies/view', () => {
	it('should return all companies for authenticated user', async () => {
		const { token } = await createVerifiedUser();

		// Create a company first
		await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send(validCompany);

		const res = await request(app).get('/companies/view').set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body.companies)).toBe(true);
		expect(res.body.companies.length).toBe(1);
		expect(res.body.companies[0].name).toBe('Google');
	});

	it('should reject unauthenticated request', async () => {
		const res = await request(app).get('/companies/view');
		expect(res.status).toBe(401);
	});
});

describe('PUT /companies/update/:id', () => {
	it('should update company as admin', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send(validCompany);

		const companyId = createRes.body._id;

		const res = await request(app)
			.put(`/companies/update/${companyId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ ...validCompany, name: 'Google Updated', ctc: 30 });

		expect(res.status).toBe(200);
		expect(res.body.name).toBe('Google Updated');
		expect(res.body.ctc).toBe(30);
	});

	it('should return 404 for non-existent company', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app).put('/companies/update/000000000000000000000000').set('Authorization', `Bearer ${token}`).send(validCompany);

		expect(res.status).toBe(404);
	});
});

describe('DELETE /companies/delete/:id', () => {
	it('should delete company as admin', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app).post('/companies/add').set('Authorization', `Bearer ${token}`).send(validCompany);

		const companyId = createRes.body._id;

		const res = await request(app).delete(`/companies/delete/${companyId}`).set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);

		const company = await Company.findById(companyId);
		expect(company).toBeNull();
	});

	it('should return 404 for non-existent company', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app).delete('/companies/delete/000000000000000000000000').set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(404);
	});
});

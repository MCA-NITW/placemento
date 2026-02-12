import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../src/app';
import User from '../src/models/User';

const validUser = {
	name: 'Test User',
	email: 'test@student.nitw.ac.in',
	password: 'Password1',
	rollNo: '22MCF1R01',
	pg: { cgpa: 8.5, percentage: 80 },
	ug: { cgpa: 7.0, percentage: 70 },
	hsc: { cgpa: 8.0, percentage: 85 },
	ssc: { cgpa: 9.0, percentage: 90 },
	totalGapInAcademics: 0,
	backlogs: 0
};

describe('POST /auth/signup', () => {
	it('should create a new student user', async () => {
		const res = await request(app).post('/auth/signup').send(validUser);

		expect(res.status).toBe(201);
		expect(res.body.messages).toBeDefined();

		const user = await User.findOne({ email: validUser.email });
		expect(user).not.toBeNull();
		expect(user!.role).toBe('student');
		expect(user!.batch).toBe(2025);
	});

	it('should prevent privilege escalation - role field ignored', async () => {
		const res = await request(app)
			.post('/auth/signup')
			.send({ ...validUser, role: 'admin' });

		expect(res.status).toBe(201);

		const user = await User.findOne({ email: validUser.email });
		expect(user).not.toBeNull();
		expect(user!.role).toBe('student');
	});

	it('should prevent privilege escalation - isVerified field ignored', async () => {
		const res = await request(app)
			.post('/auth/signup')
			.send({ ...validUser, isVerified: true });

		expect(res.status).toBe(201);

		const user = await User.findOne({ email: validUser.email });
		expect(user!.isVerified).toBe(false);
	});

	it('should reject duplicate email', async () => {
		await request(app).post('/auth/signup').send(validUser);
		const res = await request(app).post('/auth/signup').send(validUser);

		expect(res.status).toBe(400);
		expect(res.body.errors).toBeDefined();
	});

	it('should hash the password', async () => {
		await request(app).post('/auth/signup').send(validUser);

		const user = await User.findOne({ email: validUser.email });
		expect(user!.password).not.toBe(validUser.password);
		const isMatch = await bcrypt.compare(validUser.password, user!.password);
		expect(isMatch).toBe(true);
	});

	it('should calculate batch from rollNo', async () => {
		await request(app).post('/auth/signup').send(validUser);

		const user = await User.findOne({ email: validUser.email });
		// rollNo starts with 22 → admissionYear = 2022, batch = 2022 + 3 = 2025
		expect(user!.batch).toBe(2025);
	});
});

describe('POST /auth/login', () => {
	it('should login with valid credentials', async () => {
		// Create and verify user first
		await request(app).post('/auth/signup').send(validUser);
		await User.updateOne({ email: validUser.email }, { isVerified: true });

		const res = await request(app)
			.post('/auth/login')
			.send({ email: validUser.email, password: validUser.password });

		expect(res.status).toBe(200);
		expect(res.body.data.token).toBeDefined();

		// Verify JWT payload only has id and role
		const decoded = jwt.verify(res.body.data.token, process.env.JWT_SECRET!) as any;
		expect(decoded.id).toBeDefined();
		expect(decoded.role).toBe('student');
		expect(decoded.email).toBeUndefined();
		expect(decoded.password).toBeUndefined();
	});

	it('should reject unverified user', async () => {
		await request(app).post('/auth/signup').send(validUser);

		const res = await request(app)
			.post('/auth/login')
			.send({ email: validUser.email, password: validUser.password });

		expect(res.status).toBe(401);
	});

	it('should reject wrong password', async () => {
		await request(app).post('/auth/signup').send(validUser);
		await User.updateOne({ email: validUser.email }, { isVerified: true });

		const res = await request(app)
			.post('/auth/login')
			.send({ email: validUser.email, password: 'WrongPass1' });

		expect(res.status).toBe(401);
	});

	it('should reject non-NITW email', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: 'test@gmail.com', password: 'Password1' });

		expect(res.status).toBe(400);
	});

	it('should return 404 for non-existent user', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({ email: 'nobody@student.nitw.ac.in', password: 'Password1' });

		expect(res.status).toBe(404);
	});
});

describe('Authentication middleware', () => {
	it('should reject request without token', async () => {
		const res = await request(app).get('/companies/view');

		expect(res.status).toBe(401);
	});

	it('should reject request with invalid token', async () => {
		const res = await request(app)
			.get('/companies/view')
			.set('Authorization', 'Bearer invalidtoken');

		expect(res.status).toBe(401);
	});

	it('should reject expired token', async () => {
		const expiredToken = jwt.sign(
			{ id: 'fakeid', role: 'student' },
			process.env.JWT_SECRET!,
			{ expiresIn: '-1s' }
		);

		const res = await request(app)
			.get('/companies/view')
			.set('Authorization', `Bearer ${expiredToken}`);

		expect(res.status).toBe(401);
	});
});

describe('404 handler', () => {
	it('should return 404 for unknown routes', async () => {
		const res = await request(app).get('/nonexistent-route');

		expect(res.status).toBe(404);
		expect(res.body.message).toBe('Route not found');
	});
});

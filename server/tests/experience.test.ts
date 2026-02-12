import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';

async function createVerifiedUser(overrides: Record<string, unknown> = {}) {
	const hashedPassword = await bcrypt.hash('Password1', 4);
	const defaults = {
		name: 'Test Student',
		email: 'student@student.nitw.ac.in',
		password: hashedPassword,
		rollNo: '22MCF1R01',
		batch: 2025,
		role: 'student',
		isVerified: true
	};
	const user = await new User({ ...defaults, ...overrides }).save();
	const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
	return { user, token };
}

const validExperience = {
	companyName: 'Google',
	content: 'Great interview experience with 3 rounds of coding interviews.'
};

describe('POST /experiences/add', () => {
	it('should create an experience', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		expect(res.status).toBe(201);
		expect(res.body.savedExperience.companyName).toBe('Google');
		expect(res.body.savedExperience.studentDetails.rollNo).toBe('22MCF1R01');
	});

	it('should validate required fields', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send({});

		expect(res.status).toBe(400);
		expect(res.body.errors.length).toBeGreaterThan(0);
	});
});

describe('GET /experiences/view', () => {
	it('should return all experiences', async () => {
		const { token } = await createVerifiedUser();

		await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		const res = await request(app)
			.get('/experiences/view')
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.experiences.length).toBe(1);
	});
});

describe('PUT /experiences/update/:id', () => {
	it('should allow owner to update their experience', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		const res = await request(app)
			.put(`/experiences/update/${experienceId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ companyName: 'Microsoft', content: 'Updated experience content' });

		expect(res.status).toBe(200);
		expect(res.body.savedExperience.companyName).toBe('Microsoft');
	});

	it('should prevent non-owner from updating experience', async () => {
		const { token: ownerToken } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${ownerToken}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		// Create a different user
		const { token: otherToken } = await createVerifiedUser({
			email: 'other@student.nitw.ac.in',
			rollNo: '22MCF1R02',
			name: 'Other Student'
		});

		const res = await request(app)
			.put(`/experiences/update/${experienceId}`)
			.set('Authorization', `Bearer ${otherToken}`)
			.send({ companyName: 'Hacked', content: 'Hacked content' });

		expect(res.status).toBe(403);
	});
});

describe('DELETE /experiences/delete/:id', () => {
	it('should allow owner to delete their experience', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		const res = await request(app)
			.delete(`/experiences/delete/${experienceId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
	});

	it('should prevent non-owner from deleting experience', async () => {
		const { token: ownerToken } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${ownerToken}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		const { token: otherToken } = await createVerifiedUser({
			email: 'other@student.nitw.ac.in',
			rollNo: '22MCF1R02',
			name: 'Other Student'
		});

		const res = await request(app)
			.delete(`/experiences/delete/${experienceId}`)
			.set('Authorization', `Bearer ${otherToken}`);

		expect(res.status).toBe(403);
	});

	it('should return 404 for non-existent experience', async () => {
		const { token } = await createVerifiedUser();

		const res = await request(app)
			.delete('/experiences/delete/000000000000000000000000')
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(404);
	});
});

describe('POST /experiences/comment/add/:id', () => {
	it('should add a comment to an experience', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		const res = await request(app)
			.post(`/experiences/comment/add/${experienceId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ comment: 'Great experience!' });

		expect(res.status).toBe(200);
		expect(res.body.savedExperience.Comments).toContain('Great experience!');
	});
});

describe('DELETE /experiences/comment/delete/:id/:commentId', () => {
	it('should delete a comment by index', async () => {
		const { token } = await createVerifiedUser();

		const createRes = await request(app)
			.post('/experiences/add')
			.set('Authorization', `Bearer ${token}`)
			.send(validExperience);

		const experienceId = createRes.body.savedExperience._id;

		// Add two comments
		await request(app)
			.post(`/experiences/comment/add/${experienceId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ comment: 'First comment' });

		await request(app)
			.post(`/experiences/comment/add/${experienceId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ comment: 'Second comment' });

		// Delete the first comment (index 0)
		const res = await request(app)
			.delete(`/experiences/comment/delete/${experienceId}/0`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.savedExperience.Comments).toHaveLength(1);
		expect(res.body.savedExperience.Comments[0]).toBe('Second comment');
	});
});

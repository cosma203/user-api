import { Types } from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { User } from '../../models/User';

describe('USERS', () => {
  const baseUrl = '/api/v1/users';

  let email: string, givenName: string, familyName: string, userId: Types.ObjectId | string;

  beforeEach(() => {
    email = 'test@test.com';
    givenName = 'John';
    familyName = 'Doe';
  });

  describe(`POST ${baseUrl}`, () => {
    it('should return with the status code of 400 if email is not provided', async () => {
      const response = await request(app).post(baseUrl).send({ givenName, familyName }).expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('email');
    });

    it('should return with the status code of 400 if invalid email is provided', async () => {
      email = 'test';

      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('email');
    });

    it('should return with the status code of 400 if givenName is not provided', async () => {
      const response = await request(app).post(baseUrl).send({ email, familyName }).expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('givenName');
    });

    it('should return with the status code of 400 if provided givenName is less that 3 characters long', async () => {
      givenName = 'Jo';

      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('givenName');
    });

    it('should return with the status code of 400 if provided givenName is more that 20 characters long', async () => {
      givenName = 'J'.repeat(21);

      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('givenName');
    });

    it('should return with the status code of 400 if familyName is not provided', async () => {
      const response = await request(app).post(baseUrl).send({ email, givenName }).expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('familyName');
    });

    it('should return with the status code of 400 if provided familyName is less that 3 characters long', async () => {
      familyName = 'Do';

      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('familyName');
    });

    it('should return with the status code of 400 if provided familyName is more that 20 characters long', async () => {
      familyName = 'D'.repeat(21);

      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('familyName');
    });

    it('should return with the status code of 400 if user with the provided email already exists', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(201);

      const user = await User.findById(response.body.id);

      expect(user).toBeTruthy();

      await request(app).post(baseUrl).send({ email, givenName, familyName }).expect(400);
    });

    it('should return with the status code of 201 if user is successfully created', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send({ email, givenName, familyName })
        .expect(201);

      const user = await User.findById(response.body.id);

      expect(user).toBeTruthy();
    });
  });

  describe(`GET ${baseUrl}`, () => {
    email = 'test@test.com';
    givenName = 'John';
    familyName = 'Doe';

    const userOne = { email, givenName, familyName };
    const userTwo = { email: 'test2@test2.com', givenName, familyName };
    const userThree = { email: 'test3@test3.com', givenName, familyName };

    beforeEach(async () => {
      await User.insertMany([userOne, userTwo, userThree]);
    });

    it('should return with the status code of 200 if users are successfully fetched from the database', async () => {
      const response = await request(app).get(baseUrl).expect(200);
      const responseBody = response.body;

      expect(responseBody.length).toEqual(3);
      expect(responseBody[0].email).toEqual(userOne.email);
      expect(responseBody[1].email).toEqual(userTwo.email);
      expect(responseBody[2].email).toEqual(userThree.email);
    });
  });

  describe(`GET ${baseUrl}/:id`, () => {
    email = 'test@test.com';
    givenName = 'John';
    familyName = 'Doe';

    beforeEach(async () => {
      userId = new Types.ObjectId();

      await User.insertMany([{ _id: userId, email, givenName, familyName }]);
    });

    it('should return with the status code of 400 if invalid id is provided', async () => {
      userId = '123';

      await request(app).get(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 400 if user with the provided id does not exist', async () => {
      userId = new Types.ObjectId();

      await request(app).get(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 200 if user with the provided id is successfully feteched from the database', async () => {
      const response = await request(app).get(`${baseUrl}/${userId}`).expect(200);

      expect(response.body.id).toEqual(userId.toString());
    });
  });

  describe(`PUT ${baseUrl}/:id`, () => {
    beforeEach(async () => {
      email = 'test@test.com';
      givenName = 'John';
      familyName = 'Doe';

      userId = new Types.ObjectId();

      await User.insertMany({ _id: userId, email, givenName, familyName });
    });

    it('should return with the status code of 400 if invalid id is provided', async () => {
      userId = '123';

      await request(app).put(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 400 if user with the provided id does not exist', async () => {
      userId = new Types.ObjectId();

      await request(app).put(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 400 if invalid email is provided', async () => {
      email = 'test';

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('email');
    });

    it('should return with the status code of 400 if provided givenName is less that 3 characters long', async () => {
      givenName = 'Jo';

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('givenName');
    });

    it('should return with the status code of 400 if provided givenName is more that 20 characters long', async () => {
      givenName = 'J'.repeat(21);

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('givenName');
    });

    it('should return with the status code of 400 if provided familyName is less that 3 characters long', async () => {
      familyName = 'Do';

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('familyName');
    });

    it('should return with the status code of 400 if provided familyName is more that 20 characters long', async () => {
      familyName = 'D'.repeat(21);

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(400);

      expect(response.body.errors).toBeTruthy();
      expect(response.body.errors[0].field).toEqual('familyName');
    });

    it('should return with the status code of 200 if user with the provided id is successfully updated in the database', async () => {
      email = 'test2@test2.com';
      givenName = 'James';
      familyName = 'Smith';

      const response = await request(app)
        .put(`${baseUrl}/${userId}`)
        .send({ email, givenName, familyName })
        .expect(200);

      expect(response.body.id).toEqual(userId.toString());
      expect(response.body.email).toEqual(email);

      const user = await User.findById(userId);

      expect(user!.email).toEqual(email);
    });
  });

  describe(`DELETE ${baseUrl}/:id`, () => {
    beforeEach(async () => {
      email = 'test@test.com';
      givenName = 'John';
      familyName = 'Doe';

      userId = new Types.ObjectId();

      await User.insertMany({ _id: userId, email, givenName, familyName });
    });

    it('should return with the status code of 400 if invalid id is provided', async () => {
      userId = '123';

      await request(app).get(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 400 if user with the provided id does not exist', async () => {
      userId = new Types.ObjectId();

      await request(app).get(`${baseUrl}/${userId}`).expect(400);
    });

    it('should return with the status code of 200 if user with the provided id is successfully deleted from the database', async () => {
      const response = await request(app).delete(`${baseUrl}/${userId}`).expect(200);

      expect(response.body.id).toEqual(userId.toString());

      const user = await User.findById(userId);

      expect(user).toBeFalsy();
    });
  });
});

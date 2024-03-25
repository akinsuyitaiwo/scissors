import supertest from "supertest";
import createServer  from "../utils/server";
import mongoose from "mongoose";
import { user1, user2, user3, user4, user5, user6, user7 } from "./testData/user";
import config from "../config";


const request = supertest(createServer());

describe("User Endpoint", () => {
	beforeAll( async() => {
		await mongoose.connect(config.MONGO_URL);
	}, 10000);

	afterAll(async() => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	}, 10000);

	describe("User Registration", () => {
		it("should create user", async() => {
			const { status } = await request.post("/users/register").send(user3);

			expect(status).toEqual(201);
		});
	});

	describe("User Registration with incorrect details", () => {
		it("should return 400", async() => {
			await request.post("/users/register").send(user1).expect(400);
		});
	});

	describe("User Registration with existing details", () => {
		it("should return 409", async() => {
			await request.post("/users/register").send(user2).expect(409);
		});
	});

	describe("User Login", () => {
		it("should login user", async() => {
			const { status } = await request.post("/users/login").send(user7);

			expect(status).toEqual(200);

		});
	});

	describe("User login with incomplete details", () => {
		it("should return 400", async() => {
			const { status} = await request.post("/users/login").send(user4);

			expect(status).toEqual(400);
		});
	});

	describe("User login with incorrect details", () => {
		it("should return 404", async() => {
			const { status} = await request.post("/users/login").send(user5);

			expect(status).toEqual(409);
		});
	});
});
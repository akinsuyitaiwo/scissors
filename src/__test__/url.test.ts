import supertest from "supertest";
import createServer  from "../utils/server";
import mongoose from "mongoose";
import config from "../config";
import { loginAndSetToken } from "./setUp";
import { url1, url2, url3, url4, url5, url6, url7 } from "./testData/url";

const request = supertest(createServer());

describe("Url Endpoint", () => {
	beforeAll( async() => {
		await mongoose.connect(config.MONGO_URL);
	}, 10000);

	afterAll(async() => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	}, 10000);

	describe("Shorten URL", () => {
		it("Should shorten a long url", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/url/create").send(url1).set("Cookie", `token=${token}`);

			expect(status).toEqual(201);
		});
	});

	describe("Unauthenticated Route", () => {
		it("Return unauthorized user", async() => {
			const { status } = await request.post("/url/create").send(url1);

			expect(status).toEqual(403);
		});
	});


    
	describe("Incorrect inputed data", () => {
		it("should return 400 error", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/url/create").send(url2).set("Cookie", `token=${token}`);

			expect(status).toEqual(400);
		});
	});

	describe("Customize URL", () => {
		it("Should customize and shorten a long url", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/url/customize").send(url5).set("Cookie", `token=${token}`);

			expect(status).toEqual(201);
		});
	});

	describe("Unauthenticated Route", () => {
		it("Return unauthorized user", async() => {
			const { status } = await request.post("/url/customize").send(url7);

			expect(status).toBe(403);
		});
	});
    
	describe("Already in use shortCode", () => {
		it("should return shortCode in use", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/url/customize").send(url6).set("Cookie", `token=${token}`);

			expect(status).toBe(409);
		});
	});
    
	describe("Incorrect inputed data", () => {
		it("should return 400 error", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.post("/url/customize").send(url7).set("Cookie", `token=${token}`);

			expect(status).toBe(400);
		});
	});

	describe("View all links shortened", () => {
		it("should view all shorten links", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get("/url/").set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});

	describe("View a shortened link", () => {
		it("should redirect", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get(`/url/${url6.shortCode}`).set("Cookie", `token=${token}`);

			expect(status).toBe(302);
		});
	});

	describe("Analytics", () => {
		it("Should get analytics of a shortened link", async() => {
			const token = await loginAndSetToken();
			const { status } = await request.get(`/url/analytics/${url6.shortCode}`).set("Cookie", `token=${token}`);

			expect(status).toBe(200);
		});
	});
});
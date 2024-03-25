import supertest from "supertest";
import createServer  from "../utils/server";
import database from "../config/database";
import {  user7 } from "./testData/user";

const request = supertest(createServer());


export const loginAndSetToken = async () => {
	try {
		await database.connect();
		const response = await request.post("/users/login").send(user7);
		const token = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
		return token;
	} catch (error) {
		console.error("Error logging in user:", error);
	}
};
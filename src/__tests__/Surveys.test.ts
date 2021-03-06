import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';
import { getConnection } from 'typeorm';

describe("Surveys", () => {
    beforeAll(async () => {
        const conn = await createConnection();
        await conn.runMigrations();
    });

    afterAll(async () => {
        const conn = getConnection();
        await conn.dropDatabase();
        await conn.close();
    });

    it("Should be able to create a new survey", async () =>{
        const response = await request(app)
        .post("/surveys")
        .send({
            title: "Title Example",
            description: "Description example"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });
    
    it("Should be able to get all surveys" , async () => {
        await request(app)
        .post("/surveys")
        .send({
            title: "Title Example",
            description: "Description example"
        });

        const response = await request(app)
        .get('/surveys');

        expect(response.body.length).toBe(2);
    });
});
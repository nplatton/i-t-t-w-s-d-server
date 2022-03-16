describe("successful endpoints", () => {
  let api;
  let token;

  beforeAll(async () => {
    api = app.listen(port, () =>
      console.log("Test server running on port 5000...")
    );
    await resetTestDB();
    const loginResponse = await request(api)
      .post("/auth/login")
      .send({ username: "nplatton", password: "nplatton" })
      .set("Accept", "application/json");
    token = loginResponse._body.token;
  }, 100000);

  beforeEach(async () => {
    console.log("-----------------------------------");
    await resetTestDB();
  });

  afterAll(async () => {
    console.log("Stopping test server");
    await api.close((err) => {});
  });

  describe("user", () => {
    describe("authenticated index", () => {
      test("it should return all users", async () => {
        console.log(token);
        const res = await request(api)
          .get("/users")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(5);
      });
    });

    describe("unauthenticated index", () => {
      test("it should return 403 in case of invalid token", async () => {
        const res = await request(api)
          .get("/users")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated findByUsername", () => {
      test("it should retrieve user based on username", async () => {
        const res = await request(api)
          .get("/users/jalexxx")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toEqual("jalexxx");
      });
    });

    describe("unauthenticated findByUsername", () => {
      test("it should return 403 if invalid token sent", async () => {
        const res = await request(api)
          .get("/users/jalexxx")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });
  });

  describe("score", () => {
    describe("authenticated index", () => {
      test("it should retrieve all users scores", async () => {
        const res = await request(api)
          .get("/scores")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(6);
      });
    });

    describe("unauthenticated index", () => {
      test("it should throw 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated findByUsername", () => {
      test("it should retrieve all cat data for user", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });

      test("it should return 404 if no user", async () => {
        const res = await request(api)
          .get("/scores/username/tester")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated findByUsername", () => {
      test("it returns 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated findByCategory", () => {
      test("it should retrieve all scores for a category", async () => {
        const res = await request(api)
          .get("/scores/cat/movies")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });

      test("it should retrieve all scores for a category", async () => {
        const res = await request(api)
          .get("/scores/cat/physics")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
      });

      test("it should return 404 if no category", async () => {
        const res = await request(api)
          .get("/scores/cat/test")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated findByCategory", () => {
      test("it returns 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/cat/test")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated findByUsernameAndCat", () => {
      test("it should retrieve score for given username and category", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx/cat/movies")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.score).toEqual(18);
      });

      test("it should retrieve score for given username and category", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/animals")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.score).toEqual(23);
      });

      test("it should return 404 if no score for given pair", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/movies")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated findByUsernameAndCat", () => {
      test("should return 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/movies")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated returnLeadersBoard", () => {
      test("it retrieves array of highest scores", async () => {
        const res = await request(api)
          .get("/scores/leadersboard")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(4);
      });
    });

    describe("unauthenticated returnLeadersBoard", () => {
      test("it retrieves array of highest scores", async () => {
        const res = await request(api)
          .get("/scores/leadersboard")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated destroy", () => {
      test("it destroys a users data", async () => {
        const res = await request(api)
          .delete("/scores/username/nplatton")
          .set("Accept", "application/json")
          .set("authorization", `${token}`)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(204);
      });
    });

    describe("unauthenticated destroy", () => {
      test("it won't destroy a users data if bad token given", async () => {
        const res = await request(api)
          .delete("/scores/username/nplatton")
          .set("Accept", "application/json")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });
  });

  describe("auth", () => {
    describe("login", () => {
      test("it ", async () => {
        const res = await request(api)
          .post("/auth/login")
          .send(JSON.stringify({ username: "jalexxx", password: "jalexxx" }))
          .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe("register", () => {
      test("it ", async () => {
        const res = await request(api)
          .post("/auth/register")
          .send(JSON.stringify({ username: "jalexxx", password: "jalexxx" }))
          .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(201);
        expect(res.body.msg).toMatch(/user created/i);
      });
    });
  });
});

const BASE_URL = "http://localhost:4000/api/rounds";

const mockRound = {
  id: 1,
  course: "emerald links",
  username: "steve",
  scores: [6, 4, 3, 5, 5, 6, 3, 5, 5, 4, 5, 5, 6, 4, 3, 4, 4, 3],
};

const request = async (url, method, body) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      ...(body && {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    });
    const { data, error } = await response.json();

    return { status: response.status, data, error };
  } catch (error) {
    console.log("!!!", error.message);
    return {
      status: 500,
      data: null,
      error: error.message ?? "something went wrong",
    };
  }
};

beforeEach(async () => {
  // will reset round 1,
  // NOTE this is not a best practice
  // tests should be completely independent
  await request("/1", "put", mockRound);
});

describe("#create", () => {
  it("happy path", async () => {
    // Arrange
    const input = {
      course: "emerald links",
      username: "tim",
      scores: [3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 3, 4, 5],
    };

    // Act
    const res = await request("/", "post", input);

    // Assert
    expect(res.status).toBe(201);
    expect(res.data).toMatchObject(input);
  });
  it("should throw 400 with missing data", async () => {
    // Arrange
    const input = {
      course: "emerald links",
      username: "tim",
    };

    // Act
    const res = await request("/", "post", input);

    // Assert
    expect(res.status).toBe(400);
    expect(res).toHaveProperty("error");
  });
  it("should throw 400 with invalid scores length", async () => {
    // Arrange
    const input = {
      course: "emerald links",
      username: "tim",
      scores: [3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 3, 4],
    };

    // Act
    const res = await request("/", "post", input);

    // Assert
    expect(res.status).toBe(400);
    expect(res).toHaveProperty("error");
  });
});
describe("#getAll", () => {
  it("happy path", async () => {
    // Arrange
    // Act
    const res = await request("/", "get");

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    const [data] = res.data;
    expect(data).toHaveProperty("course");
    expect(data).toHaveProperty("username");
    expect(data.scores?.length).toBe(18);
  });
});
describe("getOne", () => {
  it("happy path", async () => {
    // Arrange
    // this assumes you used the example data
    const id = 1;
    // Act
    const res = await request(`/${id}`, "get");

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockRound);
  });
  it("should throw 404", async () => {
    // Arrange
    // this assumes you used the example data
    const id = 999;
    // Act
    const res = await request(`/${id}`, "get");

    // Assert
    expect(res.status).toBe(404);
    expect(res).toHaveProperty("error");
  });
});
describe("#replaceOne", () => {
  it("happy path", async () => {
    // Arrange
    const id = 1;
    const input = {
      course: "replaced course",
      username: "tim replacement",
      scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };

    // Act
    const res = await request(`/${id}`, "put", input);

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id, ...input });
  });
  it("should throw 400 with missing data", async () => {
    // Arrange
    const id = 1;
    const input = {
      course: "replaced course",
      username: "tim replacement",
    };

    // Act
    const res = await request(`/${id}`, "put", input);

    // Assert
    expect(res.status).toBe(400);
    expect(res).toHaveProperty("error");
  });
  it("should throw 400 with invalid scores length", async () => {
    // Arrange
    const id = 1;
    const input = {
      course: "replaced course",
      username: "tim replacement",
      scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // too many
    };

    // Act
    const res = await request(`/${id}`, "put", input);

    // Assert
    expect(res.status).toBe(400);
    expect(res).toHaveProperty("error");
  });
});
describe("#updateOne", () => {
  it("should update course name", async () => {
    // Arrange
    const id = 1;
    const input = {
      course: "updated course",
    };

    // Act
    const res = await request(`/${id}`, "PATCH", input);

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ...mockRound, ...input });
  });
  it("should update username", async () => {
    // Arrange
    const id = 1;
    const input = {
      username: "updated username",
    };

    // Act
    const res = await request(`/${id}`, "PATCH", input);

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ...mockRound, ...input });
  });
  it("should update scores", async () => {
    // Arrange
    const id = 1;
    const input = {
      scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };

    // Act
    const res = await request(`/${id}`, "PATCH", input);

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ...mockRound, ...input });
  });
  it("should return 400 with invalid scores", async () => {
    // Arrange
    const id = 1;
    const input = {
      scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };

    // Act
    const res = await request(`/${id}`, "PATCH", input);

    // Assert
    expect(res.status).toBe(400);
    expect(res).toHaveProperty("error");
  });
  it("should return 404 if not found", async () => {
    // Arrange
    const id = 999;
    const input = {
      scores: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    };

    // Act
    const res = await request(`/${id}`, "PATCH", input);

    // Assert
    expect(res.status).toBe(404);
    expect(res).toHaveProperty("error");
  });
});
describe("#deleteOne", () => {
  it("happy path", async () => {
    // Arrange
    const id = 1;

    // Act
    const res = await request(`/${id}`, "DELETE");

    // Assert
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ...mockRound });
  });
  it("should return 404 if not found", async () => {
    // Arrange
    const id = 999;

    // Act
    const res = await request(`/${id}`, "DELETE");

    // Assert
    expect(res.status).toBe(404);
    expect(res).toHaveProperty("error");
  });
});

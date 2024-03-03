import { UserRepository } from "@/modules/users/users-repository";

afterEach(async () => {
  await new UserRepository().deleteMany();
});

describe("UserRepository", () => {
  it("should find user by id", async () => {
    const userRepository = new UserRepository();
    const _user = await userRepository.create({
      email: "test@gmail.com",
      firstName: "firstName",
      lastName: "lastName",
      password: "test123",
    });
    const user = await userRepository.findById(_user.id);

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
  });

  it("should create user", async () => {
    const userRepository = new UserRepository();
    const newUser = await userRepository.create({
      email: "test@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });

    const user = await userRepository.findById(newUser.id);
    expect(user).toHaveProperty("id");
  });

  it("should deleteMany user", async () => {
    const userRepository = new UserRepository();
    await userRepository.create({
      email: "test@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });
    await userRepository.create({
      email: "test12@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });
    await userRepository.deleteMany();
    const users = await userRepository.find();
    expect(users).toHaveLength(0);
  });

  it("should updateMany user", async () => {
    const userRepository = new UserRepository();
    await userRepository.create({
      email: "test@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });

    await userRepository.updateMany({ firstName: "test2" });
    const users = await userRepository.find();
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("firstName", "test2");
  });

  it("should delete user", async () => {
    const userRepository = new UserRepository();
    const newUser = await userRepository.create({
      email: "test@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });

    await userRepository.delete(newUser.id);
    const user = await userRepository.findById(newUser.id);

    expect(user).toBeUndefined();
  });

  it("should find user", async () => {
    const userRepository = new UserRepository();
    await userRepository.create({
      email: "test@gmail.com",
      firstName: "test",
      lastName: "test",
      password: "test",
    });

    const users = await userRepository.find();
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("firstName", "test");
  });
});

import usersDbConnection from "../config/storage-users-db";

export interface User {
  id: number;
  username: string;
  usersurname: string;
  email: string;
}

export async function createUser(user: User): Promise<void> {
  const connection = await usersDbConnection.getConnection();
  await connection.execute(
    "INSERT INTO Users (username, usersurname, email) VALUES (?, ?, ?)",
    [user.username, user.usersurname, user.email]
  );
  connection.release();
}

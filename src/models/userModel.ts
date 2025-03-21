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

export async function getUserByEmail(email: string): Promise<User | null> {
  const connection = await usersDbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return null;
    }
    return rows[0] as User;
  } finally {
    connection.release();
  }
}

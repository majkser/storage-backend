import dbConnection from "../config/db-connection";

export interface User {
  id: number;
  username: string;
  usersurname: string;
  email: string;
}

export async function createUser(user: User): Promise<void> {
  const connection = await dbConnection.getConnection();
  await connection.execute(
    "INSERT INTO Users (username, usersurname, email) VALUES (?, ?, ?)",
    [user.username, user.usersurname, user.email]
  );
  connection.release();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const connection = await dbConnection.getConnection();
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

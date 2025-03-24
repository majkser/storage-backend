import dbConnection from "../config/db-connection";

export interface User {
  id?: number;
  googleId?: string;
  userName: string;
  userSurname: string;
  email: string;
}

export async function createUser(user: User): Promise<void> {
  const connection = await dbConnection.getConnection();
  try {
    await connection.execute(
      "INSERT INTO Users (google_id, username, usersurname, email) VALUES (?, ?, ?, ?)",
      [user.googleId, user.userName, user.userSurname, user.email]
    );
  } finally {
    connection.release();
  }
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

export async function getUserByGoogleId(
  googleId: string
): Promise<User | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM Users WHERE google_id = ?",
      [googleId]
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return null;
    }
    return rows[0] as User;
  } finally {
    connection.release();
  }
}

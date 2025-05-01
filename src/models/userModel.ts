import dbConnection from "../config/db-connection";

export interface User {
  id?: string;
  googleId?: string;
  username: string;
  usersurname: string;
  email: string;
  photo?: string;
}

export async function createUser(user: User): Promise<void> {
  const connection = await dbConnection.getConnection();
  try {
    await connection.execute(
      "INSERT INTO users (googleId, username, usersurname, email, photo) VALUES (?, ?, ?, ?, ?)",
      [user.googleId, user.username, user.usersurname, user.email, user.photo]
    );
  } finally {
    connection.release();
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
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
      "SELECT * FROM users WHERE googleId = ?",
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

export async function getUserById(id: string): Promise<User | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return null;
    }
    return rows[0] as User;
  } finally {
    connection.release();
  }
}

import dbConnection from "../config/db-connection";

export interface Link {
  token: string;
  fileId: number;
}

export async function createLink(link: Link): Promise<void> {
  const connection = await dbConnection.getConnection();
  try {
    await connection.execute(
      "INSERT INTO links (token, file_id) VALUES (?, ?)",
      [link.token, link.fileId]
    );
  } finally {
    connection.release();
  }
}

export async function getLinkByToken(token: string): Promise<Link | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM links WHERE token = ?",
      [token]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0] as Link;
  } finally {
    connection.release();
  }
}

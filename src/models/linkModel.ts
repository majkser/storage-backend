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
    return {
      token: rows[0].token,
      fileId: rows[0].file_id,
    } as Link;
  } finally {
    connection.release();
  }
}

export async function getLinkByFileId(fileId: number): Promise<Link | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows]: [any[], any] = await connection.execute(
      "SELECT * FROM links WHERE file_id = ?",
      [fileId]
    );
    if (rows.length === 0) {
      return null;
    }
    return {
      token: rows[0].token,
      fileId: rows[0].file_id,
    } as Link;
  } finally {
    connection.release();
  }
}

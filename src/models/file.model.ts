import dbConnection from "../config/db-connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface File {
  id: string; 
  filename: string;
  originalName: string;
  filePath: string;
  size: number;
  mimetype: string;
  userId: string;
  parentFolderId?: string | null; 
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export async function createFile(file: Omit<File, 'id' | 'createdAt'>): Promise<string> {
  const connection = await dbConnection.getConnection();
  try {
    const updatedAt = file.updatedAt || null;
    const parentFolderId = file.parentFolderId === undefined ? null : file.parentFolderId;

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO files (filename, originalName, filePath, size, mimetype, userId, parentFolderId, isPublic, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        file.filename,
        file.originalName,
        file.filePath,
        file.size,
        file.mimetype,
        file.userId,
        parentFolderId,
        file.isPublic,
        updatedAt,
      ]
    );

    // Get the generated ID
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM files WHERE filename = ? AND userId = ? ORDER BY createdAt DESC LIMIT 1",
      [file.filename, file.userId]
    );
    
    return rows[0].id as string;
  } finally {
    connection.release();
  }
}

export async function findById(id: string): Promise<File | null> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM files WHERE id = ?",
      [id]
    );
    
    if (!rows.length) return null;

    return {
      id: rows[0].id,
      filename: rows[0].filename,
      originalName: rows[0].originalName,
      filePath: rows[0].filePath,
      size: rows[0].size,
      mimetype: rows[0].mimetype,
      userId: rows[0].userId,
      parentFolderId: rows[0].parentFolderId,
      isPublic: Boolean(rows[0].isPublic),
      createdAt: rows[0].createdAt,
      updatedAt: rows[0].updatedAt,
    };
  } finally {
    connection.release();
  }
}

export async function findByUserId(
  userId: string,
  parentFolderId: string | null
): Promise<File[]> {
  const connection = await dbConnection.getConnection();
  try {
    let query = "SELECT * FROM files WHERE userId = ?";
    const params: any[] = [userId];

    if (parentFolderId === null) {
      query += " AND parentFolderId IS NULL";
    } else {
      query += " AND parentFolderId = ?";
      params.push(parentFolderId);
    }

    const [rows] = await connection.execute<RowDataPacket[]>(query, params);
    
    return rows.map(row => ({
      ...row,
      isPublic: Boolean(row.isPublic) // We only convert boolean since MySQL returns tinyint
    })) as File[];
  } finally {
    connection.release();
  }
}

export async function findAllFiles(): Promise<File[]> {
  const connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.execute<RowDataPacket[]>("SELECT * FROM files");
    
    return rows.map(row => ({
      ...row,
      isPublic: Boolean(row.isPublic)
    })) as File[];
  } finally {
    connection.release();
  }
}

export async function findByUserAccess(userId: string): Promise<File[]> {
  const connection = await dbConnection.getConnection();
  try {
    const query = `
      SELECT f.*
      FROM files f
      INNER JOIN fileAccess fa ON f.id = fa.fileId
      WHERE fa.userId = ?
    `;
    
    const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);
    
    return rows.map(row => ({
      ...row,
      isPublic: Boolean(row.isPublic)
    })) as File[];
  } finally {
    connection.release();
  }
}

export async function deleteFile(id: string): Promise<boolean> {
  const connection = await dbConnection.getConnection();
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM files WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}
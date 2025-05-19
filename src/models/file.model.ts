import  dbConnection  from '../config/db-connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface File {
    id: number;
    fileName: string;
    originalName: string;
    filePath: string;
    size: number;
    mimetype: string;
    userId: string;
    parentFolderId?: number | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export async function createFile(file: File): Promise<number> {
    const connection = await dbConnection.getConnection();
    try {

      const updatedAt = file.updatedAt || null;
      const parentFolderId = file.parentFolderId === undefined ? null : file.parentFolderId;

      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO files (id, filename, original_name, file_path, size, mimetype, user_id, parent_folder_id, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          file.id, 
          file.fileName, 
          file.originalName, 
          file.filePath, 
          file.size, 
          file.mimetype, 
          file.userId, 
          parentFolderId,  
          file.isPublic, 
          file.createdAt, 
          updatedAt        
        ]
      );
      return result.insertId as number;

    } finally {
      connection.release();
    }
}

export async function findById(id: number): Promise<File | null> {
    const connection = await dbConnection.getConnection();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM files WHERE id = ?",
            [id]
        );
        return rows.length ? rows[0] as File : null;
    } finally {
        connection.release();
    }
}

export async function findByUserId(userId: string, parentFolderId: number | null): Promise<File[]> {
    const connection = await dbConnection.getConnection();
    try {
        let query = 'SELECT * FROM files WHERE user_id = ?';
        const params: any[] = [userId];

        if (parentFolderId === null) {
          query += ' AND parent_folder_id IS NULL';
        } else {
          query += ' AND parent_folder_id = ?';
          params.push(parentFolderId);
        }

        const [rows] = await connection.execute<RowDataPacket[]>(query, params);
        return rows as File[];
    } finally {
        connection.release();
    }
}

export async function deleteFile(id: number): Promise<boolean> {
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
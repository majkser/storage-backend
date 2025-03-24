import  dbConnection  from '../config/db-connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface File {
    id: number;
    filename: string;
    originalName: string;
    filePath: string;
    size: number;
    mimetype: string;
    userId: number;
    parentFolderId?: number | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface File {
    id?: number;
    filename: string;
    original_name: string;
    file_path: string;
    size: number;
    mimetype: string;
    user_id: number;
    parent_folder_id?: number | null;
    is_public?: boolean;
    created_at?: Date;
    updated_at?: Date;
}
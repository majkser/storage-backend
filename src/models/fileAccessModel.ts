import dbConnection from "../config/db-connection";

export interface FileAccess {
  fileId: string;
  userId: string;
}

export async function createFileAccess(FileAccess: FileAccess): Promise<void> {
  const connection = await dbConnection.getConnection();

  try {
    connection.execute(
      "INSERT INTO fileAccess (fileId, userId) VALUES (?, ?)",
      [FileAccess.fileId, FileAccess.userId]
    );
  } catch (error) {
    console.error("Error creating file access:", error);
    throw error;
  }
}

export async function getFileAccessByUserId() {
  //TODO: Implement this function to retrieve file access by userId
}

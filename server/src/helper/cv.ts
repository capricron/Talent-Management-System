import { BunFile, write } from "bun";
import { unlinkSync, renameSync } from "node:fs";
import { existsSync, accessSync, constants, statSync } from "fs";

export const createCV = async (file: any, name_file: string, name_input: string) => {
  try {
    const file_path = `./public/cv/${name_file}.pdf`;

    // trow error with object
    if (!file)
      throw {
        message: `PDF perlu ${name_input} diupload`,
        status: 400,
        error: "file_not_found",
      };

    const fileSizeInBytes = file.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 10) throw new Error("Maksimal upload 10MB ya, lebih aku cium~~");

    await write(file_path, file);

    return file_path;
  } catch (err) {
    throw err;
  }
};

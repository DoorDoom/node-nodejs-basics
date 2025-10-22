import { cp } from "node:fs/promises";

const copy = async () => {
  try {
    await cp("./src/fs/files", "./src/fs/files_copy", {
      force: false,
      errorOnExist: true,
      recursive: true,
    });
  } catch (error) {
    console.log(error);
    throw new Error("FS operation failed");
  }
};

await copy();

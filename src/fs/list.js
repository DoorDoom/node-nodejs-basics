import { readdir } from "node:fs/promises";

const list = async () => {
  try {
    const files = await readdir("./src/fs/files");
    console.log(files);
  } catch (error) {
    throw new Error("FS operation failed");
  }
};

await list();

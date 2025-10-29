import { access, constants, rename as rn } from "node:fs/promises";

const rename = async () => {
  try {
    await access("./src/fs/files/properFilename.md", constants.F_OK)
      .catch(() => {
        return undefined;
      })
      .then(() => {
        throw new Error("The file alredy exists");
      });

    await rn(
      "./src/fs/files/wrongFilename.txt",
      "./src/fs/files/properFilename.md"
    );
  } catch (error) {
    throw new Error("FS operation failed");
  }
};

await rename();

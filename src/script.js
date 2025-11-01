import path from "node:path";
import process, { chdir, stdout } from "node:process";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import {
  readdir,
  stat,
  writeFile,
  mkdir as md,
  rename,
  rm,
} from "node:fs/promises";
import { homedir } from "node:os";

let name =
  process.argv
    .slice(2)
    .filter((value) => value.match(/username/))
    .map((value) => value.split("=")[1])[0] ?? "anonymous";

chdir(homedir());

console.log(`Welcome to the File Manager, ${name}!`);
console.log(`You are currently in ${process.cwd()}`);

process.stdin.on("data", async (chunk) => {
  const [input, ...args] = chunk.toString().trim().split(" ");

  try {
    switch (input) {
      case "ls":
        await outputList(await readdir(process.cwd()));
        break;
      case "up":
        chdir(path.join(...process.cwd().split(path.sep).slice(0, -1)));
        break;
      case "cd":
        findPath(args[0]);
        break;
      case "cp":
        await copyFile(args[0], args[1]);
        break;
      case "rn":
        await renameFile(args[0], args[1]);
        break;
      case "rm":
        await removeFile(args[0]);
        break;
      case "mv":
        await moveFile(args[0], args[1]);
        break;
      case "cat":
        await printContent(args[0]);
        break;
      case "add":
        await createFile(args[0]);
        break;
      case "mkdir":
        await createDirectory(args[0]);
        break;
      case "exit":
        process.exit(0);
      default:
        console.log("Invalid input");
    }
  } catch (error) {
    console.log(error);
    console.log("Operation failed");
  }
  console.log(`You are currently in ${process.cwd()}`);
});

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${name}, goodbye!`);
});

process.on("SIGINT", () => {
  console.log(`Thank you for using File Manager, ${name}, goodbye!`);
  process.exit(0);
});

const outputList = async (files) => {
  //   console.table(files.map((value)=> console.log(value)));
  const data = await Promise.all(
    files.map(async (value) => {
      const data = await stat(value);
      const type = data.isFile()
        ? "file"
        : data.isDirectory()
        ? "directory"
        : "other";
      return { value, type };
    })
  );
  console.table(data);
};

const printContent = async (targetPath) => {
  const readable = createReadStream(targetPath, {
    encoding: "utf-8",
  });
  await pipeline(readable, async (source) => {
    for await (const chunk of source) stdout.write(`${chunk}\n`);
  });
};

const createFile = async (targetPath) => {
  await writeFile(targetPath, "", { flag: "wx+" });
};

const renameFile = async (oldName, newName) => {
  await rename(oldName, newName, (err) => {
    if (err) throw err;
  });
};

const copyFile = async (sourcePath, targetPath) => {
  const readable = createReadStream(sourcePath, {
    encoding: "utf-8",
  });
  const writable = createWriteStream(targetPath, {
    encoding: "utf-8",
  });

  await pipeline(readable, writable);
};

const moveFile = async (sourcePath, targetPath) => {
  const readable = createReadStream(sourcePath, {
    encoding: "utf-8",
  });
  const writable = createWriteStream(targetPath, {
    encoding: "utf-8",
  });

  await pipeline(readable, writable);
  await rm(sourcePath);
};

const removeFile = async (sourcePath) => {
  await rm(sourcePath);
};

const createDirectory = async (targetPath) => {
  await md(targetPath);
};

const findPath = (targetPath) => {
  chdir(
    path.isAbsolute(targetPath)
      ? targetPath
      : path.resolve(process.cwd(), targetPath)
  );
};

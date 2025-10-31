import path from "node:path";
import process, { chdir, stdout } from "node:process";
import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { readdir, stat, writeFile, mkdir as md } from "node:fs/promises";
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
  const [input, args] = chunk.toString().trim().split(" ");

  try {
    switch (input) {
      case "ls":
        await outputList(await readdir(process.cwd()));
        break;
      case "up":
        chdir(path.join(...process.cwd().split(path.sep).slice(0, -1)));
        break;
      case "cd":
        findPath(args);
        break;
      case "cat":
        await printContent(args);
        break;
      case "add":
        await createFile(args);
        break;
      case "mkdir":
        await createDirectory(args);
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

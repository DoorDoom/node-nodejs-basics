import { argv } from "node:process";

const name = argv
  .slice(2)
  .filter((value) => value.match(/username/))
  .map((value) => value.split("=")[1]);

console.log(`Welcome to the File Manager, ${name}!`);

import { argv } from "node:process";

const parseArgs = () => {
  let str = "";

  argv.forEach((val) => {
    if (str) {
      console.log(`${str} is ${val}`);
      str = "";
    }

    if (val.match(/^--/)) {
      str = val.slice(2);
    }
  });
};

parseArgs();

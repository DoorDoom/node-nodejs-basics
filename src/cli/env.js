import { env } from "node:process";

const parseEnv = () => {
  for (let key in env) {
    if (key.match(/^RSS_/)) {
      console.log(key + " = " + env[key]);
    }
  }
};

parseEnv();

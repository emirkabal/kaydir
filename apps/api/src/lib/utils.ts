import fs from "fs";

export function readdirF(dir: string = "public") {
  const arr: any[] = [];
  for (const file of fs.readdirSync(dir)) {
    const stats = fs.statSync(`${dir}/${file}`);
    if (stats.isDirectory()) {
      console.log(`Directory: ${file}`);
      const arr2 = readdirF(`${dir}/${file}`);
      arr.push(...arr2);
    } else {
      arr.push(`${dir}/${file}`);
    }
  }

  return arr;
}

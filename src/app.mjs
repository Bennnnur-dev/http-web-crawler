import { crawlPage } from "./crawl.mjs";
import printReport from "./report.mjs";

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("too many URLs provided");
    process.exit(1);
  }

  const baseURL = process.argv[2];

  console.log(`starting crawl of ${baseURL}`);
  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
}

main();

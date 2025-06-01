function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => b[1] - a[1]);
  return pagesArr;
}

export default function printReport(pages) {
  console.log("==================================================");
  console.log("REPORT");
  console.log("==================================================");
  const sortedPages = sortPages(pages);
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];
    console.log(`Found ${hits} links to page: ${url}`);
  }
  console.log("==================================================");
}

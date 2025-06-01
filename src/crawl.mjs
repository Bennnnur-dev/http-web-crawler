import { JSDOM } from "jsdom";

export async function crawlPage(baseURL, currentURL, pages) {
  try {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
      return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
      pages[normalizedCurrentURL]++;
      return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling: ${currentURL}`);

    const res = await fetch(currentURL);

    if (res.status > 399) {
      console.log(`error in fetch with status code: ${res.status} on page: ${currentURL}`);
      return pages;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`non html response, content type: ${contentType} on page: ${currentURL}`);
      return pages;
    }
    const htmlBody = await res.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
    return pages;
  } catch (error) {
    console.log(`error in fetch: ${err.message} on page ${currentURL}`);
  }
}

export function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    if (linkElement.href.startsWith("/")) {
      //relative URL
      try {
        const concatenatedURL = `${baseURL}${linkElement.href}`;
        const urlObj = new URL(concatenatedURL);
        urls.push(urlObj.href);
      } catch (err) {
        if (err instanceof Error) {
          console.log(`error with relative url: ${err.message}`);
        } else console.log(JSON.stringify(err));
      }
    } else {
      //absolute URL
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        if (err instanceof Error) {
          console.log(`error with absolute url: ${err.message}`);
        } else console.log(JSON.stringify(err));
      }
    }
  }
  return urls;
}

export function normalizeURL(url) {
  const urlObj = new URL(url);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

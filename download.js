const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Path to the JSON file
const jsonFilePath = 'download.json';

// Function to extract Google Docs ID from URL
function extractGoogleDocsId(url) {
  const match = url.match(/\/d\/(.*?)\//);
  return match ? match[1] : null;
}

// Function to download Google Docs file as DOCX using public link
async function downloadDocxFile(googleDocsUrl, title, id) {
  const fileId = extractGoogleDocsId(googleDocsUrl);
  if (!fileId) {
    console.error(`Failed to extract file ID from URL: ${googleDocsUrl}`);
    return;
  }

  const exportUrl = `https://docs.google.com/document/d/${fileId}/export?format=docx`;
  const filePath = `./downloads/${id}_${title}.docx`;

  try {
    const response = await axios({
      url: exportUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Downloaded: ${filePath}`);
  } catch (error) {
    console.error(
      `Failed to download file from URL ${googleDocsUrl}: ${error}`,
    );
  }
}

async function parseObject({ link, title, id }) {
  const tit = title.replace(/\s+/g, '_');

  await downloadDocxFile(link, tit, id);
  await sleep(50); // Sleep for 200ms
}

// Main function to process the JSON file and download files
async function processJsonFile() {
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

  for (const list of data) {
    await parseObject(list);
  }
}

// Ensure download directory exists
if (!fs.existsSync('./downloads')) {
  fs.mkdirSync('./downloads');
}

processJsonFile().catch(console.error);

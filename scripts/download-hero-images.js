const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const downloadImage = async (url, filename) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const downloadHeroImages = async () => {
  const images = [
    {
      url: 'https://source.unsplash.com/1600x900/?technology',
      filename: 'tech1.jpg'
    },
    {
      url: 'https://source.unsplash.com/1600x900/?web-development',
      filename: 'tech2.jpg'
    },
    {
      url: 'https://source.unsplash.com/1600x900/?design',
      filename: 'tech3.jpg'
    }
  ];

  const directory = path.join(__dirname, '../public/images/hero');
  await fs.mkdir(directory, { recursive: true });

  for (const image of images) {
    const filepath = path.join(directory, image.filename);
    await downloadImage(image.url, filepath);
    console.log(`Downloaded ${image.filename}`);
  }
};

downloadHeroImages().catch(console.error);

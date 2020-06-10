const puppeteer = require('puppeteer');
const fs = require('fs');
const hbs = require('handlebars');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const compileTemplate = async (templateName, data) => {
  const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
  const html = await readFileAsync(filePath, 'utf-8');
  const template = hbs.compile(html);
  return template(data);
}

module.exports = async (data, template, pdfName) => {
  try {
    const browser = await puppeteer.launch({
      args: [ // we need to set this flags otherwise it won't work in heroku
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    const page = await browser.newPage();
    const content = await compileTemplate(template, data);

    await page.setContent(content);
    await page.emulateMedia('screen');
    const pdf = await page.pdf({
      path: `${pdfName}.pdf`,
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    return [pdf, pdfName];
  }catch(err) {
    console.log('pdf error: ', err);
  }
}
const htmlToPdf = require('../index'),
  fs = require('fs');

(async () => {
  try {
    const pdfBuffer = await htmlToPdf('Hallo <b>Welt</b>');
    fs.writeFileSync('test.pdf', pdfBuffer);
    console.log('Done.');
  } catch (err) {
    console.log(err);
  }
})();

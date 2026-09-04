function escapePdfText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function createSamplePdf(title, lines = []) {
  const contentLines = [title, '', ...lines].map(escapePdfText);
  const streamParts = ['BT', '/F1 16 Tf', '50 750 Td'];

  contentLines.forEach((line, index) => {
    if (index === 0) {
      streamParts.push(`(${line}) Tj`);
    } else {
      streamParts.push('/F1 11 Tf', '0 -18 Td', `(${line || ' '}) Tj`);
    }
  });

  streamParts.push('ET');
  const stream = `${streamParts.join('\n')}\n`;
  const streamLength = Buffer.byteLength(stream, 'utf8');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${streamLength} >>\nstream\n${stream}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefPos = Buffer.byteLength(pdf, 'utf8');
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });

  pdf += `${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}

module.exports = {
  createSamplePdf,
};

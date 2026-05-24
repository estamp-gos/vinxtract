(async ()=>{
  const fs = require('fs');
  const url = 'http://localhost:3000/api/generate-report';
  const body = { registration: 'WERD12312', year: '2000', enrichment: {} };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const ct = res.headers.get('content-type') || '';
    console.log('Status', res.status, 'Content-Type', ct);

    if (res.ok && ct.includes('application/pdf')) {
      const ab = await res.arrayBuffer();
      const buf = Buffer.from(ab);
      fs.writeFileSync('test.pdf', buf);
      console.log('Saved test.pdf (' + buf.length + ' bytes)');
    } else {
      const txt = await res.text();
      console.log('Response body:', txt);
    }
  } catch (e) {
    console.error('Request failed:', e);
  }
})();

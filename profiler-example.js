

let numProfiles = 0;
setInterval(() => {
  const curTime = Date.now();
  const {rss, heapTotal, heapUsed} = process.memoryUsage();
  console.log(
      new Date().toISOString(),
      'rss',
      (rss / (1024 * 1024)).toFixed(3),
      'MiB,',
      'heap total',
      (heapTotal / (1024 * 1024)).toFixed(3),
      'MiB,',
      'heap used',
      (heapUsed / (1024 * 1024)).toFixed(3),
      'MiB,',
      numProfiles, 'profiles collected',
  );
}, 1000 /* log every second */);

let ptype = process.argv[2];
if (ptype === undefined) {
  console.log('running with no profiler, specify "time" or "heap" to enable');
} else if (ptype == 'time') {
  console.log('running with time profiler');
  const profiler = require('profiler-min');
  async function profile() {
    profiler.setTimeSamplingInterval(1000 /* 1000 us = 1000 samples / second */);
    while (true) {
      numProfiles++;
      await profiler.collectTimeProfile('test-profile', 100);
    }
  }
  profile();
} else if (ptype == 'heap') {
  console.log('running with heap profiler');
  const profiler = require('profiler-min');
  profiler.startSamplingHeapProfiler(
      512 * 1024 /* interval */, 64 /* stack depth */);
  async function profile() {
    while (true) {
      numProfiles++;
      profiler.getAllocationProfile();
      await new Promise(res => setTimeout(res, 100));
    }
  }
  profile();
} else {
  throw new Error('usage: node profiler-example.js [time|heap]');
}

const express = require('express')
const app = express()
const http = require('http');

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => {
  console.log('Express app listening on port 3000...');
  // Simulate some server load.
  setInterval(() => {
    http.get('http://localhost:3000/', (resp) => {
      // Got response.
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    });
  }, 1);
});


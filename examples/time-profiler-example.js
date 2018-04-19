const profiler = require('profiler-min');
const delay = require('delay');

async function profile(durationMillis) {
  const runName = 'stackdriver-profiler-' + Date.now() + '-' + Math.random();
  profiler.startTimeProfiling(runName);
  await delay(durationMillis);
  profiler.stopTimeProfiling(runName);
}

// log memory periodically
const logPeriodMillis = 1000;
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
      'MiB,'
  );
}, logPeriodMillis);

// set profiling interval
const intervalMicros = 1000;
profiler.setTimeSamplingInterval(intervalMicros);

setInterval(async ()=> {
  await profile(100);
}, 1000)  
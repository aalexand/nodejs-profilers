const profiler = require('bindings')('sampling_heap_profiler');

// start the profiler
const intervalBytes = 512 * 1024;
const stackDepth = 64;
profiler.startSamplingHeapProfiler(intervalBytes, stackDepth);

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

setInterval(()=> {
  profiler.getAllocationProfile();
}, 1000)  

// stop the profiler with profiler.stopSamplingHeapProfiler();
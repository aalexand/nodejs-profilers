const heapProfiler = require('bindings')('sampling_heap_profiler');
const timeProfiler = require('bindings')('time_profiler');
const delay = require('delay');

// heap profiler
function startSamplingHeapProfiler(intervalBytes, stackDepth) {
  heapProfiler.startSamplingHeapProfiler(intervalBytes, stackDepth);
}

function stopSamplingHeapProfiler() {
  heapProfiler.stopSamplingHeapProfiler();
}

function getAllocationProfile() {
  heapProfiler.getAllocationProfile();
}


// time profiler
function setTimeSamplingInterval(intervalMicros) {
  timeProfiler.setSamplingInterval(intervalMicros);
}

function startTimeProfiling(runName) {
  timeProfiler.startProfiling(runName);
}

function stopTimeProfiling(runName) {
  timeProfiler.stopProfiling(runName);
}

async function collectTimeProfile(runName, durationMillis) {
  startTimeProfiling(runName);
  await delay(durationMillis);
  stopTimeProfiling(runName);
}

module.exports = {
  startSamplingHeapProfiler: startSamplingHeapProfiler,
  stopSamplingHeapProfiler: stopSamplingHeapProfiler,
  setTimeSamplingInterval: setTimeSamplingInterval,
  startTimeProfiling: startTimeProfiling,
  stopTimeProfiling: stopTimeProfiling,
  collectTimeProfile: collectTimeProfile,
  getAllocationProfile: getAllocationProfile
}

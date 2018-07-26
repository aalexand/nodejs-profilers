/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "v8-profiler.h"
#include "nan.h"

using namespace v8;

#if NODE_MODULE_VERSION > NODE_8_0_MODULE_VERSION
// This profiler exists for the lifetime of the program. Not calling 
// CpuProfiler::Dispose() is intentional.
CpuProfiler* cpuProfiler = CpuProfiler::New(v8::Isolate::GetCurrent());
#else
CpuProfiler* cpuProfiler = v8::Isolate::GetCurrent()->GetCpuProfiler();
#endif

NAN_METHOD(StartProfiling) {
  Local<String> name = info[0].As<String>();

  // Sample counts and timestamps are not used, so we do not need to record
  // samples.
  cpuProfiler->StartProfiling(name, false);
}

NAN_METHOD(StopProfiling) {
  Local<String> name = info[0].As<String>();
  CpuProfile* profile = cpuProfiler->StopProfiling(name);
  profile->Delete();
}

NAN_METHOD(SetSamplingInterval) {
  int us = info[0].As<Integer>()->IntegerValue();
  cpuProfiler->SetSamplingInterval(us);
}

NAN_METHOD(SetIdle) {
  bool is_idle = info[0].As<Boolean>()->BooleanValue();
  cpuProfiler->SetIdle(is_idle);
}

NAN_MODULE_INIT(InitAll) {
  Nan::Set(target, Nan::New("startProfiling").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(StartProfiling)).ToLocalChecked());
  Nan::Set(target, Nan::New("stopProfiling").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(StopProfiling)).ToLocalChecked());
  Nan::Set(target, Nan::New("setSamplingInterval").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(SetSamplingInterval)).ToLocalChecked());
  Nan::Set(target, Nan::New("setIdle").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(SetIdle)).ToLocalChecked());
}

NODE_MODULE(time_profiler, InitAll);

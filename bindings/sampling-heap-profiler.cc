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

#include <memory>
#include "v8-profiler.h"
#include "nan.h"

using namespace v8;

NAN_METHOD(StartSamplingHeapProfiler) {
  if (info.Length() == 2) {
    if (!info[0]->IsUint32()) {
      return Nan::ThrowTypeError("First argument type must be uint32.");
    }
    if (!info[1]->IsNumber()) {
      return Nan::ThrowTypeError("First argument type must be Integer.");
    }
    uint64_t sample_interval = info[0].As<Integer>()->Uint32Value();
    int stack_depth = info[1].As<Integer>()->IntegerValue();
    info.GetIsolate()->GetHeapProfiler()->
      StartSamplingHeapProfiler(sample_interval, stack_depth);
  } else {
    info.GetIsolate()->GetHeapProfiler()->StartSamplingHeapProfiler();
  }
}

NAN_METHOD(StopSamplingHeapProfiler) {
  info.GetIsolate()->GetHeapProfiler()->StopSamplingHeapProfiler();
}

NAN_METHOD(GetAllocationProfile) {
  std::unique_ptr<v8::AllocationProfile> profile(
    info.GetIsolate()->GetHeapProfiler()->GetAllocationProfile());
}

NAN_MODULE_INIT(InitAll) {
  Nan::Set(target, Nan::New("startSamplingHeapProfiler").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(StartSamplingHeapProfiler)).ToLocalChecked());
  Nan::Set(target, Nan::New("stopSamplingHeapProfiler").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(StopSamplingHeapProfiler)).ToLocalChecked());
  Nan::Set(target, Nan::New("getAllocationProfile").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(GetAllocationProfile)).ToLocalChecked());
}

NODE_MODULE(sampling_heap_profiler, InitAll);

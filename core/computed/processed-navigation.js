/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {makeComputedArtifact} from './computed-artifact.js';
import {ProcessedTrace} from './processed-trace.js';
import LHTraceProcessor from '../lib/lh-trace-processor.js';

class ProcessedNavigation {
  /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.ProcessedNavigation>}
    */
  static async compute_(trace, context) {
    const processedTrace = await ProcessedTrace.request(trace, context);
    return LHTraceProcessor.processNavigation(processedTrace);
  }
}

const ProcessedNavigationComputed = makeComputedArtifact(ProcessedNavigation, null);
export {ProcessedNavigationComputed as ProcessedNavigation};

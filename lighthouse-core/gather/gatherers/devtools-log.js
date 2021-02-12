/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * This gatherer collects all network and page devtools protocol traffic during the timespan/navigation.
 * This protocol log can be used to recreate the network records using lib/network-recorder.js.
 */

const MessageLog = require('../devtools-log.js');
const FRGatherer = require('../../fraggle-rock/gather/base-gatherer.js');

class DevtoolsLog extends FRGatherer {
  static symbol = Symbol('DevtoolsLog');

  /** @type {LH.Gatherer.GathererMeta} */
  meta = {
    symbol: DevtoolsLog.symbol,
    supportedModes: ['timespan', 'navigation'],
  };

  constructor() {
    super();

    this._messageLog = new MessageLog(/^(Page|Network)\./);

    /** @param {LH.Protocol.RawEventMessage} e */
    this._onProtocolMessage = e => this._messageLog.record(e);
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   */
  async beforeTimespan({driver}) {
    this._messageLog.reset();
    this._messageLog.beginRecording();
    driver.defaultSession.addProtocolMessageListener(this._onProtocolMessage);

    // TODO(FR-COMPAT): use a dedicated session for these
    await driver.defaultSession.sendCommand('Page.enable');
    await driver.defaultSession.sendCommand('Network.enable');
  }

  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<LH.Artifacts['DevtoolsLog']>}
   */
  async afterTimespan({driver}) {
    const messages = this._messageLog.messages;
    this._messageLog.endRecording();
    driver.defaultSession.removeProtocolMessageListener(this._onProtocolMessage);
    return messages;
  }
}

module.exports = DevtoolsLog;

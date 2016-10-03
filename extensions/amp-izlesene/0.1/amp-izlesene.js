/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {getDataParamsFromAttributes} from '../../../src/dom';
import {addParamsToUrl} from '../../../src/url';
import {isLayoutSizeDefined} from '../../../src/layout';
import {user} from '../../../src/log';

class AmpIzlesene extends AMP.BaseElement {

  /** @override */
  preconnectCallback(onLayout) {
    this.preconnect.url('https://www.izlesene.com', onLayout);
    // Host that Vimeo uses to serve poster frames needed by player.
    this.preconnect.url('https://i1.imgiz.com', onLayout);
  }

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  layoutCallback() {
    const videoid = user().assert(
        this.element.getAttribute('data-videoid'),
        'The data-videoid attribute is required for <amp-izlesene> %s',
        this.element);
    const iframe = this.element.ownerDocument.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
	let src = 'https://www.izlesene.com/embedplayer/' + encodeURIComponent(videoid) + '/?';
	const params = getDataParamsFromAttributes(this.element);
	src = addParamsToUrl(src, params);
    iframe.src = src;
    this.applyFillContent(iframe);
    this.element.appendChild(iframe);
    /** @private {?Element} */
    this.iframe_ = iframe;
    return this.loadPromise(iframe);
  }

  /** @override */
  pauseCallback() {
    if (this.iframe_ && this.iframe_.contentWindow) {
	  this.iframe_.contentWindow./*OK*/postMessage('pause', '*');
    }
  }
};

AMP.registerElement('amp-izlesene', AmpIzlesene);

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { scaleLinear } from 'd3-scale';

export default class RequestChartComponent extends Component {
  @tracked svg;

  @action storeSvg(svg) {
    this.svg = svg;
  }

  get now() {
    return Date.now();
  }

  get xScale() {
    const earliestCreatedTime = this.args.requests[0].createdTime;

    return scaleLinear()
      .domain([earliestCreatedTime, this.now])
      .rangeRound([0, this.svg.clientWidth]);
  }

  get requestHeight() {
    if (this.svg) {
      return this.svg.clientHeight / this.args.requests.length;
    } else {
      return undefined;
    }
  }

  get requestRects() {
    if (!this.requestHeight) {
      return [];
    }

    return this.args.requests.map((request, index) => {
      const x1 = this.xScale(request.createdTime);
      const x2 = this.xScale(request.matchedTime || this.now);

      return {
        x: x1,
        y: index * this.requestHeight,
        width: x2 - x1,
        height: this.requestHeight,
        request,
      };
    });
  }
}

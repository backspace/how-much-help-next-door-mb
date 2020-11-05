import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { scaleLinear } from 'd3-scale';
import { DateTime } from 'luxon';

export default class RequestChartComponent extends Component {
  @tracked svg;
  @tracked activeRequestRect;

  categoryIdToLabel = {
    1: 'Pickup / Delivery',
    2: 'Technology Help',
    3: 'Social Support',
    4: 'Logistical Help',
    5: 'General Tasks',
    6: 'COVID-19 Volunteer Support',
  };

  statusIdToLabel = {
    0: 'New',
    1: 'Approved',
    2: 'Matched',
    3: 'Cancelled',
    4: 'Rejected',
  };

  @action storeSvg(svg) {
    this.svg = svg;
  }

  get categoryIdsActive() {
    return Object.keys(this.categoryIdToLabel).map((key) => ({
      key,
      label: this.categoryIdToLabel[key],
      active: this.args.activeCategoryIds.includes(key),
      count: this.args.requests.categoryCounts[key],
    }));
  }

  get statusIdsActive() {
    return Object.keys(this.statusIdToLabel).map((key) => ({
      key,
      label: this.statusIdToLabel[key],
      active: this.args.activeStatusIds.includes(key),
      count: this.args.requests.statusCounts[key],
    }));
  }

  get earliestCreatedTime() {
    return this.args.requests.requests[0].createdTime;
  }

  get now() {
    return Date.now();
  }

  get xScale() {
    return scaleLinear()
      .domain([this.earliestCreatedTime, this.now])
      .rangeRound([0, this.svg.clientWidth]);
  }

  get requestHeight() {
    return 10;
  }

  get height() {
    return this.filteredRequests.length * this.requestHeight;
  }

  get filteredRequests() {
    return this.args.requests.requests.filter(
      (request) =>
        this.args.activeCategoryIds.includes(request.category + '') &&
        this.args.activeStatusIds.includes(request.status + '')
    );
  }

  get requestRects() {
    if (!this.svg) {
      return [];
    }

    return this.filteredRequests.map((request, index) => {
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

  get activeRequestClass() {
    if (this.activeRequestRect.y < this.svg.clientHeight / 2) {
      return 'bottom';
    } else {
      return '';
    }
  }

  get ticks() {
    if (!this.svg) {
      return [];
    }

    const months = [];

    let current = DateTime.fromMillis(this.earliestCreatedTime).startOf(
      'month'
    );

    do {
      months.push(current);
      current = current.plus({ month: 1 });
    } while (current.toMillis() < this.now);

    return months.map((month) => ({
      x: this.xScale(month.toMillis()),
      y2: this.svg.clientHeight,
      yLabel: this.svg.clientHeight - 10,
      label: month.toFormat('LLL'),
    }));
  }
}

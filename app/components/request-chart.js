import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { scaleLinear } from 'd3-scale';

export default class RequestChartComponent extends Component {
  @tracked svg;

  categoryIdToLabel = {
    1: 'Pickup / Delivery',
    2: 'Technology Help',
    3: 'Social Support',
    4: 'Logistical Help',
    5: 'General Tasks',
    6: 'COVID-19 Volunteer Support',
  };

  @tracked activeCategoryIds = Object.keys(this.categoryIdToLabel);

  @action storeSvg(svg) {
    this.svg = svg;
  }

  @action toggleCategoryId(categoryId) {
    if (this.activeCategoryIds.includes(categoryId)) {
      this.activeCategoryIds.removeObject(categoryId);
    } else {
      this.activeCategoryIds.pushObject(categoryId);
    }
  }

  get categoryIdsActive() {
    return Object.keys(this.categoryIdToLabel).map((key) => ({
      key,
      label: this.categoryIdToLabel[key],
      active: this.activeCategoryIds.includes(key),
    }));
  }

  get now() {
    return Date.now();
  }

  get xScale() {
    const earliestCreatedTime = this.filteredRequests[0].createdTime;

    return scaleLinear()
      .domain([earliestCreatedTime, this.now])
      .rangeRound([0, this.svg.clientWidth]);
  }

  get requestHeight() {
    if (this.svg) {
      return this.svg.clientHeight / this.filteredRequests.length;
    } else {
      return undefined;
    }
  }

  get filteredRequests() {
    return this.args.requests.filter((request) =>
      this.activeCategoryIds.includes(request.category + '')
    );
  }

  get requestRects() {
    if (!this.requestHeight) {
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
}

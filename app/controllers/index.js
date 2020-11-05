import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  queryParams = ['categories', 'statuses'];

  @tracked categories = '123456';
  @tracked statuses = '012';

  get categoriesArray() {
    return this.categories.split('');
  }

  get statusesArray() {
    return this.statuses.split('');
  }

  @action toggleCategory(categoryId) {
    if (this.categories.includes(categoryId)) {
      this.categories = this.categories.replace(categoryId, '');
    } else {
      this.categories = this.categories + categoryId;
    }
  }

  @action toggleStatus(statusId) {
    if (this.statuses.includes(statusId)) {
      this.statuses = this.statuses.replace(statusId, '');
    } else {
      this.statuses = this.statuses + statusId;
    }
  }
}

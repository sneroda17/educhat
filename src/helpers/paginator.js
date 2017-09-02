import {makeEduChatRequest} from "../ecapi";

/*
  A note about pagination:
  Right now, due to unoptimal APIs, all the code consuming paginated APIs only get the first page.
  Once that is fixed, we'll want to move to the following model for each paginated endpoint:
  Have a worker that makes the initial API call to get the Paginator object, then
  immediately gets the first page and fires a "load page" action with the data.
  Afterwards, it loops through taking a "request page" action and loading another page until it gets
  done === true, at which point it ends.
  This worker would be forked from a takeLatest effect that listens for a "start pagination" action

  One issue is that we're going to have lists that need to be reordered in real time based on
  certain events. Right now Immutable.js doesn't have any way to reorder items in an OrderedMap
  other than a  full O(n*log(n)) sort. So the best model we have would be to have an unordered
  Map of the actual objects, and then a List of IDs that maintains the order. This would add a
  performance cost to deleting items (a O(n) traversal of the list to remove the ID),
  but that's such an uncommon action it should be okay.
*/

// This base Paginator class only lets you request a page directly by offset.
// This class is used when the offset of the next page can only be determined when it's requested.
// In this case, having "next" and "previous" methods doesn't make as much sense.
export class Paginator {
  url;
  method;
  data;
  useBotApi;
  authRequired;
  eduChatRequest = makeEduChatRequest();

  constructor(url, method, data = {}, useBotApi = false, authRequired = true) {
    this.url = url;
    this.method = method;
    this.data = data;
    this.useBotApi = useBotApi;
    this.authRequired = authRequired;
  }

  async _makeRequest({url = this.url, method = this.method, data = this.data,
                      useBotApi = this.useBotApi, authRequired = this.authRequired,
                      dataAmmendments} = {}) {
    if (dataAmmendments) {
      data = Object.assign({}, data, dataAmmendments);
    }

    return await this.eduChatRequest(url, method, data, useBotApi, authRequired, true);
  }

  async getPage(offset = 0) {
    const resp = await this._makeRequest({dataAmmendments: {offset}});
    return {value: resp.results, done: !resp.next};
  }
}

// This Paginator class adds a cursor functionality with next and previous methods.
// This is used for the standard situation in which the offset of the next page
// doesn't change due to other factors. The cursor's position is not affected by manually calling
// getPage.
export class CursorPaginator extends Paginator {
  current = null;
  prevUrl = null;
  nextUrl = null;

  async next() {
    let resp;

    if (!this.current) {
      resp = await this._makeRequest();
    } else if (this.nextUrl) {
      resp = await this._makeRequest({url: this.nextUrl, method: "GET", data: {}});
    }

    if (resp) {
      this.prevUrl = resp.previous;
      this.nextUrl = resp.next;
      this.current = resp.results;
      if (this.nextUrl) {
        return {value: this.current, done: false};
      } else {
        return {value: this.current, done: true};
      }
    } else return {value: undefined, done: true};
  }

  async prev() {
    if (this.prevUrl) {
      const resp = await this._makeRequest({url: this.prevUrl, method: "GET", data: {}});
      this.prevUrl = resp.previous;
      this.nextUrl = resp.next;
      this.current = resp.results;
      return {value: this.current, done: false};
    } else return {value: undefined, done: true};
  }
}

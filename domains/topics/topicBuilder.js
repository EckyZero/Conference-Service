'use strict';

const _routes = require(`../../configs/routes.json`);
const _md5 = require('md5');

const BaseBuilder = require('../shared/baseBuilder');
const Topic = require('./models/topic');

/**
 * Responsible for building Topic objects
 */
class TopicBuilder extends BaseBuilder {
  /**
   * Represents a TopicBuilder object
   * @constructor
   * @param {object} opts - IoC object holding dependencies
   */
  constructor(opts) {
    super(opts);
  }

  /**
   * Build a Topic object from an HTML element
   * @param {jQuery} $ - Parser used to inspect the element
   * @param {HTMLElement} el - the target HTMLElement to parse
   * @return {Topic} - a topic object
   */
  build($, el) {
    const title = this._title($, el);
    const topic = Topic.build({
      uid: _md5(title),
      title: title,
      tag: this._tag($, el),
      talksUrl: this._talksUrl($, el),
      talksCount: this._count($, el),
    });

    return topic;
  }

  /**
   * Build multiple topic objects using jQuery
   * @param {jQuery} $ - Parser used to inspect the element
   * @return {Array} - An array of topic objects
   */
  buildMany($) {
    let results = [];

    results = $('.lumen-content').find('.lumen-tile a').map((i, el) => {
      return this.build($, el);
    }).get();

    return results;
  }

  /**
   * Parse the title of the topic
   * @param {jQuery} $ - Parser used to inspect the element
   * @param {HTMLElement} el - the target HTMLElement to parse
   * @return {string} - string representation of the topic's title
   */
  _title($, el) {
    const topicCounts = el.firstChild.data.split('(');
    return topicCounts[0].trim();
  }

  /**
   * Parse the url of talks related to the topic
   * @param {jQuery} $ - Parser used to inspect the element
   * @param {HTMLElement} el - the target HTMLElement to parse
   * @return {string} - url of the talks related to the topic
   */
  _talksUrl($, el) {
    return _routes.BASE_URL + el.attribs.href;
  }

  /**
   * Parse the tag of the topic (useful for querying other data sources)
   * @param {jQuery} $ - Parser used to inspect the element
   * @param {HTMLElement} el - the target HTMLElement to parse
   * @return {string} - string representation of the talk's tag
   */
  _tag($, el) {
    const topicCounts = el.firstChild.data.split('(');
    const name = topicCounts[0].trim();
    return name.replace(/\s/g, '-').toLowerCase();
  }

  /**
   * Parse the count of talks for the topic
   * @param {jQuery} $ - Parser used to inspect the element
   * @param {HTMLElement} el - the target HTMLElement to parse
   * @return {number} - int representing the number of talks for the topic
   */
  _count($, el) {
    const topicCounts = el.firstChild.data.split('(');
    return topicCounts[1] ? parseInt(topicCounts[1].trim().slice(0, -1)) : null;
  }
}

module.exports = TopicBuilder;

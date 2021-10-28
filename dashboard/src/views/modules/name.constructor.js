export default class NameConstructor {
  name = '';

  constructor(name = '') {
    this.name = name || '';
  }
}

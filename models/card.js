import path from 'path';
import fs from 'fs';
import Course from "./course";

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  '/data',
  'card.json'
);

export default class Card {
  constructor() {}

  static async add(course) {
  }

  static async remove(id) {
  }

  static fetch() {
  }
}


import Bundle from './Bundle';
// import fs from 'fs';
module.exports = gulpSource;


function gulpSource(entry: string, filename: string) {
  // TODO\
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}

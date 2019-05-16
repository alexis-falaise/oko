export function objectIsComplete(object: Object) {
    let complete = true;
    if (object) {
      Object.keys(object).forEach(key => {
        if (object[key] === null || object[key] === undefined || object[key] === '') {
          complete = false;
        }
      });
    } else {
      complete = false;
    }
    return complete;
}

export function objectIsEmpty(object: Object) {
  let empty = true;
  if (object) {
    Object.keys(object).forEach(key => {
      if (object[key]) {
        empty = false;
      }
    });
  }
  return empty;
}

export function objectMatch(a: Object, b: Object) {
  let match = true;
  Object.keys(a).forEach(key => {
    if (key !== 'id' && key !== '_id') {
      if (a[key] !== b[key]) {
        match = false;
      }
    }
  });
  return match;
}

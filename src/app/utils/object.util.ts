export function objectIsComplete(object: Object) {
    let complete = true;
    Object.keys(object).forEach(key => {
      if (object[key] === null || object[key] === undefined || object[key] === '') {
        complete = false;
      }
    });
    return complete;
}

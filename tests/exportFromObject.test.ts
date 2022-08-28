const demoObject = {
  a: 1,
  b: "2",
  c: {
    d: 1,
    e: "2",
  },
};

function exportFrom<T extends object>(obj: T) {
  var finished = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof obj[key] === "object") {
      var temp = [];
      for (const [_key, _value] of Object.entries(obj[key])) {
        temp.push([key, [_key, _value]]);
      }

      finished = [...finished, ...temp];
    } else {
      finished.push([key, value]);
    }
  }

  return finished;
}

console.log(exportFrom(demoObject));

function pushToFront(array, first) {
  let newArray = [];
  newArray.push(first);
  for (let value of array) {
    if (value == first) continue;
    newArray.push(value);
  }
  return newArray;
}

function formatNumber(num) {
  if (!num) return 0;
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num.toFixed(2);
}

export { pushToFront, formatNumber };
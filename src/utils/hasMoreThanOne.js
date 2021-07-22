export function hasMoreThanOne(array, what) {
  let indexes = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === what) {
      indexes.push(i);
    }
  }
  return indexes;
}

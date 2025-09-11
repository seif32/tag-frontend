export function consoleObject(text = "", object) {
  console.log(text, JSON.stringify(object, null, 2));
}

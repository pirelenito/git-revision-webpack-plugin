export default function removeEmptyLines(string: string) {
  return string.replace(/[\s\r\n]+$/, '')
}

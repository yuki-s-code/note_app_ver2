export function extractTextFromJSON(json: any): string {
  let result: string = '';

  function traverse(node: any) {
      if (node.type === 'text') {
          result += node.text + ' ';
      } else if (node.type === 'paragraph' && node.children.length > 0) {
          node.children.forEach((child: any) => traverse(child));
      }
  }

  json.root.children.forEach((child: any) => traverse(child));

  return result ? result.trim(): "???文字列でない";
}
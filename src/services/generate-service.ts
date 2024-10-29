class GenerateService {
  generateCombination(arr: number[], length: number) {
    const items: string[] = [];
    const prefixMap: { [key: string]: string[] } = {};

    arr.forEach((count, i) => {
      const prefix = String.fromCharCode(65 + i);
      for (let j = 1; j <= count; j++) {
        const itemName = `${prefix}${j}`;
        items.push(itemName);
        if (!prefixMap[prefix]) {
          prefixMap[prefix] = [];
        }
        prefixMap[prefix].push(itemName);
      }
    });

    const validCombinations: string[][] = [];

    function findCombinations(start: number, combo: string[]) {
      if (combo.length === length) {
        validCombinations.push([...combo]);
        return;
      }
      for (let i = start; i < items.length; i++) {
        const item = items[i];
        const prefix = item[0];
        if (!combo.some((c) => c[0] === prefix)) {
          combo.push(item);
          findCombinations(i + 1, combo);
          combo.pop();
        }
      }
    }

    findCombinations(0, []);
    return { combinations: validCombinations, itemNames: arr };
  }
}
export const generateService = new GenerateService();

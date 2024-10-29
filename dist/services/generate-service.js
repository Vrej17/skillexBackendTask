"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateService = void 0;
class GenerateService {
    generateCombination(arr, length) {
        const items = [];
        const prefixMap = {};
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
        const validCombinations = [];
        function findCombinations(start, combo) {
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
exports.generateService = new GenerateService();

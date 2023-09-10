
export function hexToUuid(hex: string): string {
    const group1 = hex.substring(0, 8);
    const group2 = hex.substring(8, 12);
    const group3 = hex.substring(12, 16);
    const group4 = hex.substring(16, 20);
    const group5 = hex.substring(20);
  
    const uuid = `${group1}-${group2}-${group3}-${group4}-${group5}`;
    return uuid;
  }


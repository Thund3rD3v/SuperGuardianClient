export function IsSetsEqual(set1: Set<unknown>, set2: Set<unknown>) {
  if (set1.size !== set2.size) {
    return false;
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false;
    }
  }

  return true;
}

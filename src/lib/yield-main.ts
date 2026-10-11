/** Break a long main-thread stretch so it is not one Lighthouse long task. */
export function yieldMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

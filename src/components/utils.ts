export function propertyExists<X, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return typeof obj === "object" && obj !== null && Object.prototype.hasOwnProperty.call(obj, prop);
}

export const debounce = (onChange: any) => {
  let timeout: NodeJS.Timeout | undefined;
  return (e: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onChange(e);
    }, 700);
  };
};


export const debounce = (func: () => any, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: []) => {
        const context = this;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

export const throttle = (func: () => any, delay: number) => {
    let lastExec = 0;

    return (...args: []) => {
        const now = Date.now();

        if (now >= lastExec + delay) {
            lastExec = now;
            const value = func.apply(this, args);
            return value;
        }
    };
};


export function randomID(size = 12) {
  const chars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '@', '!',
    '#', '$', '%', '&', '*', '?', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  let number;
  let finalID = '';
  const max = chars.length - 1;
  const min = 0;

  for (let index = 0; index < size; index++) {
    number = Math.floor(Math.random() * (max - min + 1) + min);
    finalID += chars[number];
  }

  return finalID;

}

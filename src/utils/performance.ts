export const debounce = (func: (...args: any[]) => any, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: []) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}
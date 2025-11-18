/**
 * @function
 * Utility used to delay a call to a function 'func'. This is useful for events that generate too many calls like window 'resize' event or 'scroll'.
 * @param {function} func - function to be delayed. 
 * @param {number} delay - the delay in milliseconds.
 * @alias utils/debounce
 */
export const debounce = (func, delay) => {
    let timeout;

    return function(...args) {
        const context = this;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};
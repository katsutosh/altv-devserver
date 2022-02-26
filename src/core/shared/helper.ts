export function between(min, max) {
    if (min === max) {
        return min;
    }
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}
import Decimal from "decimal.js";

export function sumDecimal(...nums: number[]): number {
    return nums.reduce(
        (acc, n) => acc.plus(n),
        new Decimal(0)
    ).toNumber();
}

export function minusDecimal(...nums: number[]): number {
    if (nums.length === 0) return 0;

    const [first, ...rest] = nums;
    return rest.reduce(
        (acc, n) => acc.minus(n),
        new Decimal(first)
    ).toNumber();
}

export function divToDecimalPlaces(
    a: number,
    b: number,
    decimals: number = 2,
    rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP
): number {
    return new Decimal(a).div(b).toDecimalPlaces(decimals, rounding).toNumber();
}
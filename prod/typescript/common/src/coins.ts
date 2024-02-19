/*
Coins is a simple class to group a set of quarters, dimes, nickels, and dimes
into an object with some convenience methods.
*/
class Coins {
  q: number;
  d: number;
  n: number;
  p: number;

  static zeroCoins: Coins = new Coins(0, 0, 0, 0);

  constructor(q: number, d: number, n: number, p: number) {
    this.q = q;
    this.d = d;
    this.n = n;
    this.p = p;
  }
  public getQ(): number { return this.q; }
  public getD(): number { return this.d; }
  public getN(): number { return this.n; }
  public getP(): number { return this.p; }
  /*
  getCount returns the number of coins (not their value).
  */
  public getCount(): number {
    return this.q + this.d + this.n + this.p;
  }
  /*
  getValue returns the value of coins (not their count).
  */
  public getValue(): number {
    return this.q * 25 + this.d * 10 + this.n * 5 + this.p;
  }
  /*
  toString returns a string representation of a Coins object.
  */
  public toString(): string {
    return `[Q: ${this.q}, D: ${this.d}, N: ${this.n}, P: ${this.p}]`
  }
  /*
  equals tests two Coins objects for value equality.
  */
  public equals(coins: Coins): boolean {
    return this.q === coins.q && this.d === coins.d &&
      this.n === coins.n && this.p === coins.p;
  }
  /*
  compareTo (used for sorting)
  public compareTo(coins) : number {
    const thisCount : number = getCount();
    const thatCount : number = coins.getCount();
    return thisCount - thatCount;
  }
  */
}
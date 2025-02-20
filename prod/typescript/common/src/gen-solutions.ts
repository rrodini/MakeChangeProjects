/*
 genSolutions - generates all solutions to a problem and
                returns them in a sorted array.
*/
class genSolutions {
  public static generate(prob: Problem): Coins[] {
    const amount = prob.amount;
    const maxQ = prob.maxCoins.getQ();
    const maxD = prob.maxCoins.getD();
    const maxN = prob.maxCoins.getN();
    const maxP = prob.maxCoins.getP();
    let solns: Coins[] = []
    let q: number;
    for (q = maxQ; q >= 0; q--) {
      let d: number;
      for (d = maxD; d >= 0; d--) {
        let n: number;
        for (n = maxN; n >= 0; n--) {
          let p: number;
          for (p = maxP; p >= 0; p--) {
            const testCoins: Coins = new Coins(q, d, n, p);
            if (testCoins.getValue() === amount) {
              solns.push(testCoins);
            }
          }
        }
      }
    }
    // now sort allSolns based on # coins
    solns.sort((a, b) => {
      return a.getCount() - b.getCount();
    })
    return solns;
  }
}
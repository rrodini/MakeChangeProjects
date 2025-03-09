/*
 FeedbackMsg is a class of static methods that produce the message for problem marking.
 (see any of change-min.ts, change-finite.ts. change-max.tx).
*/
class FeedbackMsg {
  // Correct (also exact) message.
  public static getCorrectMsg(terse: boolean, amount: number, solnCoins: Coins): string {
    var msg: string = "Correct. ";
    if (!terse) {
      msg += `${amount} = ${solnCoins.getValueString()}.`;
    }
    return msg;
  }
  // Correct since there is no solution message.
  public static getNoSolnMsg(terse: boolean): string {
    var msg: string = "Correct. ";
    if (!terse) {
      msg += "Exact change cannot be made.";
    }
    return msg;
  }
  // Incorrect since coins don't sum to amount message.
  public static getBadSumMsg(terse: boolean, amount: number, userCoins: Coins): string {
    var msg: string = "Coins don't sum to amount. ";
    if (!terse) {
      msg += `${amount} &ne; ${userCoins.getValueString()}.`;
    }
    return msg;
  }
  // Incorrect since a solution exists message.
  public static getSolnExistsMsg(terse: boolean, amount: number, solnCoins: Coins): string {
    var msg: string = "There is a solution. ";
    if (!terse) {
      msg += `${amount} = ${solnCoins.getValueString()}.`;
    }
    return msg;
  }
  // Incorrect since user coins not minimum message.
  public static getBadMinMsg(terse: boolean, amount: number, solnCoins: Coins): string {
    var msg: string = "Number of coins is not minimum. ";
    if (!terse) {
      msg += `${amount} = ${solnCoins.getValueString()} (${solnCoins.getCount()} coins).`;
    }
    return msg;
  }
  // Incorrect since user coins not maximum message.
  public static getBadMaxMsg(terse: boolean, amount: number, solnCoins: Coins): string {
    var msg: string = "Number of coins is not maximum. ";
    if (!terse) {
      msg += `${amount} = ${solnCoins.getValueString()} (${solnCoins.getCount()} coins).`;
    }
    return msg;
  }
}

export type NonogramData = [string, string];

type BitSet = boolean[];

export class NonogramSolver {
  private readonly data: NonogramData;

  constructor(data: NonogramData) {
    this.data = data;
  }

  private and(bs: BitSet, other: BitSet): void {
    for (let i in bs) {
      if (bs[i] && other[i]) {
        bs[i] = true;
      } else {
        bs[i] = false;
      }
    }
  }

  private or(bs: BitSet, other: BitSet): void {
    for (let i in bs) {
      if (bs[i] || other[i]) {
        bs[i] = true;
      } else {
        bs[i] = false;
      }
    }
  }

  private iff(cond: boolean, s1: string, s2: string): string {
    if (cond) {
      return s1;
    }
    return s2;
  }

  public solve(): void {
    const rowData = this.data[0].split(' ');
    const colData = this.data[1].split(' ');
    const rows = this.getCandidates(rowData, colData.length);
    const cols = this.getCandidates(colData, rowData.length);

    while (true) {
      let numChanged = this.reduceMutual(cols, rows);
      if (numChanged == -1) {
        console.log('No solution');
        return;
      }
      if (numChanged == 0) {
        break;
      }
    }

    for (let row of rows) {
      for (let i = 0; i < cols.length; i++) {
        console.log(this.iff(row[0][i], '# ', '. '));
      }
      console.log();
    }
    console.log();
  }

  // collect all possible solutions for the given clues
  private getCandidates(data: string[], le: number): BitSet[][] {
    var result: BitSet[][] = [];

    for (let s of data) {
      var lst: BitSet[] = [];
      let a: string[] = s.split('');
      let sumBytes = 0;
      for (let b of a) {
        sumBytes += b.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      }
      let prep = [];
      for (let b of a) {
        prep.push('1'.repeat(b.charCodeAt(0) - 'A'.charCodeAt(0) + 1));
      }
      for (let r of this.genSequence(prep, le - sumBytes + 1)) {
        let bits = r.slice(1);
        let bitset: BitSet = [];
        for (let b of bits) {
          bitset.push(b == '1');
        }
        lst.push(bitset);
      }
      result.push(lst);
    }
    return result;
  }

  private genSequence(ones: string[], numZeros: number): string[] {
    const le = ones.length;
    if (le == 0) {
      return '0'.repeat(numZeros).split('');
    }
    var result: string[] = [];
    for (let x = 1; x < numZeros - le + 2; x++) {
      let skipOne = ones.slice(1);
      for (let tail of this.genSequence(skipOne, numZeros - x)) {
        result.push('0'.repeat(x) + ones[0] + tail);
      }
    }
    return result;
  }

  /* If all the candidates for a row have a value in common for a certain cell,
     then it's the only possible outcome, and all the candidates from the
     corresponding column need to have that value for that cell too. The ones
     that don't, are removed. The same for all columns. It goes back and forth,
     until no more candidates can be removed or a list is empty (failure).
  */

  private reduceMutual(cols: BitSet[][], rows: BitSet[][]): number {
    let countRemoved1 = this.reduce(cols, rows);
    if (countRemoved1 == -1) {
      return -1;
    }
    let countRemoved2 = this.reduce(rows, cols);
    if (countRemoved2 == -1) {
      return -1;
    }
    return countRemoved1 + countRemoved2;
  }

  private reduce(a: BitSet[][], b: BitSet[][]): number {
    let countRemoved = 0;
    for (let i = 0; i < a.length; i++) {
      const commonOn: BitSet = [];
      for (let j = 0; j < b.length; j++) {
        commonOn[j] = true;
      }
      const commonOff: BitSet = [];

      // determine which values all candidates of a[i] have in common
      for (let candidate of a[i]) {
        this.and(commonOn, candidate);
        this.or(commonOff, candidate);
      }

      // remove from b[j] all candidates that don't share the forced values
      for (let j = 0; j < b.length; j++) {
        const fi = i;
        const fj = j;
        for (let k = b[j].length - 1; k >= 0; k--) {
          let cnd = b[j][k];
          if ((commonOn[fj] && !cnd[fi]) || (!commonOff[fj] && cnd[fi])) {
            b[j].splice(k, 1);
            countRemoved++;
          }
        }
        if (b[j].length == 0) {
          return -1;
        }
      }
    }
    return countRemoved;
  }
}

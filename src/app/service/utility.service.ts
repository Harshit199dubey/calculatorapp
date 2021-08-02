import { Injectable } from '@angular/core';

export interface sign {
  type: string;
  sign: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}
  // field to store input numbers
  numbers: any = [];
  // field to store input numbers and sign
  calcArray: any = [];
  // field to store calculater result
  calcTotal!: number;

  calc = false;

  ans: number = 0;

  // method to identify the entered input is a sign or number
  identifySign(keypressed: string): sign {
    let obj: any = {};

    switch (keypressed) {
      case '+':
      case '-':
      case '%':
        obj = { type: 'sign', sign: keypressed };
        break;
      case 'EXP':
        obj = { type: 'sign', sign: 'E' };
        break;
      case '10ٰx':
        obj = { type: 'sign', sign: '10ٰ' };
        break;
      case 'Ans':
        obj = { type: 'sign', sign: keypressed };
        break;
      case '±':
        obj = { type: 'nev', sign: '-' };
        break;
      case '*':
      case 'x':
        obj = { type: 'sign', sign: 'x' };
        break;
      case '/':
      case '÷':
        obj = { type: 'sign', sign: '÷' };
        break;
      case '-1':
      case 'Backspace':
        obj = { type: 'back', sign: keypressed };
        break;
      case Number(keypressed).toString():
        obj = { type: 'number', sign: keypressed };
        break;
      case '.':
        obj = { type: 'point', sign: '.' };
        break;
      case '(':
      case ')':
        obj = { type: 'bracket', sign: keypressed };
        break;
      case 'x²':
        obj = { type: 'sq2', sign: keypressed };
        break;
      case 'sin':
      case 'sin-1':
      case 'cos':
      case 'cos-1':
      case 'tan':
      case 'tan-1':
      case 'log':
      case 'ln':
      case '√':
        obj = { type: 'sin', sign: keypressed };
        break;
      case 'x!':
        obj = { type: 'fact', sign: '!' };
        break;
      case '𝛑':
      case 'e':
        obj = { type: 'pi', sign: keypressed };
        break;
      case '=':
      case 'Enter':
        obj = { type: 'cal', sign: '=' };
        break;
      case 'AC':
        obj = { type: 'clean', sign: 'AC' };
        break;
      default:
        obj = { type: '', sign: '' };
        break;
    }

    return obj;
  }
  addnum() {
    // check if the numbers array is empty
    if (this.numbers.length === 0) return;

    let num = this.numbers.join(''),
      number = num === '.' ? 0 : Number(num);
    this.calcArray.push(number);
    this.numbers = [];
  }
  // perform the required operation
  operationsOnSign(enteredkey: sign): sign {
    if (enteredkey.type === 'back') {
      return enteredkey;
    }
    if (enteredkey.type === 'sq2') {
      this.calcArray.push('sqr(');
    }
    if (enteredkey.type === 'sin') {
      this.addnum();
      this.calcArray.push(enteredkey.sign + '(');
    }
    // check if user not clicked '=' or Enter button
    if (enteredkey.type !== 'cal') {
      if (enteredkey.type === '') return { type: '', sign: '' };
      // check if user entered point value
      if (enteredkey.type === 'point') {
        if (!this.numbers.includes('.')) {
          const number = '.';
          this.numbers.push(number);
        }
      }

      // check if user entered number
      if (enteredkey.type === 'number') {
        this.numbers.push(Number(enteredkey.sign));
      }

      // check if user clicked '±' button
      if (enteredkey.type === 'nev') {
        if (this.numbers[0] === '-') this.numbers.shift();
        else this.numbers.unshift(enteredkey.sign);
      }

      // check if user entered any mathematical operator
      if (
        enteredkey.type === 'sign' ||
        enteredkey.type === 'bracket' ||
        enteredkey.type === 'pi' ||
        enteredkey.type === 'fact'
      ) {
        // method call to push the entered numbers in calArray.
        this.addnum();

        const array =
          enteredkey.sign === '('
            ? true
            : enteredkey.sign === 'E' ||
              enteredkey.type === 'fact' ||
              enteredkey.type === 'pi'
            ? this.calculate([...this.calcArray, enteredkey.sign])
            : this.calculate([...this.calcArray]);
        // check if the last value of the calArray is mathematical operator or if the array is empty
        if (array !== 0 ? !array : false) return { type: '', sign: '' };

        // push the mathematical operator in calcArray
        this.calcArray.push(enteredkey.sign);
        this.numbers = [];
      }
    }
    return enteredkey;
  }

  trigonometry(array: any, index: number, fun: any) {
    const start = index,
      end =
        array.slice(0, start).length +
        (array.slice(start).indexOf(')') === -1
          ? array.slice(start).length - 1
          : array.slice(start).indexOf(')'));

    const num = this.calculate(
        array.slice(
          start + 1,
          !Number(array[end]) && Number(array[end]) !== 0 ? end : end + 1
        )
      ),
      noof = end - start + 1 <= 0 ? 1 : end - start + 1,
      snum = fun(num);

    if (Number(array[start - 1]) && Number(array[end + 1]))
      array.splice(start, noof, 'x', snum, 'x');
    else if (Number(array[start - 1])) array.splice(start, noof, 'x', snum);
    else if (Number(array[end + 1])) array.splice(start, noof, snum, 'x');
    else array.splice(start, noof, snum);

    return array;
  }

  //method that accepts that array and solve the '*','÷' & '%'
  muldiv(array: any): any {
    console.log(array);

    if (array.includes(NaN)) return [NaN];
    if (array.includes('Ans')) {
      this.ans = this.ans ? this.ans : 0;
      const index = array.indexOf('Ans');
      if (Number(array[index - 1]) && Number(array[index + 1]))
        array.splice(index, 1, 'x', this.ans, 'x');
      else if (Number(array[index - 1])) array.splice(index, 1, 'x', this.ans);
      else if (Number(array[index + 1])) array.splice(index, 1, this.ans, 'x');

      return this.muldiv(array);
    }
    if (array.includes('𝛑')) {
      const index = array.indexOf('𝛑'),
        pi = 22 / 7;

      array.splice(index, 1, '(', pi, ')');

      return this.muldiv(array);
    }

    if (array.includes('e')) {
      const index = array.lastIndexOf('e'),
        e = 2.71828182846;
      array.splice(index, 1, '(', e, ')');

      return this.muldiv(array);
    }

    if (array.includes('(') || array.includes('sqr(')) {
      let start = array.includes('(')
          ? array.lastIndexOf('(')
          : array.lastIndexOf('sqr('),
        end =
          array.slice(0, start).length +
          (array.slice(start).indexOf(')') === -1
            ? array.slice(start).length - 1
            : array.slice(start).indexOf(')'));

      if (!array[start + 1]) {
        array.splice(start, 1);
        return this.muldiv(array);
      }

      let numw = this.calculate(
          array.slice(start + 1, array[end] === ')' ? end : end + 1)
        ),
        bnum = array.includes('(') ? numw : numw * numw;
      const noof = end - start + 1 <= 0 ? 1 : end - start + 1;

      if (Number(array[start - 1])) {
        if (Number(array[end + 1]) && array.length > end)
          array.splice(start, noof, 'x', bnum, 'x');
        else array.splice(start, noof, 'x', bnum);

        return this.muldiv(array);
      } else if (Number(array[end + 1]) && array[start + 1] !== array[end]) {
        array.splice(start, noof, bnum, 'x');

        return this.muldiv(array);
      } else {
        // debugger;
        array.splice(start, noof, bnum);

        return this.muldiv(array);
      }
    }
    if (
      array.includes('sin(') ||
      array.includes('sin-1(') ||
      array.includes('cos(') ||
      array.includes('cos-1(') ||
      array.includes('tan(') ||
      array.includes('tan-1(') ||
      array.includes('log(') ||
      array.includes('ln(') ||
      array.includes('√(')
    ) {
      const sIndex = array.lastIndexOf('sin('),
        asIndex = array.lastIndexOf('sin-1('),
        cIndex = array.lastIndexOf('cos('),
        acIndex = array.lastIndexOf('cos-1('),
        tIndex = array.lastIndexOf('tan('),
        atIndex = array.lastIndexOf('tan-1('),
        lIndex = array.lastIndexOf('log('),
        lnIndex = array.lastIndexOf('ln('),
        rIndex = array.lastIndexOf('√(');

      switch (
        Math.max(
          sIndex,
          asIndex,
          cIndex,
          acIndex,
          tIndex,
          atIndex,
          lIndex,
          lnIndex,
          rIndex
        )
      ) {
        case acIndex:
          return this.muldiv(this.trigonometry(array, acIndex, Math.acos));
        case atIndex:
          return this.muldiv(this.trigonometry(array, atIndex, Math.atan));
        case sIndex:
          return this.muldiv(this.trigonometry(array, sIndex, Math.sin));
        case asIndex:
          return this.muldiv(this.trigonometry(array, asIndex, Math.asin));
        case cIndex:
          return this.muldiv(this.trigonometry(array, cIndex, Math.cos));
        case tIndex:
          return this.muldiv(this.trigonometry(array, tIndex, Math.tan));
        case lIndex:
          return this.muldiv(this.trigonometry(array, lIndex, Math.log10));
        case rIndex:
          return this.muldiv(this.trigonometry(array, rIndex, Math.sqrt));
        case lnIndex:
          return this.muldiv(this.trigonometry(array, lnIndex, Math.log));
      }
    }
    if (array.includes(')')) {
      return this.muldiv([NaN]);
    }
    if (array.includes('E')) {
      const index = array.indexOf('E'),
        n =
          array[index - 1] *
          Math.pow(10, Number(array[index + 1]) ? Number(array[index + 1]) : 0);

      array.splice(index - 1, Number(array[index + 1]) ? 3 : 2, n);
      return this.muldiv(array);
    }
    if (array.includes('%')) {
      const index = array.indexOf('%'),
        n = Number(array[index + 1])
          ? (array[index - 1] / 100) * array[index + 1]
          : array[index - 1] / 100;

      array.splice(index - 1, Number(array[index + 1]) ? 3 : 2, n);
      return this.muldiv(array);
    }

    if (array.includes('!')) {
      const index = array.indexOf('!'),
        num = array[index - 1] < 0 ? array[index - 1] * -1 : array[index - 1];

      if (array[index - 1] % 1 !== 0) return this.muldiv([NaN]);
      if (array[index - 1].toString().includes('e')) return [Infinity];
      let fact = array[index - 1] < 0 ? -1 : 1;
      for (let i = num; i > 0; i--) {
        fact *= i;
      }

      if (Number(array[index + 1])) array.splice(index - 1, 2, fact, 'x');
      else array.splice(index - 1, 2, fact);

      return this.muldiv(array);
    }

    if (array.includes('÷')) {
      const index = array.indexOf('÷'),
        n = array[index - 1] / array[index + 1];

      array.splice(index - 1, 3, n);

      return this.muldiv(array);
    }
    if (array.includes('x')) {
      const index = array.indexOf('x'),
        n = array[index - 1] * array[index + 1];

      array.splice(index - 1, 3, n);
      return this.muldiv(array);
    }

    return array;
  }

  // method to calculate the result
  calculate(calArray: any) {
    let arrcal = [...calArray];

    if (this.numbers.length > 0)
      arrcal.push(
        this.numbers.join('') === '.' ? 0 : Number(this.numbers.join(''))
      );
    if (!arrcal[0] && arrcal[0] !== 0) return NaN;
    arrcal = this.muldiv(arrcal);

    let num = arrcal[0];

    arrcal.forEach((numsign: any, i: number) => {
      if (typeof numsign === 'string') {
        switch (numsign) {
          case '+':
            num += arrcal[i + 1];
            break;
          case '-':
            num -= arrcal[i + 1];
            break;
        }
      }
    });

    num = num ? Number(num.toFixed(4)) : num;
    return num;
  }

  backspace() {
    this.numbers = this.calcArray[this.calcArray.length - 2]
      .toString()
      .split('')
      .map((e: any) => (e === '-' || e === '.' ? e : Number(e)));
    this.calcArray.splice(this.calcArray.length - 2, 1);
  }

  // method that handles the point and '±' button operation
  forNev(input: any, type: string, result: any): void {
    if (type === 'nev') {
      if (this.numbers[1] && this.numbers[1].toString()[0] === '-') {
        this.numbers[1] = -this.numbers[1];
        this.numbers.shift();
      }

      if (this.numbers.length === 1 && this.numbers[0] === '-')
        this.numbers.pop();
    }

    if (type === 'back') {
      if (this.numbers.length > 0) {
        this.numbers.pop();
      } else {
        if (Number(this.calcArray[this.calcArray.length - 2])) {
          this.backspace();
        }
        this.calcArray.pop();
      }
    }

    this.calcTotal = this.calculate(this.calcArray);
    input.innerHTML = '';

    this.calcArray.forEach((value: any) => {
      const span = document.createElement('span'),
        signtype = this.identifySign(value === 'E' ? 'EXP' : value);
      span.innerHTML = value.toString().includes('-1')
        ? `${value.slice(0, 3)}<sup>${value.slice(3, 5)}</sup>${value.slice(5)}`
        : value;

      span.setAttribute('class', signtype.type);
      input.appendChild(span);
    });
    this.numbers.forEach((value: any) => {
      const span = document.createElement('span');
      span.textContent = value;
      span.setAttribute('class', 'number');
      input.appendChild(span);
    });

    result.textContent =
      this.calcTotal === 0 || this.calcTotal ? this.calcTotal.toString() : '';
  }

  addcalexp(value: string, inputId: string, resutlId: string): boolean {
    if (this.numbers.length === 1 && Number(this.numbers[0]) === 0) {
      this.numbers.pop();
    }

    const span = document.createElement('span'),
      enteredkey = this.operationsOnSign(this.identifySign(value)),
      input = document.getElementById(inputId) as HTMLElement,
      result = document.getElementById(resutlId) as HTMLElement;

    if (enteredkey.type === 'clean') {
      input.innerHTML = '';
      result.innerHTML = '';
      this.numbers = [];
      this.calcArray = [];
      this.calcTotal = NaN;
      this.calc = false;
      return false;
    }

    if (enteredkey.type === 'cal') {
      this.addnum();

      if (this.calculate(this.calcArray)) {
        this.calcTotal = this.calculate(this.calcArray);
        this.ans = this.calcTotal;
        this.numbers = [];
      }
      this.calcArray = [];
      input.innerHTML =
        this.calcTotal.toString().length > 12
          ? this.calcTotal.toString().slice(0, 12)
          : !this.calcTotal && this.calcTotal !== 0
          ? 'Expression Error'
          : this.calcTotal.toString();
      result.innerHTML =
        this.calcTotal.toString().length > 12
          ? this.calcTotal.toString().slice(12)
          : '';

      this.calc = true;
      return true;
    }
    if (
      this.calc === true &&
      (enteredkey.type === 'number' || enteredkey.type === 'point')
    ) {
      input.innerHTML = '';
      this.numbers.shift();
      this.calcTotal = NaN;
    }

    span.textContent = enteredkey.sign;
    span.setAttribute('class', enteredkey.type);

    this.forNev(input, enteredkey.type, result);
    this.calc = false;
    return false;
  }
}

/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
type Head<T extends unknown[]> = T extends [infer E, ...unknown[]] ? E : never
type Tail<T extends unknown[]> = T extends [unknown, ...infer ET] ? ET : []
type HasTail<T extends unknown[]> = T extends [] | [unknown] ? false : true

type CurryV0<P extends unknown[], R> = (
    argN: Head<P>
) => HasTail<P> extends true ? CurryV0<Tail<P>, R> : R

const curry = <F extends (...args: any[]) => any, P extends Parameters<F>, R extends ReturnType<F>>(
    fn: F
): CurryV0<P, R> => {
    const curryStepFactory = (prevArgs: any[]): any => (argN: Head<P>): any => {
        const passedArgs = [...prevArgs, argN]

        if (passedArgs.length < fn.length) {
            return curryStepFactory(passedArgs)
        }

        return fn(...passedArgs)
    }

    return curryStepFactory([])
}

const getMessage = (base: string, amount: number, tail: string): string =>
    `${base} ${amount} ${tail}`

const getMessageCurried = curry(getMessage)

console.log(getMessageCurried('1 We have'))
console.log(getMessageCurried('2 We have')(2))
console.log(getMessageCurried('3 We have')(3)('apples'))
// console.log(getMessageCurried('We have', 2)('apples'))
// console.log(getMessageCurried('We have')(2, 'apples'))
// console.log(getMessageCurried('We have', 2, 'apples'))

/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
type Tail<T extends unknown[]> = T extends [unknown, ...infer ET] ? ET : []
type Prepend<E, P extends unknown[]> = [E, ...P] extends [...infer EP] ? EP : P
type Drop<N extends number, P extends unknown[], C extends unknown[] = []> = {
    continueDropping: Drop<N, Tail<P>, Prepend<unknown, C>>
    return: P
}[C['length'] extends N ? 'return' : 'continueDropping']
type Cast<T, C> = T extends C ? T : C

type CurryV1<P extends unknown[], R> = <T extends unknown[]>(
    ...args: Cast<T, Partial<P>>
) => Drop<T['length'], P> extends [unknown, ...unknown[]]
    ? // @ts-ignore
      CurryV1<Cast<Drop<T['length'], P>, unknown[]>, R>
    : R

const curry = <F extends (...args: any[]) => any, P extends Parameters<F>, R extends ReturnType<F>>(
    fn: F
): CurryV1<P, R> => {
    const curryStepFactory = (prevArgs: any[]): any => (...args: any[]): any => {
        const passedArgs = [...prevArgs, ...args]

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

// getMessageCurried('sdfsad')(2)

console.log(getMessageCurried('1 We have', 2, 'apples'))
console.log(getMessageCurried('1 We have'))
console.log(getMessageCurried('2 We have')(2))
console.log(getMessageCurried('3 We have')(3)('apples'))
console.log(getMessageCurried('4 We have', 2)('apples'))
console.log(getMessageCurried('5 We have')(8, 'apples'))
console.log(getMessageCurried('6 We have', 2, 'apples'))

/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
import R, { Placeholder } from 'ramda'

type Tail<T extends unknown[]> = T extends [unknown, ...infer ET] ? ET : []
type Prepend<E, P extends unknown[]> = [E, ...P] extends [...infer EP] ? EP : P
type Drop<N extends number, P extends unknown[], C extends unknown[] = []> = {
    continueDropping: Drop<N, Tail<P>, Prepend<unknown, C>>
    return: P
}[C['length'] extends N ? 'return' : 'continueDropping']
type Cast<T, C> = T extends C ? T : C
type Pos<I extends unknown[]> = I['length']
type Next<I extends unknown[]> = Prepend<unknown, I>
type Concat<T1 extends unknown[], T2 extends unknown[]> = [...T1, ...T2]
type Append<T, A extends unknown[]> = [...A, T]
type GapOf<
    T1 extends unknown[],
    Rest extends unknown[],
    TN extends unknown[],
    I extends unknown[]
> = T1[Pos<I>] extends Placeholder ? Append<Rest[Pos<I>], TN> : TN
type GapsOf<
    T1 extends unknown[],
    Rest extends unknown[],
    TN extends unknown[] = [],
    I extends unknown[] = []
> = {
    iterate: GapsOf<T1, Rest, GapOf<T1, Rest, TN, I>, Next<I>>
    return: Concat<TN, Cast<Drop<Pos<I>, Rest>, unknown[]>>
}[Pos<I> extends T1['length'] ? 'return' : 'iterate']
type PartialGaps<T extends unknown[]> = {
    [K in keyof T]?: T[K] | Placeholder
}
type CleanedGaps<T extends unknown[]> = {
    [K in keyof T]: NonNullable<T[K]>
}
type Gaps<T extends unknown[]> = CleanedGaps<PartialGaps<T>>

type CurryV2<
    F extends (...args: any[]) => any,
    P extends unknown[] = Parameters<F>,
    R = ReturnType<F>
> = <T extends unknown[]>(
    ...args: Cast<T, Gaps<P>>
) => GapsOf<T, P> extends [unknown, ...unknown[]]
    ? // @ts-ignore
      CurryV2<(...args: GapsOf<T, P>) => R, GapsOf<T, P>>
    : R

// const a: GapsOf<[1, Placeholder, [], Placeholder], [number, string, [], number]>

const getMessage = (base: string, amount: number, tail: string): string =>
    `${base} ${amount} ${tail}`

const getMessageCurried = R.curry(getMessage) as CurryV2<typeof getMessage>

// const a = getMessageCurried('sdfsad')(2)('asdf')

console.log(getMessageCurried('1 We have', 2, 'apples'))
console.log(getMessageCurried('1 We have'))
console.log(getMessageCurried('2 We have')(2))
console.log(getMessageCurried('3 We have')(3)('apples'))
console.log(getMessageCurried('4 We have', 2)('apples'))
console.log(getMessageCurried('5 We have')(8, 'apples'))
console.log(getMessageCurried('6 We have', 2, 'apples'))

console.log(getMessageCurried('7 We have', R.__, 'apples')(R.__)(7))
console.log(getMessageCurried(R.__, R.__, 'Pineapples')(R.__, 9)('8 We have'))

// console.log(getMessageCurried(R.__, R.__, 'Pineapples')(R.__)(9)('8 We have')) // should error
// console.log(getMessageCurried(R.__, undefined)) // should error
// console.log(getMessageCurried(R.__, 'fdsadsa')) // should error

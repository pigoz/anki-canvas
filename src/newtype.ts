// barebones version of https://github.com/gcanti/newtype-ts

export interface Newtype<URI, A> {
  _URI: URI;
  _A: A;
}

export interface Iso<S, A> {
  unwrap: (s: S) => A;
  wrap: (a: A) => S;
}

function identity<T>(x: T): T {
  return x;
}

export const _iso = <S extends Newtype<any, any> = never>(): Iso<
  S,
  S['_A']
> => ({
  unwrap: identity,
  wrap: identity,
});

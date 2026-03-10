type AlsoSingle<U> = { value: U };
type Descriptive<Value> = { value: Value };
type NeedsPrefix<ResponseValue> = { value: ResponseValue };
type Prefixed<TResponse> = { value: TResponse };
type SingleChar<T> = { value: T };

export { AlsoSingle, Descriptive, NeedsPrefix, Prefixed, SingleChar };

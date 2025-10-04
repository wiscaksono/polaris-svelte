// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals { }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// @ts-nocheck
	// ^^^^ REMOVE THIS LINE after you read the comments and understand the changes!
	// This file likely contains overrides for standard TypeScript library types (lib.d.ts)
	// often found in reset libraries like `ts-reset`. These overrides aim to improve
	// type safety or provide more ergonomic defaults by replacing `any` with `unknown`
	// or providing more specific types.
	// The @ts-expect-error comments indicate places where these overrides intentionally
	// conflict with the default TypeScript library definitions.

	/**
	 * Overrides the default `ReadonlyArray.includes` method.
	 * This version widens the type of `searchElement` using `WidenLiteral`.
	 * This allows searching for a broader type within an array of literal types.
	 * For example, you can search for `string` in a `('a' | 'b')[]` array.
	 */
	interface ReadonlyArray<T> {
		includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
	}

	/**
	 * Overrides the default `Array.includes` method.
	 * This version widens the type of `searchElement` using `WidenLiteral`.
	 * This allows searching for a broader type within an array of literal types.
	 * For example, you can search for `string` in a `('a' | 'b')[]` array.
	 */
	interface Array<T> {
		includes(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): boolean;
	}

	/**
	 * Overrides the default `ReadonlyArray.lastIndexOf` and `indexOf` methods.
	 * This version widens the type of `searchElement` using `WidenLiteral`.
	 * This allows searching for a broader type within an array of literal types.
	 */
	interface ReadonlyArray<T> {
		lastIndexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
		indexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
	}

	/**
	 * Overrides the default `Array.lastIndexOf` and `indexOf` methods.
	 * This version widens the type of `searchElement` using `WidenLiteral`.
	 * This allows searching for a broader type within an array of literal types.
	 */
	interface Array<T> {
		lastIndexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
		indexOf(searchElement: T | (WidenLiteral<T> & {}), fromIndex?: number): number;
	}

	/**
	 * Overrides the `Body.json()` method (used in Fetch API Response/Request).
	 * Changes the return type from `Promise<any>` to `Promise<unknown>`.
	 * This encourages safer handling of parsed JSON data, requiring explicit
	 * type checks or assertions instead of implicitly assuming `any`.
	 */
	interface Body {
		// @ts-expect-error - Overriding lib.dom.d.ts: `json(): Promise<any>`
		json(): Promise<unknown>;
	}

	/**
	 * Overrides the `Array.filter` method specifically for the `BooleanConstructor` predicate.
	 * When `Array.filter(Boolean)` is used, this overload correctly infers that
	 * the resulting array contains only non-falsy values of the original type.
	 * It uses `NonFalsy<S>` to exclude `null`, `undefined`, `false`, `0`, `""`.
	 */
	interface Array<T> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): NonFalsy<S>[];
	}

	/**
	 * Overrides the `ReadonlyArray.filter` method specifically for the `BooleanConstructor` predicate.
	 * When `ReadonlyArray.filter(Boolean)` is used, this overload correctly infers that
	 * the resulting array contains only non-falsy values of the original type.
	 * It uses `NonFalsy<S>` to exclude `null`, `undefined`, `false`, `0`, `""`.
	 */
	interface ReadonlyArray<T> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): NonFalsy<S>[];
	}

	/**
	 * Overrides the static `Array.isArray` method.
	 * Changes the type guard from `arg is any[]` to `arg is unknown[]`.
	 * This is slightly more type-safe as it doesn't implicitly cast array elements to `any`.
	 */
	interface ArrayConstructor {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		isArray(arg: any): arg is unknown[];
	}

	/**
	 * Overrides the global `JSON.parse` method.
	 */
	interface JSON {
		/**
		 * Converts a JavaScript Object Notation (JSON) string into an object.
		 * This override changes the return type from `any` to `unknown`.
		 * This promotes type safety by requiring explicit type checking or casting
		 * of the parsed result, rather than allowing implicit `any`.
		 * @param text A valid JSON string.
		 * @param reviver A function that transforms the results. This function is called for each member of the object.
		 * If a member contains nested objects, the nested objects are transformed before the parent object is.
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse(text: string, reviver?: (this: any, key: string, value: any) => any): unknown;
	}

	/**
	 * Overrides the `Map` constructor.
	 * Provides default generic type parameters `<unknown, unknown>` when a new Map
	 * is created without explicit types (`new Map()`). The default is usually `<any, any>`.
	 */
	interface MapConstructor {
		new <K = unknown, V = unknown>(): Map<K, V>;
	}

	/**
	 * Overrides the `Map.has` method.
	 * Widens the type of the `value` (key) parameter using `WidenLiteral`.
	 * This allows checking for the existence of a broader type key within a Map
	 * that might have more specific literal types as keys.
	 */
	interface Map<K> {
		has(value: K | (WidenLiteral<K> & {})): boolean;
	}

	/**
	 * Overrides the `ReadonlyMap.has` method.
	 * Widens the type of the `value` (key) parameter using `WidenLiteral`.
	 * Similar to the `Map.has` override.
	 */
	interface ReadonlyMap<K> {
		has(value: K | (WidenLiteral<K> & {})): boolean;
	}

	/**
	 * Overrides the `Promise` interface, specifically the `then` and `catch` methods.
	 * Changes the rejection reason type from `any` to `unknown`.
	 */
	interface Promise<T> {
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * This override changes the type of the `reason` parameter in the `onrejected`
		 * callback from `any` to `unknown`. This reflects the reality that promise
		 * rejections can happen with any type of value and encourages safer error handling.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		// @ts-expect-error - Overriding lib.es2015.promise.d.ts: `onrejected` reason is `any`
		then<TResult1 = T, TResult2 = never>(
			onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
			onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
		): Promise<TResult1 | TResult2>;

		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * This override changes the type of the `reason` parameter in the `onrejected`
		 * callback from `any` to `unknown`. This reflects the reality that promise
		 * rejections can happen with any type of value and encourages safer error handling.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		// @ts-expect-error - Overriding lib.es2015.promise.d.ts: `onrejected` reason is `any`
		catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
	}

	/**
	 * Overrides the `Set.has` method.
	 * Widens the type of the `value` parameter using `WidenLiteral`.
	 * This allows checking for the existence of a broader type value within a Set
	 * that might contain more specific literal types.
	 */
	interface Set<T> {
		has(value: T | (WidenLiteral<T> & {})): boolean;
	}

	/**
	 * Overrides the `ReadonlySet.has` method.
	 * Widens the type of the `value` parameter using `WidenLiteral`.
	 * Similar to the `Set.has` override.
	 */
	interface ReadonlySet<T> {
		has(value: T | (WidenLiteral<T> & {})): boolean;
	}

	/**
	 * Overrides the `Storage` interface (used for `localStorage`, `sessionStorage`).
	 * Allows indexing the storage object with any string key (`[name: string & {}]`).
	 * Sets the return type of accessing a value via index to `unknown` instead of `string | null` or `any`.
	 * This forces explicit type checks or assertions when retrieving items,
	 * acknowledging that stored values might not be strings or might not exist.
	 */
	interface Storage {
		// @ts-expect-error - Overriding lib.dom.d.ts: index signature returns `string | null` or `any`
		[name: string & {}]: unknown;
	}
}

/**
 * Widens a literal type `T` to its corresponding primitive type.
 *
 * @template T The literal type to widen.
 * @returns The primitive type (`string`, `number`, `boolean`, `bigint`, `symbol`)
 *          if `T` is a literal of that type, otherwise returns `T` unchanged.
 *
 * @example
 * type Str = WidenLiteral<'hello'>; // Type is string
 * type Num = WidenLiteral<123>;     // Type is number
 * type Bool = WidenLiteral<true>;   // Type is boolean
 * type Big = WidenLiteral<100n>;    // Type is bigint
 * type Sym = WidenLiteral<typeof Symbol.iterator>; // Type is symbol
 * type Obj = WidenLiteral<{ a: number }>; // Type is { a: number } (unchanged)
 * type StrOrNum = WidenLiteral<'a' | 1>; // Type is string | number
 */
type WidenLiteral<T> = T extends string
	? string
	: T extends number
		? number
		: T extends boolean
			? boolean
			: T extends bigint
				? bigint
				: T extends symbol
					? symbol
					: T;

export {};

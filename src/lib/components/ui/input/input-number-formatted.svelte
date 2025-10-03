<script lang="ts">
	import { tick } from 'svelte';
	import Input from './input.svelte';

	import type { WithElementRef } from '$lib/utils';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type' | 'inputmode' | 'value' | 'oninput'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined }) & {
				value?: number;
			}
	>;

	let { value = $bindable(0), ...restProps }: Props = $props();

	let inputElement = $state<HTMLInputElement | null>(null);

	function formatValue(val: number): string {
		if (val === 0) return '';
		return new Intl.NumberFormat('id-ID').format(val);
	}
</script>

<Input
	inputmode="numeric"
	bind:ref={inputElement}
	value={formatValue(value)}
	oninput={async (e) => {
		const input = e.currentTarget;
		const { value: inputValue, selectionStart } = input;

		if (selectionStart === null) return;

		const cleanValue = inputValue.replace(/[^0-9]/g, '');

		// 1. Count the number of digits before the caret's current position.
		const digitsBeforeCaret = (cleanValue.substring(0, selectionStart).match(/\d/g) || []).length;

		// 2. Remove all non-digit characters and update the raw numeric state.
		const newRawValue = Number(cleanValue.replace(/\D/g, ''));
		value = newRawValue;

		// 3. Wait for Svelte to update the DOM with the new formatted value.
		await tick();

		// 4. Calculate the new caret position.
		const formattedValue = input.value;
		let newCaretPosition = 0;
		let digitCount = 0;

		// Find the position of the Nth digit, where N is the number of digits
		// that were before the cursor before formatting.
		for (const char of formattedValue) {
			if (/\d/.test(char)) digitCount++;

			newCaretPosition++;
			if (digitCount >= digitsBeforeCaret) break;
		}

		// Adjust the caret to be after any subsequent formatting characters (e.g., '.').
		while (newCaretPosition < formattedValue.length && !/\d/.test(formattedValue[newCaretPosition])) newCaretPosition++;

		// 5. Set the updated caret position on the input element.
		inputElement?.setSelectionRange(newCaretPosition, newCaretPosition);
	}}
	{...restProps}
/>

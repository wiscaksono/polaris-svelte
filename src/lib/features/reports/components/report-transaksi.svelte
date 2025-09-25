<script lang="ts">
	import { CalendarIcon } from '@lucide/svelte';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';

	import Heading from '$lib/components/heading.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';

	import { cn } from '$lib/utils';

	import type { DateRange } from 'bits-ui';

	const df = new DateFormatter('en-US', { dateStyle: 'medium' });
	let value: DateRange = $state({ start: undefined, end: undefined });
	let startValue: DateValue | undefined = $state(undefined);
</script>

<Heading title="Report Transksi" description="Lorem ipsum dolor sit amet consectetur adipisicing elit." />

<div>
	<form class="flex w-full max-w-[60%] items-end gap-2">
		<div class="grid w-full grid-cols-3 gap-2">
			<div class="w-full space-y-1">
				<Label>Periode</Label>
				<Popover.Root>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), !value.start && !value.end && '!text-muted-foreground', 'w-full justify-between font-normal')}
					>
						{#if value && value.start}
							{#if value.end}
								{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(value.end.toDate(getLocalTimeZone()))}
							{:else}
								{df.format(value.start.toDate(getLocalTimeZone()))}
							{/if}
						{:else if startValue}
							{df.format(startValue.toDate(getLocalTimeZone()))}
						{:else}
							Pick a date
						{/if}
						<CalendarIcon class="size-4 text-muted-foreground" />
					</Popover.Trigger>

					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar bind:value onStartValueChange={(v) => (startValue = v)} numberOfMonths={2} />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="w-full space-y-1">
				<Label>Tipe Transaksi</Label>
				<Select.Root type="single">
					<Select.Trigger class="w-full">Pilih Tipe Transaksi</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="w-full space-y-1">
				<Label>Jenis Transaksi</Label>
				<Select.Root type="multiple">
					<Select.Trigger class="w-full">Pilih Jenis Transaksi</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Button>Filter</Button>
	</form>
</div>

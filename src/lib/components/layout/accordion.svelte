<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from 'bits-ui';

	type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
		title: string;
		content: string;
	};

	let { title, content, ...restProps }: Props = $props();
</script>

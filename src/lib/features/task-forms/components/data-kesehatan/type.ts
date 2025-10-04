export interface DataKesehatanRes {
	data_kesehatan: Array<{
		title: string;
		list_peserta: Array<{
			name: string;
			jawaban: Array<
				| {
						number: string;
						description: string;
						type: 'text';
						value: string;
				  }
				| {
						number: string;
						description: string;
						type: 'options';
						value: ['0' | '1', '0' | '1'];
				  }
			>;
		}>;
		list_pertanyaan: Array<{
			number: string;
			question: string;
		}>;
	}>;
}

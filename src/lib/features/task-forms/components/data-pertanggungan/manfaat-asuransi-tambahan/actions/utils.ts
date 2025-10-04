import type { DataPertanggunganRes } from '../../type';

export function getInitialValues(
	data?: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_tambahan']
): DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_tambahan'][number] {
	const newId = data?.length ? data[data.length - 1].id + 1 : 1;
	const newNoUrut = data?.length ? data[data.length - 1].no_urut + 1 : 1;

	return {
		action: 'new',
		flagAction: 'NEW',
		flag_peserta: 0,
		flag_prometh: 0,
		id: newId,
		nama_rider: '',
		no_urut: newNoUrut,
		before: trackedData,
		after: trackedData
	};
}

const trackedData: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_tambahan'][number]['before'] = {
	lsre: null,
	jenis_tertanggung: {
		id: 0,
		label: ''
	},
	nama_tertanggung: '',
	mcl_id: 0,
	nama_produk: { riderId: 0, product: '' },
	nama_sub_produk: { id: 0, label: '', ldp_plan: 0, flag_new: null },
	premi: 0,
	mpp: 0,
	unit: { id: 0, label: '' },
	clas: { id: 0, label: '' },
	persentase_pertanggungan: 0,
	uang_pertanggungan: 0,
	masa_pertanggungan: 0,
	tanggal_mulai_pertanggungan: '',
	tanggal_akhir_pertanggungan: '',
	msprUrut: 0,
	msprFlagJenis: 0,
	flagJenisPeserta: 0,
	flagPrometh: null,
	flag_deduct: 0,
	waiver_duration: null,
	diagnosis: null,
	amount_extra: null,
	em: 0,
	mspr_discount: 0,
	ins_period: 0,
	ins_param: null,
	waive_period: null
};

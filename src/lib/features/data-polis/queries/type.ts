export interface DataPolisListRes {
	totalPage: number;
	'Data Polis': {
		idreg: string;
		nopol: string;
		no_spaj: string;
		status: string;
		nama_product: string;
		kurs: string;
		premi: string;
		nama_pp: string;
		nama_tt: string;
		tgl_lahir_pp: string;
		tgl_lahir_tt: string;
		no_identitas: string | null;
	}[];
}

export interface DataPolisSummaryRes {
	namaPP: string;
	flagVip: string;
	cif: string | null;
	noPol: string | null;
	noSpaj: string;
	issueDate: string;
	attentionList: string;
	basicPremium: number;
	topUpPremium: number;
	namaProduct: string;
	billingFreq: string;
	caraBayar: string;
	lastPayment: string | null;
	attentionNotes: string;
	statusPolis: string;
	flagging: unknown | null
	productCode: string;
	periodeCutiPremi: string | null;
}

export interface DataPolisClientRolesDataPPdanTURes {
	pemegangPolis: {
		alamatPenagihan: {
			regSpaj: string
			cp: string | null
			contact: string | null
			wilayah: string
			address: string
			zipCode: string
			areaCode1: string | null
			phone1: string | null
			areaCode2: string | null
			phone2: string | null
			areaCode3: string | null
			phone3: string | null
			areaCodeFax1: string | null
			fax1: string | null
			areaCodeFax2: string | null
			fax2: string | null
			region: string
			email: string | null
			noHp: string
			noHp2: string | null
			kota: string
			negara: string
		}
		dataDiriPp: {
			pemegangPolis: string
			vipCustomer: string
			cif: string | null
			noPol: string | null
			noSpaj: string
			issueDate: string
			attentionList: string
			attentionNotes: string
			basicPremium: number
			topUpPremium: number
			namaProduct: string
			billingFreq: string
			paymentMethod: string
			paidToDate: string | null
			dob: string
		}
		alamatPp: {
			alamatRumah: string
			kodePos: string
			noHp: string
			telponRumah: string | null
			wilayahRumah: string
			wilayahKantor: string
			alamatKantor: string
			kodePosKantor: string
			telponKantor: string | null
			email: string | null
		}
		pekerjaanPp: {
			jabatan: string
			uraianpekerjaan: string | null
			tujuan: string
			pendanaan: string
			penghasilan: string
			industri: string
			hubunganDenganTertanggung: string
			pekerjaan: string
		}
		rekeningPp: {
			namaRekeningManfaat: string
			namaBankManfaat: string
			nomorRekeningManfaat: string
			cabang: string
			kurs: string
			namaRekeningDebet: string
			namaBankDebet: string
			nomorRekeningDebet: string
			expiredDate: string
		} | null
	};
	tertanggungUtama: {
		namaLengkap: string
		ibuKandung: string
		buktiIdentitas: string
		nomorIdentitas: string
		kewarganegaraan: string
		umur: number
		jenisKelamin: string
		statusPernikahan: string
		agama: string
		alamatRumah: string
		wilayahRumah: string
		kodePosRumah: string
		teleponRumah: string | null
		tanggalLahir: string
		tempatLahir: string
		alamatKantor: string
		wilayahKantor: string
		kodePosKantor: string
		telponKantor: string | null
		noHp: string
		email: string | null
		jabatan: string
		uraianpekerjaan: string | null
		tujuan: string
	};
}


export interface DataPolisPertanggunganRes {
	dataTU: {
		plan_asuransi: string
		uang_pertanggungan: number
		basic_premium: number
		topup_premium: number
		medis: number
		masa_pertanggungan: number
		billing_account: string
		beg_date: string
		end_date: string
		cuti_premi: string | number | null // FIXME: lookup type for this
		eka_sehat: string
		mig_pertama: number
		lama_bayar: string
		payment_method: string
		cara_pembayaran: string
		alamat_penagihan: string
		kode_pos: number
		wilayah: string
		regional_penagihan: string | null
		email: string | null
		area_telp: string | null
		telp: string | null
		no_hp: string
		no_hp2: string | null
	}
	dataPeserta: {
		nama_peserta: string
		tanggal_lahir: string
		hubungan: string
		persentase: string
		jenis_kelamin: string
	}
}

export interface DataPolisPembayaranPremiRes {
	calon_pembayar_premi: string
	nama_pihak_ketiga: string | null
	bukti_identitas: number
	alamat_perusahaan: string
	kd_pos_perusahaan: number
	kota_perusahaan: string | null
	no_telpon_perusahaan: string | null
	bidang_usaha: string
	tempat_berdiri: string | null
	tanggal_berdiri: string | null
	penghasilan_calon_pp: string
	jumlah_total_rpb: string | null
	jumlah_total_nrpt: string | null
	sumber_pendapatan_rpb: string | null
	sumber_pendapatan_nrpt: string | null
	tujuan_pengajuan_asuransi: string
}

export type DataPolisTransactionHistoryEditRes = Array<{
	reg_spaj: string
	tanggal: string
	jenis: string
	status_polis: string
	nama_user: string
	keterangan: string
}> | null

export type DataPolisTransactionHistorySuratRes = Array<{
	tgl_print: string
	jenis_surat: string
	kode_matrix: string
	jatuh_tempo: string
	transaction_no: string
	dob: string
	url: string
	filename: string
}> | null

export type DataPolisHistoryStatusPolisRes = Array<{
	tgl_update: string
	status_from: string
	status_to: string
	osuser: string
	machine: string
	program: string
}> | null

export type DataPolisHistoryNotifikasiRes = Array<{
	tipe: string
	reg_spaj: string
	nopol: string
	jenis: string
	create_date: string
	sent_date: string
	status: string
	keterangan: string
	key: string
	periode: string
	no_trx: string
	category_name: string
}> | null

export type DataPolisPositionSPAJRes = Array<{
	tanggal: string
	posisi_dokumen: string
	status_polis: string
	status_accept: string
	nama_user: string
	keterangan_1: string
	keterangan_2: string
}> | null

export interface DataPolisDueDiligenceRes {
	Tertanggung_Utama: Array<{
		client: string
		cif: string | null
		nama: string
		pekerjaan: string
		rincianPekerjaan: string
		negara: string
		riskCustomer: string
		remarkRisk: string
		politicalExpose: string
		remarkPoliticalExpose: string
	}>
	Pemegang_Polis: DataPolisDueDiligenceRes['Tertanggung_Utama']
}

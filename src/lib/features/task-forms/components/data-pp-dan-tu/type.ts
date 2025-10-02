import type { IDLabel } from '$lib/utils/type';

type TrackedData<T> = {
	before: T;
	after: T;
};

export interface DataPPdanTURes {
	ppDanTuBerbeda: boolean;
	pemegangPolis: {
		flagEdit: boolean;
		dataDiri: TrackedData<{
			namaLengkap: string;
			jenisKelamin: IDLabel<number>;
			tempatLahir: string;
			tanggalLahir: string;
			usia: number;
			namaGadisIbuKandung: string;
			statusPernikahan: IDLabel<string>;
			agama: IDLabel<number>;
			kewarganegaraan: IDLabel<number>;
			buktiIdentitas: IDLabel<number>;
			nomorIdentitas: string;
			email: string;
			noHandphone: string;
			kodeTelepon: string;
			noTelepon: string;
			NPWP: string;
			hubunganDenganTU: IDLabel<number>;
			hobiBeresikoTinggi: IDLabel<number>;
		}>;
		infoPekerjaan: TrackedData<{
			pekerjaan: string;
			jenisUsaha: IDLabel<string>;
			namaPerusahaan: string;
			uraianPekerjaan: string;
		}>;
		alamat: TrackedData<{
			rumah: {
				provinsi: IDLabel<number>;
				negara: IDLabel<number>;
				kecamatan: IDLabel<number>;
				kodePos: string;
				detailAlamat: string;
				kotaKabupaten: IDLabel<number>;
				alamatKorespondensi: IDLabel<number>;
				kelurahan: IDLabel<number>;
			};
			pekerjaan: Omit<DataPPdanTURes['pemegangPolis']['alamat']['before']['rumah'], 'alamatKorespondensi'>;
			domisili: Omit<DataPPdanTURes['pemegangPolis']['alamat']['before']['rumah'], 'alamatKorespondensi'>;
		}>;
		financial: TrackedData<{
			sumberDana: string;
			penghasilanPerTahun: IDLabel<string>;
			tujuanMembeliAsuransi: string;
			namaPemilikRekening: string;
			namaBank: IDLabel<number>;
			nomorRekening: string;
			mataUangRekening: IDLabel<string>;
		}>;
		wajibPajakNegaraAsing: TrackedData<{
			description: string;
			negaraPajak: IDLabel<number>;
			tin: string;
		}>;
	};
	tertanggungUtama: {
		dataDiri: TrackedData<{
			namaLengkap: string;
			jenisKelamin: IDLabel<number>;
			tempatLahir: string;
			tanggalLahir: string;
			usia: number;
			namaGadisIbuKandung: string;
			statusPernikahan: IDLabel<number>;
			kewarganegaraan: IDLabel<number>;
			noHandphone: string;
			kodeTelepon: string;
			noTelepon: string;
			hobiBeresikoTinggi: IDLabel<number>;
		}>;
		infoPekerjaan: TrackedData<{
			namaPerusahaan: string;
			jenisUsaha: IDLabel<number>;
			pekerjaan: string;
			uraianPekerjaan: string;
		}>;
		alamat: TrackedData<{
			rumah: {
				provinsi: IDLabel<number>;
				negara: IDLabel<number>;
				kecamatan: IDLabel<number>;
				kodePos: string;
				alamatRumah: string;
				kotaKabupaten: IDLabel<number>;
				kelurahan: IDLabel<number>;
			};
			pekerjaan: DataPPdanTURes['tertanggungUtama']['alamat']['before']['rumah'];
			domisili: DataPPdanTURes['tertanggungUtama']['alamat']['before']['rumah'];
		}>;
	};
	sar: {
		totalSarLife: number | null;
		totalSarCI: number | null;
		totalSarPA: number | null;
		totalSarTPD: number | null;
		medicalSARLife: number | null;
		medicalSARCI: number | null;
		medicalSARTPD: number | null;
		medicalSARPA: number | null;
		medicalSARPANew: number | null;
		medicalRequirement: number | null;
	};
}

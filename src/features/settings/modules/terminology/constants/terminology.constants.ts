import type { TerminologyConfigItem } from "../types";

export const ENTITY_CONFIGS: TerminologyConfigItem[] = [
  {
    code: "SANTRI",
    defaultLabel: "Santri",
    description: "Peserta Didik.",
    placeholder: "Contoh: Siswa, Murid, Tholib",
  },
  {
    code: "HALAQAH",
    defaultLabel: "Halaqah",
    description: "Kelompok belajar.",
    placeholder: "Contoh: Kelas, Kelompok, Kafilah",
  },
  {
    code: "MUHAFIZ",
    defaultLabel: "Muhafiz",
    description: "Pembimbing Tahfiz.",
    placeholder: "Contoh: Ustadz, Guru, Asatidz",
  },
  {
    code: "SEKOLAH",
    defaultLabel: "Sekolah",
    description: "instansi, pondok, madrasah, atau yayasan.",
    placeholder: "Contoh: Pesantren, Pondok, Madrasah",
  },
];

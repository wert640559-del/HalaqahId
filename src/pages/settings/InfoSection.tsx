import { useNavigate } from "react-router-dom";
import { ChevronLeft, Info, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function InfoSection() {
  const navigate = useNavigate();

  return (
    <div className="px-2">
      {/* Header Minimalis */}
      <div className="flex items-center gap-4 py-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Informasi & SOP</h1>
          <p className="text-sm text-muted-foreground">Detail tugas, alur kerja, dan reward program</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">

        <AccordionItem value="structure">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            STRUCTURE TAHFIDZ TEAM
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-sm leading-relaxed">
            <div className="space-y-4">
              <div className="space-y-1">
                <p><span className="font-semibold text-muted-foreground">Koordinator Tahfidz	: </span> Akh Khodhir</p>
                <div className="flex gap-1">
                  <span className="font-semibold text-muted-foreground">Supervisor	:</span>
                  <div>
                    <p>1. Mas Najih</p>
                    <p>2. Kak Kia</p>
                  </div>
                </div>
                <p><span className="font-semibold text-muted-foreground">Muhafidz	: </span> 15 Orang ( 8 Ikhwan & 6 Akhwat)</p>
                <p className="text-[10px] text-primary font-bold pt-2 italic">Uptodate : Desember 2025 </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-dashed">
                <div>
                  <p className="font-bold mb-1 underline">Ikhwan 	:</p>
                  <div className="text-[13px] space-y-0.5">
                    <p>Akh. Naufal</p>
                    <p>Akh. Alfin</p>
                    <p>Akh. Naufalino</p>
                    <p>Akh. Fauzan</p>
                    <p>Akh. Hubaib</p>
                    <p>Akh. Hudzaifah</p>
                    <p>Akh. Izza</p>
                    <p>Akh. Dani</p>
                    <p>Akh. Fauzi</p>
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-1 underline">Akhwat : </p>
                  <div className="text-[13px] space-y-0.5">
                    <p>Ukht. Iklima</p>
                    <p>Ukht. Rajwa</p>
                    <p>Ukht. </p>
                    <p>Ukht. Fina</p>
                    <p>Ukht. Endah</p>
                    <p>Ukht. Kia</p>
                    <p>Ukht. Adiba</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 1: VISI & MISI */}
        <AccordionItem value="visi-misi">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Visi & Misi
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-sm leading-relaxed">
            <div className="space-y-4">
              <div>
                <p className="font-bold text-xs uppercase text-muted-foreground mb-1">Visi:</p>
                <p className="italic font-medium">
                  "Menjadi bagian dari upaya membentuk generasi yang dekat dengan Al-Qur'an, mampu menyeimbangkan kesibukan belajar IT dengan interaksi yang berkualitas dengan Al-Qur'an, serta lulus dengan hafalan dan bacaan yang thayyib."
                </p>
              </div>
              <div>
                <p className="font-bold text-xs uppercase text-muted-foreground mb-1">Misi:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Memfasilitasi santri dengan program yang memudahkan santri untuk berinteraksi dengan Al-Qur'an, baik secara individu maupun kelompok.</li>
                  <li>Membangun suasana pesantren yang kondusif bagi kegiatan tahfidz dan tadarus.</li>
                  <li>Menawarkan program yang fleksibel dengan merancang program tahfiz yang fleksibel dan sesuai dengan kemampuan serta kesibukan santri.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 2: TUGAS UTAMA */}
        <AccordionItem value="tugas-utama">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Tugas Utama
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-sm leading-relaxed">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <p className="font-bold text-xs underline uppercase text-muted-foreground">Tugas Supervisor:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Optimalisasi Strategi Program</li>
                  <li>Monitoring harian dan Dokumentasi Kegiatan</li>
                  <li>Santri optimal dalam berinteraksi dengan Al-Qur'an</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-xs underline uppercase text-muted-foreground">Tugas Tim Muhafiz:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Memastikan santri aktif mengikuti halaqah Al-Qur'an.</li>
                  <li>Meningkatkan kemampuan santri dalam membaca Al-Qur'an dengan makhraj dan tajwid yang benar.</li>
                  <li>Meningkatkan rata-rata jumlah hafalan santri per tahun.</li>
                  <li>Meningkatkan kepuasan santri terhadap program tahfiz yang diselenggarakan.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 3: LEVEL HALAQAH */}
        <AccordionItem value="level-halaqah">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            LEVEL HALAQAH
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-sm leading-relaxed">
            <div className="space-y-6">
              {/* Halaqah Bacaan */}
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Halaqah Bacaan</h4>
                <p>Santri tidak hafalan, hanya fokus untuk memperbaiki bacaan dan akan diadakan tes di setiap bulannya untuk memastikan siap menghafal atau belum.</p>
              </div>

              {/* Halaqah Hafalan */}
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Halaqah Hafalan</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Santri wajib setoran minimal sekali dalam 1 pekan.</li>
                  <li>Santri menghafal dengan target yang sudah ditentukan.</li>
                </ul>
                
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                  <p className="font-bold text-xs mb-2">Dalam satu pekan halaqah diadakan pada:</p>
                  <ul className="grid grid-cols-1 gap-1 text-[13px]">
                    <li>Ahad : Ba’da Subuh</li>
                    <li>Selasa : Ba’da Maghrib</li>
                    <li>Rabu : Ba'da Maghrib</li>
                    <li>Jum’at : Ba’da Maghrib</li>
                    <li>Sabtu : Ba’da Maghrib</li>
                  </ul>
                </div>

                <div className="mt-3">
                  <p className="font-bold text-xs mb-2 italic">Adapun target setoran itu ada 3 kategori :</p>
                  <ul className="list-disc ml-5 space-y-2 text-[13px]">
                    <li><span className="font-semibold">Ringan :</span> Setiap dua pekan minimal setoran 1 halaman, berarti per bulan adalah 1 lembar (2 halaman).</li>
                    <li><span className="font-semibold">Sedang :</span> Setiap dua pekan minimal setoran 1 lembar (2 halaman), berarti per bulan adalah 2 lembar (4 halaman.</li>
                    <li><span className="font-semibold">Intens :</span> Setiap dua pekan minimal setoran 2 lembar (4 halaman), berarti per bulan adalah 4 lembar (8 halaman).</li>
                  </ul>
                </div>
              </div>

              {/* Halaqah Khusus */}
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Halaqah Khusus</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Santri diwajibkan untuk menyetorkan hafalan mereka di setiap halaqah, seminimal-minimalnya 4x sepekan.</li>
                  <li>Target per pertemuan silahkan dipertimbangkan sesuai kemampuan santri masing-masing.</li>
                  <li>Santri harus menentukan target untuk menyelesaikan setoran berapa juz dalam waktu dia berada di pondok.</li>
                  <li>Santri bersedia menjadi penyimak untuk setoran teman-temannya. </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* SECTION 4: SUPERVISOR */}
        <AccordionItem value="supervisor">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Supervisor
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 1: Pemantauan Pelaksanaan Program</h4>
                <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Memastikan strategi yang telah dibuat oleh manager/koordinator tahfidz berjalan dengan maksimal</li>
                  <li>Melakukan kontrol harian terhadap semua kegiatan halaqah, termasuk kehadiran santri dan aktivitas yang berlangsung.</li>
                  <li>Mengamati segala hal yang bisa menjadi bahan evaluasi</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 2: Dokumentasi Kegiatan</h4>
                <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Mengambil dokumentasi foto atau video selama kegiatan halaqah untuk mencatat aktivitas santri dan mengetahui perkembangan mereka.</li>
                  <li>Membuat laporan harian yang mencakup catatan tentang kehadiran, kegiatan yang dilakukan, dan capaian santri.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 3: Interaksi Santri dengan Al-Qur'an</h4>
                <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  <li>Membantu merumuskan strategi supaya santri dapat maksimal berinteraksi dengan Al-Qur'an</li>
                  <li>Memastikan setiap santri mematuhi ketentuan yang berlaku selama halaqah, serta mengingatkan mereka jika ada pelanggaran.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 4: MUHAFIZ HAFALAN */}
        <AccordionItem value="muhafiz-hafalan">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Muhafiz Hafalan
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Menyimak Setoran Hafalan Santri</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Menyimak Setoran</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Muhafiz menyimak setoran hafalan santri dengan target 2 santri per pekan.</li>
                  <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                  <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Setiap sabtu kedua dan keempat, santri wajib menyetorkan hafalan selama dua pekan setiap periode sesuai target masing-masing.</li>
                  <li>Apa yang sudah disetorkan tetap dicatat di lembar mutaba’ah dan diberi tanda di samping kolom, misal : “tasmi’ per dua pekan” atau semisalnya.</li>
                  <li>Tasmi’ per dua pekan catatannya dibedakan dengan tasmi’ harian, yang berarti saat tiba tasmi’ periode kedua maka dia melanjutkan apa yang disetorkan di tasmi’ periode pertama bukan melanjutkan apa yang disetorkan di tasmi’ harian.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Sima’an Bacaan</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Halaqah dibuka dengan sima’an bacaan, yaitu muhafiz dan santri membaca Al-Quran bergantian saling menyimak dan memperhatikan bacaan dari setiap anggota halaqah.</li>
                  <li>Target sima’an bacaan minimal 1 halam atau setiap anggota mendapat giliran bacaan.</li>
                  <li>Bacaan dicatat di mutaba’ah sima’an bacaan</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen kehadiran santri setiap halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Sebelum melakukan sima’an bacaan, muhafiz mengabsen kehadiran anggota.</li>
                  <li>Setelah sima’an bacaan muhafiz kembali absen yg sekiranya terlambat atau lainnya.</li>
                  <li>Ba'da isya’ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Data Hafalan Santri</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Ba’da isya’ luangkan waktu untuk input apa yang telah disetorkan dari tasmi’ santri di hari itu ke link yang sudah ditentukan.</li>
                  <li>Setiap bulan, muhafiz mengisi raport target setoran setiap anggota perihal ketercapaian target yang sudah ditentukan untuk tiap bulan</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Evaluasi</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Evaluasi Halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Muhafiz mengambil satu pertemuan untuk setiap bulannya untuk mengevaluasi anggotanya; santri yang sudah sesuai target dimotivasi / di challange dan yang belum sesuai target diingatkan dan dimotivasi</li>
                  <li>Muhafiz melaporkan perkembangan setiap santri anggotanya di rapat bulanan muhafiz</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 5: MUHAFIZ BACAAN */}
        <AccordionItem value="muhafiz-bacaan">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Muhafiz Bacaan
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mentahsin Bacaan Santri</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengajari Baca Qur`an</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Mentalqin bacaan santri pada juz target (30, 29, 28)</li>
                  <li>Muhafiz menyimak bacaan yang sudah ditalqinkan.</li>
                  <li>Muhafiz mengarahkan santri menuliskan sampai mana bacaan yang sudah di storkan</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Setiap sabtu kedua dan keempat, Muhafiz harus mengadakan tes bacaan dari apa yang sudah ditalqinkan.</li>
                  <li>Muhafiz menentukan secara acak ayat-ayat yang sudah ditalqinkan untuk dibaca oleh setiap santri sebagai bentuk tes kemajuan kemampuan mereka.</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen kehadiran santri setiap halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Setelah muqaddimah dan do’a, Muhafiz mengabsen kehadiran anggota.</li>
                  <li>Ba'da isya’ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Peningkatan Bacaan Santri</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Ba’da isya’ luangkan waktu untuk input apa yang telah disetorkan dari tasmi’ santri di hari itu ke link yang sudah ditentukan.</li>
                  <li>Setiap bulan, muhafiz mengisi raport target setoran setiap anggota perihal ketercapaian target yang sudah ditentukan untuk tiap bulan.</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Evaluasi</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Evaluasi Halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Muhafiz mengambil satu pertemuan untuk setiap bulannya untuk mengevaluasi anggotanya; santri yang sudah sesuai target dimotivasi / di challange dan yang belum sesuai target diingatkan dan dimotivasi</li>
                  <li>Muhafiz melaporkan perkembangan setiap santri anggotanya di rapat bulanan muhafiz.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 6: MUHAFIZ KHUSUS */}
        <AccordionItem value="muhafiz-khusus">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Muhafiz Halaqah Khusus
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Menyimak Setoran Hafalan Santri</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Menyimak Setoran</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Muhafiz menyimak setoran hafalan santri dengan setiap santri harus setoran di setiap pertemuan.</li>
                  <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                  <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Sekali Duduk</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Jika terdapat santri yang hendak menyetorkan juz`iyyah (per juz) sekali duduk segera laporkan ke koordinator untuk segera dipersiapkan fasilitas yang diperlukan.</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen Kehadiran Santri Setiap Halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Sebelum melakukan setoran hafalan, muhafidz mengabsen kehadiran setiap anggota.</li>
                  <li>Ba'da isya’ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
                </ul>
                <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Data Hafalan Santri</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Ba’da isya’ luangkan waktu untuk input apa yang telah disetorkan dari tasmi’ santri di hari itu ke link yang sudah ditentukan.</li>
                  <li>Setiap bulan, muhafiz mengisi raport target setoran setiap anggota perihal ketercapaian target yang sudah ditentukan untuk tiap bulan</li>
                </ul>
              </div>
              <div className="pt-3 border-t">
                <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Evaluasi</h4>
                <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Evaluasi Halaqah</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Muhafiz mengambil satu pertemuan untuk setiap bulannya untuk mengevaluasi anggotanya; santri yang sudah sesuai target dimotivasi / di challange dan yang belum sesuai target diingatkan dan dimotivasi</li>
                  <li>Muhafiz melaporkan perkembangan setiap santri anggotanya di rapat bulanan muhafiz</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 7: ALUR KERJA (HAFALAN, BACAAN, KHUSUS) */}
        <AccordionItem value="alur-kerja">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Alur Kerja
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 pt-2 pb-6 text-balance leading-relaxed text-[13px]">
            <div className="p-3 bg-muted rounded-md text-muted-foreground italic mb-2">
              Bagian ini berisi ringkasan alur kerja harian untuk semua kategori muhafiz.
            </div>
            {/* Hafalan Alur */}
            <div className="space-y-2">
                <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ HAFALAN</h5>
                <p className="font-bold underline italic text-xs uppercase">JobDesk : Menyimak Setoran Hafalan Santri</p>
                <p className="font-bold text-[11px] uppercase">Aktivitas : Menyimak Setoran</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Muhafiz menyimak setoran hafalan santri dengan target 2 santri per pekan.</li>
                    <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                    <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
                </ul>
                <p className="font-bold text-[11px] uppercase mt-2">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Setiap sabtu kedua dan keempat, santri wajib menyetorkan hafalan selama dua pekan setiap periode sesuai target masing-masing.</li>
                    <li>Apa yang sudah disetorkan tetap dicatat di lembar mutaba’ah dan diberi tanda di samping kolom, misal : “tasmi’ per dua pekan” atau semisalnya.</li>
                    <li>Tasmi’ per dua pekan catatannya dibedakan dengan tasmi’ harian, yang berarti saat tiba tasmi’ periode kedua maka dia melanjutkan apa yang disetorkan di tasmi’ periode pertama bukan melanjutkan apa yang disetorkan di tasmi’ harian.</li>
                </ul>
            </div>
            {/* Bacaan Alur */}
            <div className="space-y-2 mt-4">
                <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ BACAAN</h5>
                <p className="font-bold underline italic text-xs uppercase">JobDesk : Mentahsin Bacaan Santri</p>
                <p className="font-bold text-[11px] uppercase">Aktivitas : Mengajari Baca Qur`an</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Mentalqin bacaan santri pada juz target (30, 29, 28)</li>
                    <li>Muhafiz menyimak bacaan yang sudah ditalqinkan.</li>
                    <li>Muhafiz mengarahkan santri menuliskan sampai mana bacaan yang sudah di storkan</li>
                </ul>
            </div>
            {/* Khusus Alur */}
            <div className="space-y-2 mt-4">
                <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ HALAQAH KHUSUS</h5>
                <p className="font-bold underline italic text-xs uppercase">JobDesk : Menyimak Setoran Hafalan Santri</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Muhafiz menyimak setoran hafalan santri dengan setiap santri harus setoran di setiap pertemuan.</li>
                    <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                    <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
                </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 8: REWARD */}
        <AccordionItem value="reward" className="border-b-0">
          <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
            Reward Program
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 leading-relaxed">
            <div className="space-y-4">
              <p className="font-bold text-sm">Program Apresiasi Hafalan Al-Qur'an:</p>
              <div className="grid gap-2">
                {[
                  { l: "3 Juz (30, 29, 28)", r: "Sertifikat + Traktiran (Rp15.000)", e: "untuk 3 tercepat per angkatan" },
                  { l: "1 Juz (Sekali Duduk)", r: "Sertifikat + Traktiran (Rp15.000)" },
                  { l: "10 Juz", r: "Sertifikat + Uang Jajan (Rp100.000)" },
                  { l: "20 Juz", r: "Sertifikat + Uang Jajan (Rp200.000)" },
                  { l: "30 Juz", r: "Sertifikat + Uang Saku (Rp300.000)" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border bg-muted/20 gap-2">
                    <span className="font-semibold text-sm">{item.l}</span>
                    <div className="flex flex-col items-end w-full sm:w-auto">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">{item.r}</Badge>
                      {item.e && <span className="text-[10px] text-muted-foreground italic mt-1">{item.e}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="text-center pt-6 border-t border-dashed">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">HalaqahId Information System</p>
      </div>
    </div>
  );
}
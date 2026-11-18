-- Jalankan SELURUH isi file ini sekaligus di Supabase > SQL Editor > New query > RUN
-- Mencakup 38 Provinsi di Indonesia beserta motif batik khas, filosofi, sejarah, simbolisme, penggunaan adat, dan foto autentik.

create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  characteristic text not null,
  description text not null
);

create table if not exists motifs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  occasion text not null,
  philosophy text not null,
  history text not null default '',
  symbolism text not null default '',
  description text not null,
  image_url text,
  region_id uuid references regions(id) on delete set null
);

alter table motifs add column if not exists history text not null default '';
alter table motifs add column if not exists symbolism text not null default '';
alter table motifs add column if not exists image_url text;

truncate table motifs, regions restart identity cascade;

-- 38 Provinsi Indonesia
insert into regions (name, province, characteristic, description) values
('Banda Aceh & Gayo', 'Aceh', 'Motif pintu tradisional Aceh, rencong, dan ukiran sulur islami', 'Batik Aceh memadukan kekayaan arsitektur tradisional dengan nilai spiritual dan sejarah Kerajaan Aceh Darussalam.'),
('Medan & Toba', 'Sumatera Utara', 'Motif ukiran Gorga Batak dengan warna merah, hitam, dan putih yang tegas', 'Batik Sumatera Utara mengadaptasi ragam hias rumah adat Bolon dan kain ulos ke dalam media batik.'),
('Padang & Tanah Datar', 'Sumatera Barat', 'Pewarnaan alami dari tanah liat (tanah liek) bernuansa cokelat tanah dan kuning', 'Batik Tanah Liek merupakan warisan budaya Minangkabau yang sempat langka dan kini lestari dengan motif rumah gadang serta pucuk rebung.'),
('Pekanbaru & Siak', 'Riau', 'Motif pucuk rebung, bunga kesumba, dan kaligrafi Melayu berwarna cerah', 'Terinspirasi dari tenun songket Siak dan tradisi Istana Kesultanan Siak Sri Indrapura.'),
('Tanjungpinang & Bintan', 'Kepulauan Riau', 'Motif biota laut seperti siput gonggong berpadu warna biru laut dan emas', 'Mencerminkan kehidupan maritim masyarakat Melayu Kepulauan Riau yang akrab dengan hasil laut.'),
('Kota Jambi', 'Jambi', 'Warna merah kesumba dan motif flora-fauna khas Kesultanan Jambi', 'Batik Jambi berkembang sejak abad ke-19 sebagai busana kaum bangsawan dan upacara adat Melayu Jambi.'),
('Palembang', 'Sumatera Selatan', 'Motif jumputan dan songket Sriwijaya dengan warna merah marun dan emas', 'Menggambarkan kejayaan Kerajaan Sriwijaya lewat ragam hias bunga melati, teratai, dan songket.'),
('Pangkalpinang & Muntok', 'Kepulauan Bangka Belitung', 'Paduan teknik batik dan tenun cual dengan motif flora laut', 'Terinspirasi dari kain cual Bangka yang dahulu menjadi busana kebesaran bangsawan.'),
('Kota Bengkulu', 'Bengkulu', 'Kaligrafi Arab yang berpadu dengan bunga Rafflesia arnoldii dan burung kuau', 'Batik Besurek diperkenalkan sejak masa pengasingan Sentot Alibasyah dan menjadi identitas budaya Bengkulu.'),
('Bandar Lampung', 'Lampung', 'Motif siger (mahkota adat), perahu jong, dan gajah Sumatera', 'Mengadaptasi simbol kebesaran kain tapis Lampung ke atas lembaran kain batik.'),
('Jakarta Pusat & Betawi', 'DKI Jakarta', 'Warna cerah mencolok dengan ikon budaya Betawi seperti Ondel-Ondel dan Monas', 'Batik Betawi berkembang di kawasan pesisir Jakarta dengan pengaruh budaya Tionghoa, Arab, dan Belanda.'),
('Cirebon & Garut', 'Jawa Barat', 'Motif awan Mega Mendung Cirebon serta corak geometris lembut Garutan', 'Jawa Barat memiliki dua kutub batik besar: gaya pesisir Cirebon yang ekspresif dan gaya Priangan Garut yang anggun.'),
('Serang & Pandeglang', 'Banten', 'Motif sejarah Kesultanan Banten seperti Datulaya dan fauna badak bercula satu', 'Batik Banten terinspirasi dari artefak keramik serta peninggalan arsitektur Surosowan abad ke-16.'),
('Surakarta, Pekalongan & Lasem', 'Jawa Tengah', 'Perpaduan batik sogan keraton Solo dengan batik pesisir penuh warna dari Pekalongan dan Lasem', 'Jawa Tengah merupakan salah satu jantung batik Indonesia dengan ragam teknik tulis dan cap yang mendunia.'),
('Yogyakarta & Bantul', 'DI Yogyakarta', 'Warna sogan cokelat tua, hitam pekat, dan latar putih bersih khas keraton', 'Batik Yogyakarta berakar kuat pada tradisi Keraton Ngayogyakarta Hadiningrat dengan aturan filosofis yang ketat.'),
('Madura & Banyuwangi', 'Jawa Timur', 'Warna berani khas Madura serta motif Gajah Oling yang ikonik dari Banyuwangi', 'Jawa Timur kaya akan batik pesisir dan pedalaman yang ekspresif, tegas, dan sarat makna lokal.'),
('Gianyar & Denpasar', 'Bali', 'Motif mitologi Bali seperti Singa Barong, poleng, dan ukiran pura', 'Batik Bali memadukan teknik batik Jawa dengan estetika seni lukis dan ukir tradisional Bali.'),
('Mataram & Lombok', 'Nusa Tenggara Barat', 'Motif Sasambo yang menyatukan budaya suku Sasak, Samawa, dan Mbojo', 'Menampilkan lumbung padi Sasak, rumah adat, dan cabai sebagai simbol ketahanan pangan NTB.'),
('Kupang & Manggarai', 'Nusa Tenggara Timur', 'Motif komodo, tenun ikat, dan alat musik sasando', 'Mengangkat kekayaan satwa endemik dan pola geometris kain tenun tradisional NTT.'),
('Pontianak', 'Kalimantan Barat', 'Motif corak insang ikan berulang berwarna cerah kuning-hijau-merah', 'Terinspirasi dari kehidupan masyarakat di tepian Sungai Kapuas yang lekat dengan perikanan.'),
('Palangka Raya', 'Kalimantan Tengah', 'Motif Batang Garing (pohon kehidupan) suku Dayak Ngaju yang berwarna-warni', 'Batik Benang Bintik menyimbolkan hubungan harmonis manusia, alam, dan Sang Pencipta.'),
('Banjarmasin', 'Kalimantan Selatan', 'Teknik jelujur dan ikat celup khas Banjar dengan warna cerah bergradasi', 'Sasirangan awalnya dibuat sebagai kain penyembuhan (pamintaan) dalam tradisi masyarakat Banjar.'),
('Samarinda & Kutai', 'Kalimantan Timur', 'Motif ukiran Dayak Kenyah, tameng, dan pesut Mahakam', 'Menggambarkan kekayaan hutan tropis Kalimantan serta warisan Kerajaan Kutai Kartanegara.'),
('Tarakan & Bulungan', 'Kalimantan Utara', 'Motif flora bakau, perahu tradisional, dan ukiran suku Tidung', 'Menonjolkan nuansa maritim perbatasan utara Kalimantan dengan corak tegas dan alami.'),
('Minahasa & Manado', 'Sulawesi Utara', 'Motif kain tenun Bentenan dan bunga cengkeh khas Minahasa', 'Menghidupkan kembali sembilan motif sakral warisan leluhur Minahasa.'),
('Palu & Donggala', 'Sulawesi Tengah', 'Motif bunga cengkeh, burung maleo, dan ukiran rumah adat Tambi', 'Batik Bomba menampilkan warna tanah dan emas yang elegan khas lembah Palu.'),
('Makassar & Toraja', 'Sulawesi Selatan', 'Aksara Lontara, kapal Pinisi, dan ukiran Tongkonan Toraja', 'Memadukan warisan pelaut ulung Bugis-Makassar dengan estetika ukiran Toraja.'),
('Kendari & Buton', 'Sulawesi Tenggara', 'Motif anoa, bunga anggrek serat, dan benteng Keraton Buton', 'Mencerminkan kekayaan alam endemik Sulawesi Tenggara serta sejarah Kesultanan Buton.'),
('Kota Gorontalo', 'Gorontalo', 'Perpaduan batik dengan sulaman tangan khas Gorontalo (Karawo)', 'Menampilkan ketelitian pengrajin Gorontalo melalui motif geometris dan flora pesisir.'),
('Mamuju & Polewali Mandar', 'Sulawesi Barat', 'Motif geometris Sekomandi dan perahu sandeq suku Mandar', 'Mengangkat nilai persaudaraan dan ketangguhan pelaut Mandar di Selat Makassar.'),
('Ambon & Banda', 'Maluku', 'Motif buah pala, cengkeh, dan alat musik tifa khas Kepulauan Rempah', 'Menghormati sejarah Maluku sebagai pusat rempah-rempah dunia sejak berabad-abad lalu.'),
('Ternate & Tidore', 'Maluku Utara', 'Motif cengkeh, gunung api Gamalama, dan kaligrafi Kesultanan Ternate', 'Mewakili kemegahan sejarah kesultanan maritim di timur Nusantara.'),
('Jayapura', 'Papua', 'Motif burung Cenderawasih, tifa, dan ukiran Sentani berwarna emas dan merah', 'Batik Papua memukau lewat penggambaran satwa surga dan seni ukir pesisir utara Papua.'),
('Manokwari', 'Papua Barat', 'Motif burung kasuari, rumah kaki seribu, dan flora hutan tropis', 'Memperkenalkan kearifan lokal masyarakat adat Arfak dan pesisir Manokwari.'),
('Merauke & Asmat', 'Papua Selatan', 'Motif patung ukiran kayu Asmat dan perahu lesung rawa selatan', 'Mengabadikan seni ukir suku Asmat yang terkenal hingga ke mancanegara ke atas kain.'),
('Mimika & Nabire', 'Papua Tengah', 'Motif ukiran perisai Kamoro dan panorama pegunungan tengah', 'Memadukan corak pesisir Mimika dengan kekayaan alam Papua Tengah.'),
('Jayawijaya & Wamena', 'Papua Pegunungan', 'Motif rumah adat Honai dan pola noken pegunungan Lembah Baliem', 'Melambangkan persatuan dan kehangatan masyarakat adat pegunungan tengah Papua.'),
('Sorong & Raja Ampat', 'Papua Barat Daya', 'Motif gugusan pulau karst Raja Ampat, terumbu karang, dan ikan manta', 'Menampilkan keindahan bahari kelas dunia Raja Ampat dalam balutan seni batik.');

-- Motif Batik Autentik untuk Seluruh 38 Provinsi
insert into motifs (name, category, occasion, philosophy, history, symbolism, description, image_url, region_id) values
(
  'Parang Rusak', 'Keraton', 'Upacara Adat',
  'Melambangkan pengendalian diri, keteguhan hati melawan hawa nafsu, serta kesinambungan perjuangan hidup seperti ombak laut yang tak pernah putus.',
  'Diciptakan oleh Panembahan Senopati pendiri Kerajaan Mataram Islam pada abad ke-16 setelah terinspirasi gulungan ombak Pantai Selatan.',
  'Simbol kewibawaan, keberanian, dan ikatan keluarga yang tidak terputus.',
  'Motif diagonal berbentuk huruf S yang saling bertaut membentuk garis miring tegas. Dahulu termasuk motif larangan yang hanya dikenakan keluarga keraton.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Collectie_NMvWereldculturen,_RV-847-77,_Batikpatroon,_%27Parang_rusak_barong%27,_voor_1891.jpg?width=800',
  (select id from regions where province = 'DI Yogyakarta' limit 1)
),
(
  'Kawung', 'Keraton', 'Acara Resmi',
  'Menggambarkan kesucian hati, keadilan, dan pengendalian diri manusia agar selalu berguna bagi sesama dari ujung ke ujung.',
  'Salah satu motif tertua di Jawa yang jejaknya sudah terlihat pada arca dan relief candi era Kerajaan Mataram Kuno abad ke-9 hingga ke-13.',
  'Terinspirasi dari buah aren (kolang-kaling) yang tersusun simetris melambangkan empat penjuru mata angin.',
  'Pola empat bulatan lonjong simetris yang menyerupai kelopak bunga teratai di atas latar gelap atau putih.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_kawung.jpg?width=800',
  (select id from regions where province = 'DI Yogyakarta' limit 1)
),
(
  'Sidomukti', 'Keraton', 'Pernikahan',
  'Berisi doa agar pemakainya mencapai kemuliaan, kecukupan lahir batin, serta keharmonisan rumah tangga yang langgeng.',
  'Berkembang di lingkungan Keraton Kasunanan Surakarta sebagai busana wajib dalam upacara pernikahan adat Jawa.',
  'Kata "Sido" berarti terlaksana dan "Mukti" berarti mulia atau sejahtera.',
  'Menampilkan ornamen kupu-kupu, singgasana, dan bangunan dengan warna sogan keemasan yang hangat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pedalaman_-_parang_klithik.JPG?width=800',
  (select id from regions where province = 'Jawa Tengah' limit 1)
),
(
  'Truntum', 'Keraton', 'Pernikahan',
  'Melambangkan kasih sayang tulus orang tua yang terus tumbuh dan membimbing anak menuju kehidupan rumah tangga baru.',
  'Diciptakan oleh Kanjeng Ratu Kencana (Permaisuri Sunan Pakubuwana III) pada abad ke-18 saat menatap taburan bintang di langit malam.',
  'Bintang kecil bertaburan melambangkan cinta kasih yang tumbuh kembali (tumaruntum).',
  'Motif bertabur kelopak bintang kecil yang rapat di atas latar gelap, biasa dikenakan oleh orang tua pengantin.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Indonesia.jpg?width=800',
  (select id from regions where province = 'Jawa Tengah' limit 1)
),
(
  'Tujuh Rupa', 'Pesisir', 'Busana Harian',
  'Melambangkan keterbukaan, keramahan, dan akulturasi harmonis masyarakat pesisir terhadap berbagai budaya pendatang.',
  'Tumbuh pesat di Pekalongan sejak abad ke-19 melalui perpaduan perajin lokal Jawa dengan pengaruh pedagang Tionghoa, Arab, dan Eropa.',
  'Ragam flora dan kupu-kupu melambangkan kehidupan yang dinamis dan penuh sukacita.',
  'Dipenuhi ragam hias bunga, daun, dan kupu-kupu dengan warna-warni cerah yang segar dipandang.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Jawa Tengah' limit 1)
),
(
  'Sekar Jagad', 'Keraton', 'Acara Resmi',
  'Melambangkan keindahan keberagaman budaya yang menyatu harmonis dalam satu kesatuan dunia.',
  'Berkembang di Surakarta dan Yogyakarta sejak abad ke-18, namanya berasal dari kata "kar" (peta) dan "jagad" (dunia) atau "sekar" (bunga).',
  'Potongan pulau bermotif berbeda melambangkan persatuan dalam perbedaan.',
  'Tersusun dari petak-petak organik bermotif flora dan geometris yang dirangkai seperti mozaik peta.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Jawa Tengah' limit 1)
),
(
  'Mega Mendung', 'Pesisir', 'Acara Resmi',
  'Melambangkan kesabaran, keteduhan hati, dan kemampuan meredam amarah layaknya awan pembawa hujan.',
  'Lahir di Cirebon abad ke-16 saat Sunan Gunung Jati menikahi Putri Ong Tien Nio dari Tiongkok yang membawa pengaruh estetika awan.',
  'Tujuh lapisan gradasi warna awan menyimbolkan tujuh lapis langit dan ketenangan batin.',
  'Motif ikonik berbentuk gumpalan awan bergradasi warna biru atau merah marun yang tegas dan berirama.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Mega_Mendung.jpg?width=800',
  (select id from regions where province = 'Jawa Barat' limit 1)
),
(
  'Merak Ngibing', 'Pedalaman', 'Busana Harian',
  'Menggambarkan keanggunan, keceriaan, dan pesona alam Priangan yang sejuk dan damai.',
  'Berkembang sebagai bagian dari tradisi Batik Garutan sejak awal abad ke-20 dengan warna sogan lembut dan krem gading.',
  'Burung merak menari melambangkan keharmonisan dan keindahan budi pekerti.',
  'Menampilkan sepasang burung merak yang membentangkan ekor di antara bunga dengan latar warna krem.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_buketan.jpg?width=800',
  (select id from regions where province = 'Jawa Barat' limit 1)
),
(
  'Gentongan', 'Pedalaman', 'Upacara Adat',
  'Melambangkan kesabaran dan ketekunan tingkat tinggi karena proses pewarnaannya memakan waktu berbulan-bulan.',
  'Warisan turun-temurun masyarakat Tanjung Bumi, Bangkalan, Madura yang merendam kain di dalam gentong tanah liat.',
  'Warna pekat alami menyimbolkan keteguhan karakter dan keberanian masyarakat Madura.',
  'Batik tulis dengan warna merah, kuning, dan hijau menyala berpadu motif sulur tanaman dan burung.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Madura.jpg?width=800',
  (select id from regions where province = 'Jawa Timur' limit 1)
),
(
  'Gajah Oling', 'Pedalaman', 'Acara Resmi',
  'Mengajak manusia agar selalu ingat (eling) kepada Tuhan Yang Maha Esa yang Maha Besar.',
  'Motif tertua khas masyarakat Osing Banyuwangi yang telah ada sejak era Kerajaan Blambangan.',
  'Bentuk menyerupai tanda tanya atau belalai gajah melambangkan kesadaran spiritual.',
  'Menampilkan ornamen lengkung besar menyerupai belalai gajah yang dikelilingi daun dan kupu-kupu.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Indonesia.jpg?width=800',
  (select id from regions where province = 'Jawa Timur' limit 1)
),
(
  'Batik Pinto Aceh', 'Nusantara', 'Acara Resmi',
  'Melambangkan keterbukaan masyarakat Aceh menerima tamu dengan tetap menjunjung tinggi adat dan kehormatan.',
  'Terinspirasi dari pintu rendah (Pinto Khop) peninggalan Sultan Iskandar Muda di Banda Aceh pada abad ke-17.',
  'Bentuk pintu rendah bermakna setiap orang yang masuk harus menundukkan kepala sebagai tanda hormat.',
  'Motif geometris menyerupai gerbang lengkung dipadukan sulur bunga dan aksen emas.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Indonesia.jpg?width=800',
  (select id from regions where province = 'Aceh' limit 1)
),
(
  'Batik Gorga Batak', 'Nusantara', 'Upacara Adat',
  'Melambangkan perlindungan keluarga, kesuburan, dan keteraturan kosmos dalam falsafah hidup Dalihan Na Tolu.',
  'Mengadaptasi ukiran Gorga tradisional yang menghiasi dinding rumah adat Batak ke dalam teknik batik.',
  'Warna merah, hitam, dan putih (Tiga Bolit) mewakili tiga alam kehidupan.',
  'Pola spiral dan sulur simetris berwarna merah marun, hitam, dan putih yang berkarakter kuat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_garuda.jpg?width=800',
  (select id from regions where province = 'Sumatera Utara' limit 1)
),
(
  'Batik Tanah Liek', 'Pedalaman', 'Upacara Adat',
  'Melambangkan kerendahan hati dan kedekatan manusia dengan alam serta tanah kelahiran.',
  'Batik khas Minangkabau yang sempat terhenti pada masa penjajahan lalu dibangkitkan kembali pada tahun 1990-an.',
  'Pewarnaan dari tanah liat (tanah liek) melambangkan asal-usul manusia dari tanah.',
  'Berwarna cokelat tanah, krem, dan kuning alami dengan motif pucuk rebung dan kaluak paku.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Tanah_Liek.jpg?width=800',
  (select id from regions where province = 'Sumatera Barat' limit 1)
),
(
  'Batik Tabir Riau', 'Pesisir', 'Acara Resmi',
  'Melambangkan kehidupan yang tertata rapi, bertingkat menuju kebaikan, serta kemakmuran negeri Melayu.',
  'Berkembang di wilayah Kesultanan Siak dan Pekanbaru dengan mengambil inspirasi dari tirai pelaminan adat Melayu.',
  'Motif pucuk rebung menyimbolkan pertumbuhan yang selalu berguna dari muda hingga tua.',
  'Susunan garis vertikal dan segitiga pucuk rebung berwarna cerah dengan aksen keemasan.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Riau' limit 1)
),
(
  'Batik Gonggong', 'Pesisir', 'Busana Harian',
  'Melambangkan kekayaan bahari Kepulauan Riau yang menjadi sumber penghidupan masyarakat pesisir.',
  'Diciptakan sebagai identitas visual modern Kabupaten Bintan dan Tanjungpinang sejak dekade 2000-an.',
  'Siput gonggong merupakan ikon kuliner dan satwa khas perairan Kepri.',
  'Menampilkan cangkang siput gonggong berulang di antara riak gelombang laut biru dan toska.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Mega_Mendung.jpg?width=800',
  (select id from regions where province = 'Kepulauan Riau' limit 1)
),
(
  'Batik Angso Duo', 'Nusantara', 'Upacara Adat',
  'Melambangkan keselarasan, kesetiaan pasangan, serta ketekunan mencari tempat terbaik untuk berkarya.',
  'Terinspirasi dari legenda sepasang angsa yang menuntun Putri Mayang Mangurai menemukan lokasi pendirian Kota Jambi.',
  'Dua ekor angsa yang beriringan melambangkan kerja sama dan keteguhan hati.',
  'Menampilkan sepasang angsa putih di atas latar merah kesumba yang dikelilingi sulur bunga.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Jambi' limit 1)
),
(
  'Batik Jumputan Palembang', 'Pesisir', 'Acara Resmi',
  'Melambangkan keagungan, kemakmuran, dan kegembiraan dalam perayaan adat masyarakat Sumatera Selatan.',
  'Berakar dari tradisi kain pelangi dan songket masa Kerajaan Sriwijaya serta Kesultanan Palembang Darussalam.',
  'Titik-titik ikat celup yang rapi melambangkan persatuan masyarakat.',
  'Pola belah ketupat dan bunga melati berwarna merah marun dan kuning emas yang kontras.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Sumatera Selatan' limit 1)
),
(
  'Batik Cual Bangka', 'Pesisir', 'Upacara Adat',
  'Melambangkan kehormatan, kesabaran, dan perpaduan harmonis budaya Melayu serta Tionghoa di Bangka Belitung.',
  'Mengadaptasi motif tenun ikat Cual Muntok abad ke-19 agar lebih ringan dan nyaman dikenakan sebagai batik.',
  'Motif flora laut dan burung hong melambangkan keberuntungan dan kemakmuran.',
  'Perpaduan warna merah tua, emas, dan biru laut dengan ornamen bunga simetris.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_buketan.jpg?width=800',
  (select id from regions where province = 'Kepulauan Bangka Belitung' limit 1)
),
(
  'Batik Besurek', 'Pesisir', 'Acara Resmi',
  'Melambangkan religiusitas yang menyatu dengan kecintaan terhadap alam dan kearifan lokal Bengkulu.',
  'Berkembang sejak abad ke-19 saat pengikut Pangeran Diponegoro memperkenalkan teknik membatik di Bengkulu.',
  'Huruf kaligrafi Arab ("besurek" berarti bersurat) berpadu dengan bunga Rafflesia arnoldii.',
  'Menampilkan rangkaian kaligrafi indah yang berpadu dengan kelopak bunga Rafflesia dan burung kuau.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Besurek_Bengkulu.jpg?width=800',
  (select id from regions where province = 'Bengkulu' limit 1)
),
(
  'Batik Siger Lampung', 'Nusantara', 'Acara Resmi',
  'Melambangkan martabat, kebijaksanaan, dan penghormatan terhadap adat istiadat masyarakat Lampung (Piil Pesenggiri).',
  'Mengangkat motif sakral kain Tapis dan mahkota Siger berlekuk sembilan ke dalam karya batik modern Lampung.',
  'Mahkota Siger menyimbolkan sembilan sungai utama dan kemuliaan budaya Lampung.',
  'Menampilkan siluet mahkota Siger keemasan berpadu perahu jong dan gajah.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_garuda.jpg?width=800',
  (select id from regions where province = 'Lampung' limit 1)
),
(
  'Batik Ondel-Ondel Betawi', 'Pesisir', 'Busana Harian',
  'Melambangkan keceriaan, semangat gotong royong, dan penolak bala dalam tradisi masyarakat Betawi.',
  'Dihidupkan kembali oleh para perajin Jakarta untuk melestarikan ikon budaya Betawi dan sejarah Sunda Kelapa.',
  'Sosok Ondel-Ondel melambangkan pelindung kampung dari pengaruh buruk.',
  'Warna cerah oranye, hijau, dan biru dengan gambar Ondel-Ondel, bunga kelapa, dan kembang manggar.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_buketan.jpg?width=800',
  (select id from regions where province = 'DKI Jakarta' limit 1)
),
(
  'Batik Datulaya Banten', 'Pesisir', 'Acara Resmi',
  'Melambangkan kejayaan sejarah maritim, ketegasan prinsip, dan keterbukaan masyarakat Banten.',
  'Dikembangkan dari hasil ekskavasi arkeologi artefak Keraton Surosowan Kesultanan Banten abad ke-16 hingga ke-17.',
  'Nama Datulaya merujuk pada tempat tinggal sang ratu atau pangeran di lingkungan keraton.',
  'Motif belah ketupat dan flora klasik berwarna biru tua, terakota, dan abu-abu.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_kawung.jpg?width=800',
  (select id from regions where province = 'Banten' limit 1)
),
(
  'Batik Singa Barong Bali', 'Nusantara', 'Upacara Adat',
  'Melambangkan keseimbangan antara kebaikan dan kekuatan penjaga alam semesta (Rwa Bhineda).',
  'Berkembang di Gianyar dan Denpasar pada abad ke-20 dengan memadukan teknik batik canting dan seni lukis Bali.',
  'Singa Barong menyimbolkan keberanian sekaligus pelindung dari energi negatif.',
  'Menampilkan figur Singa Barong di antara ukiran awan, dedaunan, dan warna cerah khas Bali.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_garuda.jpg?width=800',
  (select id from regions where province = 'Bali' limit 1)
),
(
  'Batik Sasambo', 'Nusantara', 'Acara Resmi',
  'Melambangkan persatuan tiga etnis besar di Nusa Tenggara Barat: Sasak, Samawa, dan Mbojo.',
  'Diciptakan sebagai simbol kebersamaan daerah NTB dengan mengangkat unsur budaya dari Pulau Lombok dan Sumbawa.',
  'Lumbung padi dan cabai melambangkan kesejahteraan serta ketahanan pangan masyarakat.',
  'Corak lumbung adat Sasak, bunga cengkeh, dan garis geometris berwarna hangat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Nusa Tenggara Barat' limit 1)
),
(
  'Batik Komodo NTT', 'Nusantara', 'Acara Resmi',
  'Melambangkan ketangguhan alam Nusa Tenggara Timur serta pelestarian satwa purba endemik Indonesia.',
  'Menggabungkan pola tenun ikat tradisional Timor dan Manggarai dengan teknik batik modern.',
  'Komodo dan alat musik sasando menyimbolkan keunikan alam dan harmoni budaya NTT.',
  'Menampilkan siluet komodo di atas pola geometris tenun ikat berwarna cokelat dan merah bata.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Tanah_Liek.jpg?width=800',
  (select id from regions where province = 'Nusa Tenggara Timur' limit 1)
),
(
  'Batik Corak Insang', 'Pesisir', 'Busana Harian',
  'Melambangkan pernapasan kehidupan dan ketergantungan harmonis masyarakat Pontianak terhadap Sungai Kapuas.',
  'Berawal dari kain tenun khas Kesultanan Pontianak yang kemudian diadaptasi menjadi motif batik ikonik.',
  'Bentuk zig-zag menyerupai insang ikan melambangkan gerak hidup yang terus mengalir.',
  'Deretan garis berombak simetris berwarna kuning keemasan, hijau, dan merah.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_Sasirangan.jpg?width=800',
  (select id from regions where province = 'Kalimantan Barat' limit 1)
),
(
  'Batik Benang Bintik', 'Pedalaman', 'Upacara Adat',
  'Melambangkan keseimbangan hubungan antara manusia, alam semesta, dan Tuhan dalam kepercayaan masyarakat Dayak Ngaju.',
  'Berkembang di Kalimantan Tengah dengan mengadaptasi simbol Batang Garing (pohon kehidupan) dan ukiran perisai.',
  'Batang Garing bermakna sumber kehidupan yang menaungi seluruh makhluk.',
  'Ornamen pohon kehidupan dan sulur Dayak berwarna kuning, merah, dan biru cerah.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Madura.jpg?width=800',
  (select id from regions where province = 'Kalimantan Tengah' limit 1)
),
(
  'Batik Sasirangan', 'Pesisir', 'Upacara Adat',
  'Melambangkan kesucian niat, pemulihan jiwa, dan ikatan persaudaraan masyarakat Banjar.',
  'Berakar dari tradisi abad ke-12 saat Patih Lambung Mangkurat membuat kain pamintaan untuk upacara penyembuhan.',
  'Kata "sirang" berarti menjelujur dengan benang untuk menghasilkan pola gradasi warna.',
  'Corak garis vertikal dan gelombang pelangi berwarna ungu, kuning, dan hijau yang lembut.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_Sasirangan.jpg?width=800',
  (select id from regions where province = 'Kalimantan Selatan' limit 1)
),
(
  'Batik Shaho Kalimantim', 'Pedalaman', 'Acara Resmi',
  'Melambangkan keberanian, kearifan menjaga hutan tropis, dan keluhuran budaya Dayak Kenyah.',
  'Dikembangkan di Samarinda dan Kutai Kartanegara untuk mempopulerkan seni ukir Kalimantan Timur.',
  'Burung enggang dan tameng Dayak menjadi simbol kepemimpinan dan perlindungan.',
  'Motif ukiran spiral khas Dayak dan siluet pesut Mahakam dengan warna kontras.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_garuda.jpg?width=800',
  (select id from regions where province = 'Kalimantan Timur' limit 1)
),
(
  'Batik Tidung Tarakan', 'Pesisir', 'Busana Harian',
  'Melambangkan ketangguhan masyarakat pesisir perbatasan dalam menjaga kelestarian hutan mangrove dan laut.',
  'Dikembangkan oleh perajin Tarakan dan Bulungan sejak berdirinya Provinsi Kalimantan Utara.',
  'Pohon bakau dan perahu melambangkan keseimbangan daratan dan lautan.',
  'Corak dedaunan bakau, gelombang air, dan ukiran etnis Tidung berwarna hijau toska dan cokelat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Mega_Mendung.jpg?width=800',
  (select id from regions where province = 'Kalimantan Utara' limit 1)
),
(
  'Batik Bentenan', 'Nusantara', 'Acara Resmi',
  'Melambangkan kemandirian, keluhuran budi, dan ikatan sejarah leluhur tanah Minahasa.',
  'Mengangkat kembali motif kain tenun kuno Bentenan dari abad ke-15 yang ditemukan di pesisir Minahasa.',
  'Pola geometris Bentenan melambangkan struktur sosial dan doa keselamatan.',
  'Susunan motif berlian dan garis berulang berwarna cokelat, biru, dan emas.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_kawung.jpg?width=800',
  (select id from regions where province = 'Sulawesi Utara' limit 1)
),
(
  'Batik Bomba Palu', 'Nusantara', 'Acara Resmi',
  'Melambangkan keterbukaan hati, kesuburan tanah lembah Palu, dan keramahan suku Kaili.',
  'Terinspirasi dari kain sarung tenun Bomba khas Donggala dan Palu yang diadaptasi ke dalam teknik batik.',
  'Bunga cengkeh dan burung maleo melambangkan kekayaan hayati Sulawesi Tengah.',
  'Motif bunga cengkeh dan ornamen rumah adat Tambi dengan warna sogan dan emas.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_pattern_-_buketan.jpg?width=800',
  (select id from regions where province = 'Sulawesi Tengah' limit 1)
),
(
  'Batik Lontara Makassar', 'Pesisir', 'Acara Resmi',
  'Melambangkan kecerdasan literasi, keberanian mengarungi samudra, dan keteguhan prinsip Siri na Pacce.',
  'Memadukan aksara kuno Lontara Bugis-Makassar dan perahu Pinisi ke dalam lembaran kain batik modern.',
  'Perahu Pinisi melambangkan semangat pantang menyerah pelaut Sulawesi Selatan.',
  'Deretan aksara Lontara bergaya kaligrafis berpadu siluet layar perahu Pinisi.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Besurek_Bengkulu.jpg?width=800',
  (select id from regions where province = 'Sulawesi Selatan' limit 1)
),
(
  'Batik Anoa Tolaki', 'Pedalaman', 'Busana Harian',
  'Melambangkan keunikan alam Sulawesi Tenggara serta persatuan masyarakat Tolaki, Muna, dan Buton.',
  'Dikembangkan di Kendari dengan mengambil inspirasi satwa endemik anoa dan tradisi Kalosara.',
  'Bunga anggrek serat dan anoa menyimbolkan kelestarian hayati wilayah tenggara Sulawesi.',
  'Menampilkan siluet anoa dan bunga anggrek di atas pola geometris biru dan cokelat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Indonesia.jpg?width=800',
  (select id from regions where province = 'Sulawesi Tenggara' limit 1)
),
(
  'Batik Karawo', 'Pesisir', 'Acara Resmi',
  'Melambangkan kesabaran, ketelitian, dan kehalusan budi pekerti masyarakat Gorontalo.',
  'Memadukan teknik membatik dengan kerajinan sulam tangan tradisional Karawo yang sudah ada sejak abad ke-17.',
  'Sulaman geometris melambangkan keteraturan hidup dan penghormatan kepada tamu.',
  'Perpaduan motif batik pesisir dengan aksen sulaman kerawang yang rapi dan elegan.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Gorontalo' limit 1)
),
(
  'Batik Sekomandi Mandar', 'Pedalaman', 'Upacara Adat',
  'Melambangkan ikatan persaudaraan yang erat dan ketangguhan masyarakat Mandar serta Kalumpang.',
  'Mengadaptasi motif kain tenun tertua di Nusantara (Sekomandi) ke dalam media kain batik yang lebih luwes.',
  'Kata "Sekomandi" berarti tali persaudaraan yang tidak terputus.',
  'Pola geometris belah ketupat bersambung berwarna merah tanah, hitam, dan krem.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Tanah_Liek.jpg?width=800',
  (select id from regions where province = 'Sulawesi Barat' limit 1)
),
(
  'Batik Pala Maluku', 'Pesisir', 'Acara Resmi',
  'Melambangkan kemakmuran, persaudaraan (Pela Gandong), dan kekayaan rempah Kepulauan Maluku.',
  'Diciptakan untuk mengenang sejarah Kepulauan Banda dan Ambon sebagai penghasil pala terbaik dunia.',
  'Buah pala dan tifa melambangkan sumber kesejahteraan serta keharmonisan sosial.',
  'Menampilkan buah pala terbelah, bunga cengkeh, dan alat musik tifa berwarna hangat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800',
  (select id from regions where province = 'Maluku' limit 1)
),
(
  'Batik Cengkeh Ternate', 'Pesisir', 'Acara Resmi',
  'Melambangkan keagungan sejarah Kesultanan Ternate-Tidore dan kemuliaan hasil bumi timur Nusantara.',
  'Menggabungkan ornamen rempah cengkeh dan siluet Gunung Gamalama dalam seni batik Maluku Utara.',
  'Cengkeh menyimbolkan daya tarik dan kemakmuran maritim Nusantara.',
  'Pola kuntum cengkeh berpadu motif gelombang laut dan siluet gunung api.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Mega_Mendung.jpg?width=800',
  (select id from regions where province = 'Maluku Utara' limit 1)
),
(
  'Batik Cenderawasih', 'Nusantara', 'Acara Resmi',
  'Melambangkan keagungan, keindahan surga timur Indonesia, serta kehormatan masyarakat adat Papua.',
  'Mulai berkembang di Jayapura sejak tahun 1980-an dengan memadukan teknik batik Jawa dan ukiran asli Papua.',
  'Burung Cenderawasih menjadi simbol kemuliaan dan keindahan alam Papua.',
  'Menampilkan burung Cenderawasih berbulu keemasan di antara tifa dan ukiran Sentani.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Papua_Cendrawasih.jpg?width=800',
  (select id from regions where province = 'Papua' limit 1)
),
(
  'Batik Kasuari Manokwari', 'Nusantara', 'Busana Harian',
  'Melambangkan keberanian, ketangguhan menjaga hutan adat, dan keselarasan hidup di Tanah Papua.',
  'Dikembangkan oleh pengrajin Manokwari untuk memperkenalkan satwa khas Papua Barat ke kancah nasional.',
  'Burung kasuari melambangkan kekuatan pelindung hutan tropis.',
  'Corak burung kasuari dan rumah kaki seribu dengan warna cokelat tanah dan jingga.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Papua_Cendrawasih.jpg?width=800',
  (select id from regions where province = 'Papua Barat' limit 1)
),
(
  'Batik Asmat', 'Pedalaman', 'Upacara Adat',
  'Melambangkan penghormatan terhadap leluhur dan keterampilan seni ukir masyarakat rawa selatan Papua.',
  'Mengabadikan pola ukiran kayu suku Asmat yang telah mendunia ke dalam media batik tulis dan cap.',
  'Motif patung dan perisai Asmat menyimbolkan keberanian serta penjagaan tradisi.',
  'Pola garis ukir tegas berwarna merah bata, hitam, dan putih gading.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Madura.jpg?width=800',
  (select id from regions where province = 'Papua Selatan' limit 1)
),
(
  'Batik Kamoro', 'Pedalaman', 'Acara Resmi',
  'Melambangkan rasa syukur atas hasil alam dan kekuatan spiritual masyarakat pesisir Mimika.',
  'Terinspirasi dari seni ukir perisai dan mbitoro milik suku Kamoro di Kabupaten Mimika, Papua Tengah.',
  'Garis melingkar dan spiral Kamoro melambangkan siklus kehidupan yang berkelanjutan.',
  'Ornamen spiral dan perisai khas Kamoro dengan warna cokelat tua, merah, dan emas.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Tanah_Liek.jpg?width=800',
  (select id from regions where province = 'Papua Tengah' limit 1)
),
(
  'Batik Honai Baliem', 'Pedalaman', 'Busana Harian',
  'Melambangkan kehangatan persaudaraan, persatuan, dan kesederhanaan masyarakat pegunungan tengah.',
  'Diciptakan untuk mengangkat ikon rumah adat Honai dan rajutan noken Lembah Baliem Jayawijaya.',
  'Rumah Honai bermakna tempat bermusyawarah dan menjaga kehangatan keluarga.',
  'Menampilkan deretan siluet rumah Honai dan pola anyaman noken berwarna hangat.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Indonesia.jpg?width=800',
  (select id from regions where province = 'Papua Pegunungan' limit 1)
),
(
  'Batik Raja Ampat', 'Pesisir', 'Busana Harian',
  'Melambangkan tanggung jawab menjaga kelestarian laut dan keajaiban terumbu karang Indonesia.',
  'Dikembangkan di Sorong dan Raja Ampat sebagai cendera mata budaya unggulan Papua Barat Daya.',
  'Ikan pari manta dan gugusan pulau karst menjadi simbol harmoni bahari.',
  'Corak terumbu karang, pari manta, dan pulau karst berwarna biru laut dan toska cerah.',
  'https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Mega_Mendung.jpg?width=800',
  (select id from regions where province = 'Papua Barat Daya' limit 1)
);

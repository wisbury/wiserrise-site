import type { AuditContent } from './index';

/**
 * Türkçe içerik. Puanlama bilerek şeffaf: her seçenek görünür puan taşıyor ve
 * toplam 100. Araç bir teşhis; ziyaretçi bize hiç yazmasa bile neyin zayıf
 * olduğunu öğreniyor.
 */

const groups = [
  { id: 'temel', label: 'Kategori ve temel bilgiler', max: 30 },
  { id: 'yorum', label: 'Değerlendirmeler', max: 30 },
  { id: 'tazelik', label: 'İçerik ve tazelik', max: 20 },
  { id: 'site', label: 'Site bağlantısı', max: 20 },
];

const questions = [
  {
    id: 'q1',
    group: 'temel',
    question: 'Birincil kategoriniz ana hizmetinizle birebir eşleşiyor mu?',
    help: 'Birincil kategori, yerel sıralamadaki en ağır alaka sinyali. Hacmi en yüksek ana hizmetinize verilmeli.',
    options: [
      { label: 'Evet, tam olarak eşleşiyor', points: 10 },
      { label: 'Yakın ama tam değil', points: 5 },
      { label: 'Emin değilim / bakmadım', points: 0 },
    ],
    advice:
      'Kategori, tek bir alanla yapabileceğiniz en büyük sıralama değişikliği. İlk üçteki rakiplerin birincil kategorisini çıkarıp karşılaştırmadan başka bir işe girişmeyin.',
    link: 'services/gbp',
  },
  {
    id: 'q2',
    group: 'temel',
    question: 'Hizmet listeniz dolu mu ve her hizmetin açıklaması var mı?',
    help: 'Çoğu profilde bu alan ya boş ya da Google’ın önerdiği genel etiketlerle dolu, yani rakiplerinizle birebir aynı.',
    options: [
      { label: 'Hepsi yazılı ve açıklamalı', points: 10 },
      { label: 'Liste var ama açıklama yok', points: 5 },
      { label: 'Boş ya da Google’ın önerdiği hali', points: 0 },
    ],
    advice:
      'Hizmet kalemlerini insanların gerçekten arattığı ifadelerle yazın ve her birine açıklama ekleyin. Bu isimlendirmeyi sitenizdeki hizmet sayfalarıyla birebir aynı tutun.',
    link: 'services/gbp',
  },
  {
    id: 'q3',
    group: 'temel',
    question: 'Çalışma saatleri, telefon ve web sitesi linki güncel mi?',
    help: 'Kapalı görünen ya da telefonu yanlış bir profil, sıralaması iyi olsa bile o müşteriyi kaybediyor.',
    options: [
      { label: 'Üçü de güncel, tatil günleri dahil', points: 10 },
      { label: 'Çoğu güncel ama kontrol etmiyorum', points: 5 },
      { label: 'Eksik veya eski bilgiler var', points: 0 },
    ],
    advice:
      'Bu alanlar sıralamadan çok dönüşümü etkiliyor. Özellikle resmi tatillerde özel saat girmek, "kapalı" görünüp müşteri kaybetmeyi önlüyor.',
  },
  {
    id: 'q4',
    group: 'yorum',
    question: 'Kaç değerlendirmeniz var?',
    options: [
      { label: '50 ve üzeri', points: 10 },
      { label: '20–49', points: 7 },
      { label: '5–19', points: 4 },
      { label: '0–4', points: 0 },
    ],
    advice:
      'Yorum sayısı, Google’ın bilinirlik dediği şeyin en kolay ölçülen parçası. Hedefinizi ilk üçteki rakiplerinizin ortalamasına göre koyun.',
    link: 'services/gbp',
  },
  {
    id: 'q5',
    group: 'yorum',
    question: 'İlk üçteki rakiplerinize göre değerlendirme hacminiz nasıl?',
    help: 'Haritada aynı sorguda çıkan ilk üç işletmeye bakın.',
    options: [
      { label: 'Onlardan fazla', points: 10 },
      { label: 'Benzer seviyede', points: 6 },
      { label: 'Belirgin şekilde az', points: 2 },
      { label: 'Bakmadım / bilmiyorum', points: 0 },
    ],
    advice:
      'Rakiplerinizin yorum sayısını bilmeden hedef koymayın. Aradaki farkı sayıyla çıkarın; baktığımız profillerde geride kalmanın sebebi en sık burada çıkıyor.',
    link: 'services/rank-tracking',
  },
  {
    id: 'q6',
    group: 'yorum',
    question: 'Gelen yorumlara yanıt veriyor musunuz?',
    help: 'Yorumlara yanıt vermek Google’ın yerel sıralama önerileri arasında. Yanıtınızı bir sonraki müşteri de okur.',
    options: [
      { label: 'Hepsine, birkaç gün içinde', points: 10 },
      { label: 'Bazılarına', points: 5 },
      { label: 'Hayır', points: 0 },
    ],
    advice:
      'Tüm yorumlara yanıt verin. Olumsuz yorumda önce özelden telafi edin, sonra kısa ve sakin bir yanıt yazın.',
    link: 'services/gbp',
  },
  {
    id: 'q7',
    group: 'tazelik',
    question: 'Son 30 günde profilinizde gönderi paylaştınız mı?',
    options: [
      { label: 'Düzenli paylaşıyorum', points: 10 },
      { label: 'Ara sıra', points: 5 },
      { label: 'Hayır', points: 0 },
    ],
    advice:
      'Gönderi tek başına sizi ilk üçe taşımaz. Profilin canlı olduğunu gösterir ve müşteriye güncel bir şey söyler. Her gönderiyi sitenizdeki bir hizmet sayfasına bağlayın.',
    link: 'services/gbp',
  },
  {
    id: 'q8',
    group: 'tazelik',
    question: 'Son 90 günde yeni fotoğraf eklediniz mi?',
    help: 'Bir kerede otuz foto yükleyip iki yıl dokunmamak yerine düzenli ekleme daha iyi çalışıyor.',
    options: [
      { label: 'Evet, düzenli ekliyorum', points: 10 },
      { label: 'Hayır, uzun süredir eklemedim', points: 0 },
    ],
    advice:
      'Gerçek tesis ve ekip fotoğrafları hem tazelik sinyali üretiyor hem de stok görselin yaratamadığı güveni sağlıyor.',
  },
  {
    id: 'q9',
    group: 'site',
    question: 'Profiliniz sitenizde hangi sayfaya bağlı?',
    options: [
      { label: 'Ana sayfa + hizmetler ayrı ayrı bağlı', points: 10 },
      { label: 'Sadece ana sayfa', points: 6 },
      { label: 'Site bağlı değil', points: 0 },
    ],
    advice:
      'Profildeki her hizmeti sitedeki karşılık gelen sayfaya bağlamak, Google’ın iki varlığı aynı işletme olarak eşleştirmesini kolaylaştırıyor.',
    link: 'services/on-page-seo',
  },
  {
    id: 'q10',
    group: 'site',
    question: 'Sitenizdeki işletme adı ve telefon, profildekiyle birebir aynı mı?',
    help: 'NAP tutarlılığı: aynı işletmenin farklı kaynaklarda aynı yazılması.',
    options: [
      { label: 'Evet, harfi harfine aynı', points: 10 },
      { label: 'Küçük farklılıklar var', points: 3 },
      { label: 'Kontrol etmedim', points: 0 },
    ],
    advice:
      'İsim ve telefonun her kaynakta birebir aynı olması, Google’ın işletmenin gerçekliğine dair biriktirdiği güveni doğrudan etkiliyor. Adressiz profillerde bu daha da kritik.',
    link: 'services/local-seo',
  },
];

const bands = [
  {
    min: 80,
    title: 'Temeliniz sağlam',
    text: 'Profil tarafında kök bir hata görünmüyor. Sıradaki iş, bölgenizden ölçümle hangi semtlerde geride kaldığınızı bulmak. Bu seviyede yarış, haritanın rekabetin yoğun olduğu köşelerinde.',
  },
  {
    min: 55,
    title: 'Belirgin boşluklar var',
    text: 'Profil çalışıyor ama birkaç alanda rakiplerinizin gerisindesiniz. Aşağıdaki zayıf noktalardan başlayın. Haritada ilk hareketi çoğu işletmede 4 ile 8 hafta arasında görüyoruz.',
  },
  {
    min: 0,
    title: 'Kritik eksikler var',
    text: 'Profilde sıralamayı doğrudan tutan eksikler var. İyi haber şu: aşağıdaki maddelerin çoğunu kendiniz düzeltebilirsiniz ve rakiplerinizin çoğu bu alanlara bakmıyor.',
  },
];

export const tr: AuditContent = {
  groups,
  questions,
  bands,
  ui: {
    answered: 'soru yanıtlandı',
    adviceHeading: 'Önce şunları düzeltin',
    adviceLink: 'Nasıl düzeltilir →',
    ctaLabel: 'Ücretsiz analiz al',
  },
};

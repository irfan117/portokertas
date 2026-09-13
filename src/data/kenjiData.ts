import { CaseStudy, LabNote } from '../types';

export const TALKS_WRITING = [
  {
    title: 'Penerapan RAG pada Manajemen Dokumen Institusi',
    desc: 'Catatan teknis mengenai implementasi Retrieval-Augmented Generation untuk temu kembali informasi kontekstual.',
    tag: 'Writing',
  },
  {
    title: 'Membangun REST API Berkinerja Tinggi dengan FastAPI & Pydantic',
    desc: 'Eksplorasi arsitektur asynchronous Python untuk endpoint berlatensi rendah dan validasi data ketat.',
    tag: 'Writing',
  },
  {
    title: 'Mengenal Vector Database Qdrant untuk Pencarian Semantik',
    desc: 'Workshop praktis pembuatan koleksi vector embedding dan metadata filtering untuk query natural.',
    tag: 'Workshop',
  },
  {
    title: 'Arsitektur Caching Redis untuk Mengurangi Beban Komputasi AI',
    desc: 'Taktik mengimplementasikan semantic caching agar query serupa tidak perlu memicu embedding dan LLM call ulang.',
    tag: 'Writing',
  },
  {
    title: 'Pemrosesan Dokumen Multi-Format & OCR Pipeline',
    desc: 'Teknik menangani dokumen PDF pindaian dengan OCR asinkron tanpa memblokir thread utama backend.',
    tag: 'Writing',
  },
];

export const WORK_PROJECTS = [
  {
    id: 'rag-institutional-chatbot',
    title: 'RAG Chatbot for Institutional Documents',
    desc: 'Sistem chatbot berbasis Retrieval-Augmented Generation (RAG) yang dirancang untuk membantu pengguna memperoleh informasi dari dokumen institusi secara lebih cepat, kontekstual, dan akurat.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    alt: 'Antarmuka dashboard sistem RAG Chatbot dan pencarian semantik dokumen',
    tags: ['Python', 'FastAPI', 'Qdrant', 'MongoDB Atlas', 'Redis', 'Next.js', 'Docker', 'AI/LLM'],
    images: [],
    highlights: ['Retrieval-Augmented Generation untuk dokumen institusi', 'Vector search dengan Qdrant dan caching Redis', 'Dashboard admin untuk pengelolaan dokumen dan sesi chat'],
  },
  {
    id: 'doc-ocr-pipeline',
    title: 'Multi-Format Document Ingestion & OCR Pipeline',
    desc: 'Pipeline backend otomatis untuk mengekstrak, membersihkan, dan memotong (chunking) teks dari beragam format file institusi dan PDF pindaian sebelum dimasukkan ke dalam vector database.',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80',
    alt: 'Kode editor ekstraksi teks dan pipeline dokumen OCR',
    tags: ['Python', 'FastAPI', 'OCR', 'AsyncIO', 'Docker'],
    images: [],
    highlights: ['Ingestion multi-format untuk PDF dan dokumen institusi', 'OCR pipeline untuk dokumen pindaian', 'Chunking teks sebelum indexing ke vector database'],
  },
  {
    id: 'embeddable-chat-widget',
    title: 'Embeddable Web Chatbot Widget',
    desc: 'Komponen frontend interaktif dan responsif yang siap disematkan ke berbagai portal institusi, mendukung streaming respons token (Server-Sent Events) dan rendering markdown.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    alt: 'Antarmuka chat widget modern di browser',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SSE'],
    images: [],
    highlights: ['Widget responsif yang bisa disematkan ke portal', 'Streaming respons token dengan Server-Sent Events', 'Markdown rendering untuk jawaban terstruktur'],
  },
  {
    id: 'modular-backend-architecture',
    title: 'Modular Backend & Persistent Data Store',
    desc: 'Layanan backend terstruktur dengan autentikasi session aman, persistensi riwayat percakapan MongoDB Atlas, serta layer caching Redis untuk performa maksimal.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Arsitektur database dan koneksi backend terdistribusi',
    tags: ['Node.js', 'Express', 'MongoDB Atlas', 'Redis', 'PostgreSQL'],
    images: [],
    highlights: ['Session auth untuk admin portfolio', 'Persistent chat history di MongoDB Atlas', 'Redis caching untuk mengurangi latency backend'],
  },
];

export const LAB_NOTES_GALLERY: LabNote[] = [
  {
    id: 'optimizing-rag-retrieval-qdrant-redis',
    slug: 'optimizing-rag-retrieval-qdrant-redis',
    title: 'Mengoptimalkan Pipeline RAG: Integrasi Qdrant Vector Search dan Semantic Caching dengan Redis',
    date: 'Januari 2026',
    readTime: '6 min read',
    category: 'AI & Backend Systems',
    tags: ['Python', 'FastAPI', 'Qdrant', 'Redis', 'RAG', 'Vector Database'],
    caption: 'Arsitektur pipeline RAG dengan semantic caching',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    alt: 'Mengetik kode pipeline backend di laptop dengan metrik terminal',
    summary:
      'Bagaimana kami merancang pipeline temu-kembali informasi dokumen institusi menggunakan FastAPI, Qdrant, dan layer Redis caching untuk memangkas latensi query umum dari 850ms menjadi di bawah 40ms.',
    content: [
      'Ketika membangun sistem chatbot untuk dokumen institusi, kendala terbesar adalah latensi inferensi saat setiap pertanyaan pengguna harus dihitung ulang embedding-nya dan memicu pencarian kosinus ke seluruh korpus dokumen.',
      'Dengan menerapkan semantic caching berbasis Redis di depan Qdrant vector database, kami dapat mengidentifikasi pertanyaan yang secara makna ekuivalen dan menyajikan respons terverifikasi secara instan tanpa perlu memanggil LLM kembali.',
      'Selain itu, kami mengonfigurasi payload indexing pada Qdrant berdasarkan metadata institusi (tahun terbit, jenis regulasi, unit kerja) agar proses filtering skalar dilakukan bersamaan dengan pencarian vektor berdimensi tinggi.',
      'Hasilnya adalah peningkatan drastis dalam throughput sistem dan efisiensi biaya komputasi, dengan latensi rata-rata p95 yang terjaga sangat stabil di bawah beban interaksi simultan.',
    ],
    codeSnippet: {
      language: 'python',
      filename: 'services/rag_engine.py',
      code: `@router.post("/query")
async def handle_rag_query(request: QueryRequest):
    # 1. Check Redis semantic cache first
    cached_response = await redis_client.get(f"cache:{request.query_hash}")
    if cached_response:
        return json.loads(cached_response)

    # 2. Vector search with Qdrant payload filters
    query_vector = await embedding_service.encode(request.query)
    search_results = qdrant_client.search(
        collection_name="institutional_docs",
        query_vector=query_vector,
        limit=5,
        query_filter=models.Filter(
            must=[models.FieldCondition(key="category", match=models.MatchValue(value=request.category))]
        )
    )
    return await generate_contextual_response(request.query, search_results)`,
    },
    keyTakeaways: [
      'Semantic caching di Redis menghemat komputasi model AI untuk pertanyaan berulang.',
      'Payload index pada vector DB seperti Qdrant penting untuk pemfilteran dokumen berbasis metadata.',
      'Pemisahan thread async pada FastAPI menjaga responsivitas server saat menangani payload dokumen besar.',
    ],
  },
  {
    id: 'multiformat-ocr-document-ingestion',
    slug: 'multiformat-ocr-document-ingestion',
    title: 'Pipeline Pemrosesan Dokumen Multi-Format & Taktik OCR Asinkron',
    date: 'Desember 2025',
    readTime: '5 min read',
    category: 'Document Engineering',
    tags: ['Python', 'OCR', 'PDF Parsing', 'FastAPI', 'Celery/Queue'],
    caption: 'Alur ekstraksi OCR dan pemotongan chunk teks',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Layar laptop menampilkan arsitektur pemrosesan dokumen',
    summary:
      'Strategi mengekstraksi teks dari dokumen PDF pindaian, formulir institusi, dan tabel tanpa merusak keterbacaan konteks sebelum di-vektorisasi ke database.',
    content: [
      'Dokumen institusi sering kali tidak hadir dalam format teks bersih; banyak yang berupa hasil scan dengan kualitas resolusi beragam, berisi tabel bergaris, atau memiliki stempel basah yang mengganggu OCR.',
      'Kami merancang pipeline ekstraksi bertahap: tahap pra-pemrosesan citra dengan penajaman kontras, deteksi orientasi otomatis, segmentasi blok teks, dan ekstraksi OCR menggunakan worker asinkron.',
      'Teks yang diekstraksi kemudian dipotong menggunakan recursive character text splitter dengan sliding window overlap agar konteks antarkalimat dan batas paragraf tetap utuh saat dicari oleh model embedding.',
    ],
    codeSnippet: {
      language: 'python',
      filename: 'workers/ocr_processor.py',
      code: `async def process_scanned_pdf(file_path: str) -> List[DocumentChunk]:
    images = convert_pdf_to_images(file_path, dpi=300)
    extracted_text = []
    
    for idx, img in enumerate(images):
        preprocessed = enhance_contrast_and_denoise(img)
        page_text = pytesseract.image_to_string(preprocessed, lang='ind+eng')
        extracted_text.append({"page": idx + 1, "text": clean_ocr_artifacts(page_text)})
        
    return chunk_document_with_metadata(extracted_text)`,
    },
    keyTakeaways: [
      'Pra-pemrosesan citra (kontras dan rotasi) adalah 70% penentu akurasi OCR.',
      'Gunakan sliding window overlap saat chunking teks agar makna antarkalimat tidak terputus.',
      'Simpan nomor halaman dan posisi metadata di setiap chunk untuk memudahkan verifikasi sumber.',
    ],
  },
  {
    id: 'designing-modular-backend-fastapi-node',
    slug: 'designing-modular-backend-fastapi-node',
    title: 'Membangun Arsitektur Backend Modular: Pemisahan Service & Database Layer',
    date: 'Oktober 2025',
    readTime: '4 min read',
    category: 'Backend Architecture',
    tags: ['FastAPI', 'Node.js', 'MongoDB', 'Redis', 'Clean Architecture'],
    caption: 'Pemisahan modul layanan dan data layer',
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80',
    alt: 'Seseorang bekerja di meja dengan editor kode backend',
    summary:
      'Pendekatan saya dalam memisahkan business logic, validasi skema data, dan repository database agar sistem backend mudah diuji dan dikembangkan.',
    content: [
      'Kunci dari backend yang tangguh adalah arsitektur yang tidak menyatukan koneksi database dengan endpoint routing. Dengan mengisolasi repository layer, pengujian unit dapat dilakukan secara cepat menggunakan mock data.',
      'Pada proyek RAG dan aplikasi institusi, kami memisahkan penanganan session autentikasi di Redis, penyimpanan log percakapan di MongoDB Atlas, dan pemrosesan komputasi berat di micro-endpoint FastAPI.',
      'Struktur ini memungkinkan tim untuk memperbarui model atau mengganti penyedia vector database tanpa perlu merombak antarmuka API yang sudah digunakan oleh frontend widget.',
    ],
    codeSnippet: {
      language: 'python',
      filename: 'core/dependencies.py',
      code: `# Dependency injection for clean database isolation
def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`,
    },
    keyTakeaways: [
      'Dependency injection membuat kode backend mudah diuji secara independen.',
      'Pisahkan database transaksional dari database analitik / vector search.',
      'Dokumentasi API otomatis (OpenAPI / Swagger) menghemat waktu kolaborasi frontend-backend.',
    ],
  },
];

export const EXPERIENCE_SLIDES = [
  {
    id: 'exp-1' as const,
    roleTitle: 'Backend & AI Project — Balai Pelatihan Talenta Komunikasi dan Digital',
    date: '2025 — 2026',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    alt: 'Tim mendiskusikan integrasi sistem RAG chatbot',
    captionTitle: 'Implementasi RAG Chatbot untuk Dokumen Institusi',
    captionSub: 'Balai Pelatihan Talenta Komunikasi dan Digital, 2025 — 2026',
  },
  {
    id: 'exp-1' as const,
    roleTitle: 'Integrasi Vector Database & Caching Pipeline',
    date: 'FastAPI, Qdrant & Redis, 2025',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    alt: 'Editor kode menampilkan pipeline pencarian semantik',
    captionTitle: 'Optimasi Semantic Retrieval & Latensi',
    captionSub: 'FastAPI & Qdrant Integration',
  },
  {
    id: 'exp-2' as const,
    roleTitle: 'Mahasiswa Teknik Informatika — Pengembang Sistem & Web',
    date: '2022 — Sekarang',
    img: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80',
    alt: 'Eksplorasi rekayasa perangkat lunak dan arsitektur web',
    captionTitle: 'Fokus Backend, AI Engineering & Web Terstruktur',
    captionSub: 'Bandung, 2022 — Sekarang',
  },
  {
    id: 'exp-3' as const,
    roleTitle: 'Independent Developer & Personal Open Source',
    date: '2023 — 2025',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pengembangan proyek web aplikasi dan otomasi',
    captionTitle: 'Membangun Proyek Nyata & Pipeline Pengujian',
    captionSub: 'GitHub & Personal Projects',
  },
];

export const CAREER_LIST = [
  {
    id: 'exp-1' as const,
    title: 'Balai Pelatihan Talenta Komunikasi dan Digital — Backend / AI Project',
    date: '2025 — 2026',
  },
  {
    id: 'exp-2' as const,
    title: 'Mahasiswa Teknik Informatika — Backend & AI Exploration',
    date: '2022 — Sekarang',
  },
  {
    id: 'exp-3' as const,
    title: 'Independent Web & API Developer — Personal Projects',
    date: '2023 — 2025',
  },
];

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'exp-1': {
    id: 'exp-1',
    period: '2025 — 2026 · Balai Pelatihan Talenta Komunikasi dan Digital',
    company: 'Balai Pelatihan Talenta Komunikasi dan Digital',
    role: 'Backend & AI Project Developer',
    subtitle: 'Membangun RAG Chatbot untuk Manajemen Informasi Dokumen Institusi.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    heroCaption: 'Arsitektur pipeline temu-kembali informasi dokumen institusi',
    leadParagraph1:
      'Proyek ini bertujuan untuk mengatasi kendala temu-kembali informasi dari ribuan lembar dokumen institusi yang tersebar dalam berbagai format. Kami mengembangkan sistem chatbot berbasis Retrieval-Augmented Generation (RAG) yang mampu memahami konteks pertanyaan pengguna secara akurat.',
    midImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    midCaption: 'Integrasi FastAPI backend dengan Qdrant dan Redis caching',
    leadParagraph2:
      'Pipeline backend dirancang secara modular menggunakan FastAPI, mengintegrasikan vector database Qdrant untuk pencarian semantik berkecepatan tinggi, MongoDB Atlas untuk riwayat interaksi, Redis sebagai semantic caching layer, serta pipeline OCR untuk menangani dokumen hasil scan.',
    bulletPoints: [
      'Mengembangkan sistem chatbot berbasis Retrieval-Augmented Generation (RAG) untuk dokumen institusi',
      'Membangun pipeline backend asynchronous menggunakan FastAPI dengan penanganan error komprehensif',
      'Mengintegrasikan Qdrant vector database untuk embedding dan semantic retrieval berlatensi rendah',
      'Menggunakan MongoDB Atlas untuk penyimpanan persisten riwayat percakapan dan metadata dokumen',
      'Menggunakan Redis sebagai caching layer cerdas untuk efisiensi komputasi query berulang',
      'Mendukung pemrosesan berbagai format dokumen termasuk ekstraksi teks berbasis OCR',
    ],
    endImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    endCaption: 'Sistem chatbot dan widget web teruji siap pakai',
    next: { id: 'exp-2', label: 'Mahasiswa Teknik Informatika, Bandung' },
  },
  'exp-2': {
    id: 'exp-2',
    period: '2022 — Sekarang · Bandung',
    company: 'Teknik Informatika',
    role: 'Mahasiswa & Software Developer',
    subtitle: 'Mendalami rekayasa sistem backend, kecerdasan buatan, dan arsitektur database.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    heroCaption: 'Eksplorasi arsitektur perangkat lunak dan komputasi',
    leadParagraph1:
      'Selama menempuh studi di Teknik Informatika, fokus utama saya terarah pada rekayasa backend, sistem cerdas berbasis AI, dan perancangan database terstruktur. Saya mempelajari bagaimana algoritma dan struktur data diterapkan langsung dalam mengatasi tantangan dunia industri nyata.',
    midImage: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80',
    midCaption: 'Pengembangan proyek-proyek praktis dan pengujian REST API',
    leadParagraph2:
      'Saya percaya bahwa fondasi akademik yang kuat harus diimbangi dengan kebiasaan mengeksekusi proyek nyata secara konsisten, mulai dari merancang skema database, menulis kode modular, hingga melakukan containerization dengan Docker.',
    bulletPoints: [
      'Mendalami perancangan sistem backend dengan Node.js/Express, Python (FastAPI/Django), dan RESTful API',
      'Mempelajari integrasi AI modern, prompt engineering, semantic retrieval, dan vector database',
      'Mengeksplorasi optimasi query SQL, pemodelan database NoSQL (MongoDB), dan caching (Redis)',
    ],
    endImage: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80',
    endCaption: 'Pengembangan berkesinambungan melalui proyek mandiri',
    prev: { id: 'exp-1', label: 'Balai Pelatihan Talenta Komunikasi dan Digital' },
    next: { id: 'exp-3', label: 'Independent Web Developer' },
  },
  'exp-3': {
    id: 'exp-3',
    period: '2023 — 2025 · Independent',
    company: 'Independent Projects',
    role: 'Fullstack & Backend Developer',
    subtitle: 'Membangun aplikasi web, personal tools, dan integrasi API.',
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    heroCaption: 'Eksplorasi beragam framework dan antarmuka pengguna',
    leadParagraph1:
      'Mengerjakan berbagai proyek web dan backend mandiri untuk memperdalam pemahaman tentang integrasi antarmuka frontend modern dengan service backend yang andal.',
    midImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    midCaption: 'Pembuatan komponen UI reaktif dan integrasi autentikasi',
    leadParagraph2: '',
    bulletPoints: [
      'Membangun aplikasi web interaktif menggunakan React, Next.js, dan Tailwind CSS',
      'Mengintegrasikan autentikasi JWT, session cookie, dan state management',
      'Mempublikasikan kode terbuka dan pipeline CI/CD pada multi-akun GitHub',
    ],
    endImage: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=1200&q=80',
    endCaption: 'Workflow pengembangan mandiri',
    prev: { id: 'exp-2', label: 'Mahasiswa Teknik Informatika' },
  },
};

export const INITIAL_PORTFOLIO_DATA = {
  profile: {
    name: 'M. Irfan',
    role: 'Backend Developer & AI Engineer',
    location: 'Bandung, Indonesia — UTC+7',
    heroTitle: 'Saya membangun sistem backend dan aplikasi AI yang mampu menyelesaikan masalah nyata.',
    heroLead:
      'Saya adalah mahasiswa Teknik Informatika yang berfokus pada pengembangan backend, sistem berbasis AI, dan pengembangan aplikasi web. Saya tertarik membangun sistem yang tidak hanya berjalan secara teknis, tetapi juga memiliki arsitektur yang terstruktur, dapat dikembangkan, dan memberikan manfaat nyata bagi penggunanya.',
    heroMeta: [
      { label: 'Currently', value: 'Building AI & Backend Projects' },
      { label: 'Focus', value: 'Node.js, Python, FastAPI, AI/RAG, Databases' },
      { label: 'Based in', value: 'Bandung, Indonesia' },
    ],
    heroStats: [
      {
        num: '< 1s',
        label: 'Latensi temu-kembali semantik pada RAG pipeline dokumen institusi.',
      },
      {
        num: '4+',
        label: 'Akun GitHub tersinkronisasi untuk eksplorasi AI, backend & automasi.',
      },
      {
        num: '100%',
        label: 'Arsitektur modular dengan isolasi servis, vector DB & caching.',
      },
    ],
    splitParallax: {
      title: 'Saat ini, saya sedang membangun',
      desc: 'Sistem RAG Chatbot untuk temu-kembali dokumen institusi, mengintegrasikan FastAPI, vector search Qdrant, Redis caching layer, dan ekstraksi OCR multi-format.',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    },
    homeQuote: {
      text: 'Sistem yang baik tidak hanya berjalan secara teknis, tetapi memiliki arsitektur yang terstruktur, modular, dan memberikan manfaat nyata bagi penggunanya.',
      cite: '— M. Irfan, Backend Developer & AI Engineer',
      bgImage:
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1800&q=80',
    },
    aboutQuote: {
      text: 'Membangun sistem AI dan backend berarti menyelaraskan ketepatan data, latensi rendah, dan kemudahan integrasi ke dalam satu kesatuan yang kokoh.',
      cite: '— Prinsip rekayasa perangkat lunak',
      bgImage:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=80',
    },
    aboutBio: [
      'Saya adalah mahasiswa Teknik Informatika yang berfokus pada pengembangan backend, sistem berbasis kecerdasan buatan (AI), dan aplikasi web modern. Ketertarikan saya berakar pada bagaimana data mentah dan dokumen dapat diubah menjadi wawasan interaktif berkecepatan tinggi melalui pipeline yang terstruktur.',
      'Dalam perjalanannya, saya terbiasa menangani arsitektur backend berbasis Python (FastAPI), Node.js, pengelolaan vector database seperti Qdrant untuk pencarian semantik (RAG), hingga orkestrasi database transaksional (MongoDB Atlas, PostgreSQL, Redis) serta antarmuka web modern dengan Next.js dan TypeScript.',
      'Bagi saya, perangkat lunak yang andal adalah perangkat lunak yang tangguh saat diuji di dunia nyata—memiliki pemisahan modul yang rapi, caching yang efisien, dan dokumentasi API yang jelas sehingga mudah dikembangkan lebih lanjut oleh siapa pun.',
    ],
    toolsHeading: 'Bagaimana saya memandang teknologi dan alat kerja',
    toolsText1:
      'Saya tidak membatasi diri secara kaku pada satu tech stack tertentu. Python, FastAPI, Node.js, Express, dan TypeScript adalah fondasi utama saya saat ini untuk kebutuhan backend dan sistem AI. Namun seiring perkembangan kebutuhan proyek, fleksibilitas dalam memilih arsitektur, database, atau framework baru adalah kunci terpenting.',
    toolsText2:
      'Dengan bantuan AI pair dan kebiasaan membaca dokumentasi resmi secara mendalam, mempelajari alat baru bukan lagi hambatan. Yang terpenting bukanlah fanatisme pada satu bahasa pemrograman, melainkan pemahaman fundamental: bagaimana data mengalir, bagaimana caching memangkas beban komputasi, serta bagaimana semantic retrieval menyajikan informasi paling akurat kepada pengguna.',
    portraitImg:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
    approachHeading: 'Prinsip dalam membangun sistem backend & AI',
    approachLead:
      'Langkah-langkah yang saya terapkan agar sistem yang dibangun tetap kokoh, terukur, dan mudah dirawat:',
    approachSteps: [
      'Pahami kebutuhan pengguna dan alur data nyata sebelum menulis baris pertama kode',
      'Rancang arsitektur modular dengan pemisahan dependensi dan tanggung jawab yang tegas',
      'Terapkan caching dan indexing cerdas untuk menjaga latensi tetap rendah',
      'Utamakan kejelasan arsitektur dan dokumentasi daripada kompleksitas yang tidak perlu',
    ],
  },
  workProjects: WORK_PROJECTS,
  labNotes: LAB_NOTES_GALLERY,
  talksWriting: TALKS_WRITING,
  careerList: CAREER_LIST,
  experienceSlides: EXPERIENCE_SLIDES,
  caseStudies: CASE_STUDIES,
  contact: {
    heading: 'Tertarik berkolaborasi pada proyek Backend atau AI? Mari berdiskusi.',
    email: 'm.irfan1q1@gmail.com',
    github: 'https://github.com/irfan117',
    linkedin: 'https://linkedin.com/in/m-irfan',
    xTwitter: 'https://github.com/fegeirfan',
    pgpNote: 'Tersedia untuk proyek backend, pengembangan sistem AI/RAG, atau kolaborasi teknik.',
  },
  nowItems: [
    { k: 'Currently Building', v: 'AI/RAG-based applications, web applications & personal developer projects' },
    { k: 'Currently Learning', v: 'Node.js/Express, Python (FastAPI/Django), and database & system architecture' },
    { k: 'Currently Exploring', v: 'AI Engineering, backend architecture, and cloud & scalable systems' },
  ],
};

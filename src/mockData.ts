export type CampusNode = {
  id: string;
  label: string;
  type: string;
  lat: number;
  lng: number;
  image: string;
  aliases: string[];
  descriptionVi: string;
  descriptionEn: string;
  openingHour: string;
  closingHour: string;
  rating: number;
  feedbacks: FeedbackItem[];
};

export type Edge = {
  from: string;
  to: string;
  distance: number;
  note: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export type FeedbackItem = {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const mockNodes: CampusNode[] = [
  {
    id: 'gate-main',
    label: 'Cổng chính VNU',
    type: 'gate',
    lat: 21.0367,
    lng: 105.7812,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    aliases: ['cong chinh', 'main gate', 'cua chinh'],
    descriptionVi: 'Cổng chính tiếp nhận sinh viên và khách đến khu vực trung tâm VNU, thuận tiện cho việc di chuyển đến ULIS.',
    descriptionEn: 'Main gate for students and visitors entering the central VNU zone with direct access to ULIS.',
    openingHour: '05:30',
    closingHour: '22:00',
    rating: 4.5,
    feedbacks: [
      { user: 'Minh Anh', rating: 5, comment: 'Bảo vệ hướng dẫn rất nhiệt tình.', createdAt: '2026-05-03 08:15' },
      { user: 'Nam Phong', rating: 4, comment: 'Buổi sáng khá đông nhưng dễ tìm.', createdAt: '2026-05-04 07:42' }
    ]
  },
  {
    id: 'gate-side',
    label: 'Cổng phụ Xuân Thủy',
    type: 'gate',
    lat: 21.0386,
    lng: 105.7833,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
    aliases: ['cong phu', 'xuan thuy gate', 'cua phu'],
    descriptionVi: 'Cổng phụ thường được sinh viên sử dụng để vào nhanh khu học tập phía đông.',
    descriptionEn: 'Secondary gate commonly used by students for quick access to eastern study zones.',
    openingHour: '06:00',
    closingHour: '21:30',
    rating: 4.3,
    feedbacks: [
      { user: 'Huyền Trang', rating: 4, comment: 'Đi lối này nhanh hơn cổng chính.', createdAt: '2026-05-02 10:20' }
    ]
  },
  {
    id: 'hub-central',
    label: 'Ngã giao thông nội bộ',
    type: 'hub',
    lat: 21.0378,
    lng: 105.7849,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    aliases: ['nga ba', 'hub', 'truc chinh'],
    descriptionVi: 'Điểm giao cắt trung tâm giữa các tuyến nội bộ ULIS, UET và UEB.',
    descriptionEn: 'Central internal intersection connecting ULIS, UET, and UEB routes.',
    openingHour: '00:00',
    closingHour: '23:59',
    rating: 4.1,
    feedbacks: [
      { user: 'Quang Vũ', rating: 4, comment: 'Có biển chỉ dẫn khá rõ.', createdAt: '2026-05-01 14:05' }
    ]
  },
  {
    id: 'ulis',
    label: 'ULIS',
    type: 'campus',
    lat: 21.0393,
    lng: 105.7863,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    aliases: ['truong dai hoc ngoai ngu', 'ulis vnu'],
    descriptionVi: 'Trường Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội, khu vực đào tạo chính với nhiều toà nhà học tập.',
    descriptionEn: 'University of Languages and International Studies, VNU main training zone with multiple buildings.',
    openingHour: '06:00',
    closingHour: '21:30',
    rating: 4.8,
    feedbacks: [
      { user: 'Lan Chi', rating: 5, comment: 'Khuôn viên đẹp, nhiều biển chỉ đường.', createdAt: '2026-05-03 16:40' },
      { user: 'Đức Anh', rating: 4, comment: 'Dễ tìm phòng nếu có sơ đồ.', createdAt: '2026-05-04 09:25' }
    ]
  },
  {
    id: 'uet',
    label: 'UET',
    type: 'campus',
    lat: 21.0377,
    lng: 105.788,
    image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=1200&q=80',
    aliases: ['truong dai hoc cong nghe', 'uet vnu'],
    descriptionVi: 'Khu học tập và hội trường của Trường Đại học Công nghệ.',
    descriptionEn: 'Academic and auditorium area of University of Engineering and Technology.',
    openingHour: '06:00',
    closingHour: '21:00',
    rating: 4.6,
    feedbacks: [{ user: 'Gia Hưng', rating: 5, comment: 'Không gian rộng, dễ di chuyển.', createdAt: '2026-05-02 11:00' }]
  },
  {
    id: 'ueb',
    label: 'UEB',
    type: 'campus',
    lat: 21.0362,
    lng: 105.7862,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    aliases: ['truong dai hoc kinh te', 'ueb vnu'],
    descriptionVi: 'Khu giảng đường và phòng học của Trường Đại học Kinh tế.',
    descriptionEn: 'Lecture halls and classrooms of University of Economics and Business.',
    openingHour: '06:30',
    closingHour: '20:30',
    rating: 4.4,
    feedbacks: [{ user: 'Bảo Ngọc', rating: 4, comment: 'Nhà vệ sinh sạch sẽ, dễ tìm thang máy.', createdAt: '2026-05-01 13:12' }]
  },
  {
    id: 'sis',
    label: 'SIS',
    type: 'campus',
    lat: 21.0357,
    lng: 105.7884,
    image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=1200&q=80',
    aliases: ['school of interdisciplinary studies', 'sis vnu'],
    descriptionVi: 'Không gian học liên ngành với các phòng seminar hiện đại.',
    descriptionEn: 'Interdisciplinary study area with modern seminar rooms.',
    openingHour: '07:00',
    closingHour: '20:00',
    rating: 4.3,
    feedbacks: [{ user: 'Phúc Thịnh', rating: 4, comment: 'Yên tĩnh, phù hợp học nhóm.', createdAt: '2026-04-30 18:45' }]
  },
  {
    id: 'is',
    label: 'IS',
    type: 'campus',
    lat: 21.0384,
    lng: 105.7899,
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80',
    aliases: ['international school', 'is vnu'],
    descriptionVi: 'Khu vực chương trình quốc tế với cơ sở vật chất hiện đại.',
    descriptionEn: 'International programs area with modern facilities.',
    openingHour: '07:00',
    closingHour: '21:00',
    rating: 4.7,
    feedbacks: [{ user: 'Mai Linh', rating: 5, comment: 'Phòng học hiện đại và thoáng.', createdAt: '2026-05-04 15:10' }]
  },
  {
    id: 'ulis-a2-301',
    label: 'Phòng A2-301 (ULIS)',
    type: 'room',
    lat: 21.0398,
    lng: 105.7868,
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80',
    aliases: ['a2-301', 'phong 301 ulis'],
    descriptionVi: 'Phòng học tầng 3 tòa A2, thường dùng cho các lớp kỹ năng ngôn ngữ.',
    descriptionEn: 'Third-floor classroom in A2 building, commonly used for language skills classes.',
    openingHour: '07:00',
    closingHour: '19:30',
    rating: 4.2,
    feedbacks: [{ user: 'Hoàng Long', rating: 4, comment: 'Âm thanh ổn, điều hòa tốt.', createdAt: '2026-05-03 19:20' }]
  },
  {
    id: 'uet-g2',
    label: 'Hội trường G2 (UET)',
    type: 'hall',
    lat: 21.0375,
    lng: 105.7886,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    aliases: ['hoi truong g2', 'g2 uet'],
    descriptionVi: 'Hội trường tổ chức sự kiện, hội thảo, có sức chứa lớn.',
    descriptionEn: 'Large auditorium for events and seminars.',
    openingHour: '08:00',
    closingHour: '21:30',
    rating: 4.6,
    feedbacks: [{ user: 'Thanh Hà', rating: 5, comment: 'Âm thanh hội trường rất tốt.', createdAt: '2026-05-02 20:05' }]
  },
  {
    id: 'ueb-203',
    label: 'Phòng 203 (UEB)',
    type: 'room',
    lat: 21.0359,
    lng: 105.7857,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    aliases: ['203 ueb', 'phong 203'],
    descriptionVi: 'Phòng học tầng 2 khu UEB, phù hợp lớp quy mô vừa.',
    descriptionEn: 'Second-floor classroom in UEB building, suitable for medium-sized classes.',
    openingHour: '07:00',
    closingHour: '18:30',
    rating: 4.0,
    feedbacks: [{ user: 'Thảo My', rating: 4, comment: 'Phòng gọn gàng, ánh sáng tốt.', createdAt: '2026-05-01 08:48' }]
  }
];

export const mockEdges: Edge[] = [
  { from: 'gate-main', to: 'hub-central', distance: 300, note: 'Truc duong chinh' },
  { from: 'gate-side', to: 'hub-central', distance: 230, note: 'Loi di sinh vien' },
  { from: 'hub-central', to: 'ulis', distance: 210, note: 'Duong noi bo 1' },
  { from: 'hub-central', to: 'uet', distance: 230, note: 'Duong noi bo 2' },
  { from: 'hub-central', to: 'ueb', distance: 200, note: 'Duong noi bo 3' },
  { from: 'uet', to: 'sis', distance: 180, note: 'Loi di qua thu vien' },
  { from: 'uet', to: 'is', distance: 170, note: 'Loi noi bo khu giang duong' },
  { from: 'ulis', to: 'ulis-a2-301', distance: 70, note: 'Len toa A2' },
  { from: 'uet', to: 'uet-g2', distance: 60, note: 'Sanh truoc G2' },
  { from: 'ueb', to: 'ueb-203', distance: 45, note: 'Tang 2 khu UEB' },
  { from: 'gate-side', to: 'ulis', distance: 160, note: 'Loi tat can bo (khong co tren Google Maps)' },
  { from: 'ueb', to: 'sis', distance: 120, note: 'Loi noi bo ven ho' }
];

export const mockMembers: TeamMember[] = [
  {
    name: 'Nguyen Van A',
    role: 'PM',
    bio: 'Quan ly tien do va nghiep vu he thong.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Tran Thi B',
    role: 'Frontend',
    bio: 'Phat trien giao dien va trai nghiem nguoi dung.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Le Van C',
    role: 'Data Mapping',
    bio: 'Thu thap toa do va xay dung du lieu diem den.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  }
];

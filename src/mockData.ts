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
  comment: string;
  createdAt: string;
  avatar?: string;
};

export type CommunityFeedback = FeedbackItem & {
  id: string;
};

export const mockNodes: CampusNode[] = [
  {
    "id": "1",
    "label": "Cổng trường ULIS",
    "type": "Các địa điểm check-in",
    "lat": 21.0396764,
    "lng": 105.7812156,
    "image": "https://lh3.googleusercontent.com/u/0/d/1w3M58WMCquZ6fB47W03_RiOkIKZpLbQr=w1227-h848-iv2?auditContext=prefetch",
    "aliases": [
      "cong chinh",
      "main gate",
      "cua chinh"
    ],
    "descriptionVi": "Cổng chính của Ulis nằm ngay mặt đường Phạm Văn Đồng",
    "descriptionEn": "Main gate for students and visitors entering the central VNU zone with direct access to ULIS.",
    "openingHour": "05:30",
    "closingHour": "22:00",
    "feedbacks": [
      {
        "user": "Minh Anh",
        "comment": "Bảo vệ hướng dẫn rất nhiệt tình.",
        "createdAt": "2026-05-03 08:15",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      },
      {
        "user": "Nam Phong",
        "comment": "Buổi sáng khá đông nhưng dễ tìm.",
        "createdAt": "2026-05-04 07:42",
        "avatar": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "2",
    "label": "Thần đá",
    "type": "Các địa điểm check-in",
    "lat": 21.039657,
    "lng": 105.7817527,
    "image": "https://lh3.googleusercontent.com/u/0/d/1_4LxODsXAZygDb_Tx8-QN9QN5EyjRDT6=w1227-h868-iv2?auditContext=prefetch",
    "aliases": [
      "cong phu",
      "xuan thuy gate",
      "cua phu"
    ],
    "descriptionVi": "Tảng đá khắc tên trường có thể nhìn thấy ngay từ chính diện cổng vào. Là nơi gửi gắm ước mơ GPA cao của biết bao thế hệ sinh viên ULIS",
    "descriptionEn": "Secondary gate commonly used by students for quick access to eastern study zones.",
    "openingHour": "06:00",
    "closingHour": "21:30",
    "feedbacks": [
      {
        "user": "Huyền Trang",
        "comment": "Đi lối này nhanh hơn cổng chính.",
        "createdAt": "2026-05-02 10:20",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "3",
    "label": "Cây xoài",
    "type": "Các địa điểm check-in",
    "lat": 21.0396335,
    "lng": 105.7819884,
    "image": "https://lh3.googleusercontent.com/u/0/d/1RuU2PdgzOEb2prSCOV67kOLz6zOeDjvz=w1227-h868-iv2?auditContext=prefetch",
    "aliases": [
      "nga ba",
      "hub",
      "truc chinh"
    ],
    "descriptionVi": "Hai bên đường vào khuôn viên trường rợp bóng xoài xanh, mùa hè thì mát, mùa xoài thì… chờ xoài rụng",
    "descriptionEn": "Central internal intersection connecting ULIS, UET, and UEB routes.",
    "openingHour": "00:00",
    "closingHour": "23:59",
    "feedbacks": [
      {
        "user": "Quang Vũ",
        "comment": "Có biển chỉ dẫn khá rõ.",
        "createdAt": "2026-05-01 14:05",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "4",
    "label": "Circle Cây",
    "type": "Các địa điểm check-in",
    "lat": 21.0391964,
    "lng": 105.7825292,
    "image": "https://lh3.googleusercontent.com/u/0/d/1Yo9Jm8DVYuM5VQMxj8nWsJr9gvTgO0v0=w1920-h868-iv1?auditContext=prefetch",
    "aliases": [
      "truong dai hoc ngoai ngu",
      "ulis vnu"
    ],
    "descriptionVi": "Toạ độ vàng để tám chuyện, học nhóm, chờ crush đi ngang qua hay đơn giản là nghỉ ngơi giữa tiết của ULIS-ers",
    "descriptionEn": "University of Languages and International Studies, VNU main training zone with multiple buildings.",
    "openingHour": "06:00",
    "closingHour": "21:30",
    "feedbacks": [
      {
        "user": "Lan Chi",
        "comment": "Khuôn viên đẹp, nhiều biển chỉ đường.",
        "createdAt": "2026-05-03 16:40",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      },
      {
        "user": "Đức Anh",
        "comment": "Dễ tìm phòng nếu có sơ đồ.",
        "createdAt": "2026-05-04 09:25",
        "avatar": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "5",
    "label": "Hồ Matcha",
    "type": "Các địa điểm check-in",
    "lat": 21.0388212,
    "lng": 105.7816304,
    "image": "https://lh3.googleusercontent.com/u/0/d/1N7QGnBW8Bh8qUkNhh8dQg0Lpja_02jRE=w1227-h868-iv1?auditContext=prefetch",
    "aliases": [
      "truong dai hoc cong nghe",
      "uet vnu"
    ],
    "descriptionVi": "Nằm gọn trong khu Khoa Pháp ULIS, chiếc hồ này quanh năm xanh mướt như một ly matcha đá xay phiên bản “không uống được”. Chẳng ai nhớ ai là “cha đẻ” của cái tên này, chỉ biết sinh viên ULIS cứ thế gọi riết thành quen — vừa thân thương, vừa rất gì và này nọ",
    "descriptionEn": "Academic and auditorium area of University of Engineering and Technology.",
    "openingHour": "06:00",
    "closingHour": "21:00",
    "feedbacks": [
      {
        "user": "Gia Hưng",
        "comment": "Không gian rộng, dễ di chuyển.",
        "createdAt": "2026-05-02 11:00",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "6",
    "label": "Khuôn viên Khoa Pháp",
    "type": "Các địa điểm check-in",
    "lat": 21.0390421,
    "lng": 105.7824414,
    "image": "https://lh3.googleusercontent.com/u/0/d/19_XWKfQt72gN9sxyjBUAjDP0K5VuKsIE=w1227-h868-iv1?auditContext=prefetch",
    "aliases": [
      "truong dai hoc kinh te",
      "ueb vnu"
    ],
    "descriptionVi": "Mang vẻ đẹp cổ kính, yên bình - trải qua bao năm vẫn giữ được nét trầm lắng và duyên dáng rất riêng, như một góc nhỏ không vội vã giữa lòng trường",
    "descriptionEn": "Lecture halls and classrooms of University of Economics and Business.",
    "openingHour": "06:30",
    "closingHour": "20:30",
    "feedbacks": [
      {
        "user": "Bảo Ngọc",
        "comment": "Nhà vệ sinh sạch sẽ, dễ tìm thang máy.",
        "createdAt": "2026-05-01 13:12",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "7",
    "label": "Sân bóng",
    "type": "Các địa điểm check-in",
    "lat": 21.039923,
    "lng": 105.7823532,
    "image": "https://lh3.googleusercontent.com/u/0/d/1UFCh5wtf-unq36O4-0-AMSamo52I0dRh=w1227-h868-iv2?auditContext=prefetch",
    "aliases": [
      "school of interdisciplinary studies",
      "sis vnu"
    ],
    "descriptionVi": "Nơi ngắm trai xinh gái đẹp miễn phí, lại còn bonus cardio nhẹ nhàng 🫶⚽",
    "descriptionEn": "Interdisciplinary study area with modern seminar rooms.",
    "openingHour": "07:00",
    "closingHour": "20:00",
    "feedbacks": [
      {
        "user": "Phúc Thịnh",
        "comment": "Yên tĩnh, phù hợp học nhóm.",
        "createdAt": "2026-04-30 18:45",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "8",
    "label": "Homies B2",
    "type": "Các địa điểm check-in",
    "lat": 21.0375642,
    "lng": 105.782367,
    "image": "https://lh3.googleusercontent.com/u/0/d/16pjkeRh3vPopHY5lVL7HMEGZZR1bMsOu=w1227-h868-iv2?auditContext=prefetch",
    "aliases": [
      "international school",
      "is vnu"
    ],
    "descriptionVi": "Homies B2 là hệ “học ít nói nhiều”, vừa cày deadline vừa update drama",
    "descriptionEn": "International programs area with modern facilities.",
    "openingHour": "07:00",
    "closingHour": "21:00",
    "feedbacks": [
      {
        "user": "Mai Linh",
        "comment": "Phòng học hiện đại và thoáng.",
        "createdAt": "2026-05-04 15:10",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "9",
    "label": "Homies C3",
    "type": "Các địa điểm check-in",
    "lat": 21.0390136,
    "lng": 105.7820035,
    "image": "https://lh3.googleusercontent.com/u/0/d/1Fw_1VXMw_JV2sVUCJF7AYgb2q1lLNMN2=w1227-h868-iv2?auditContext=prefetch",
    "aliases": [
      "a2-301",
      "phong 301 ulis"
    ],
    "descriptionVi": "Còn Homies C3 là hệ “im lặng là vàng”, vào là auto tập trung… hoặc auto ngủ nếu lỡ mang theo chăn 😭",
    "descriptionEn": "Third-floor classroom in A2 building, commonly used for language skills classes.",
    "openingHour": "07:00",
    "closingHour": "19:30",
    "feedbacks": [
      {
        "user": "Hoàng Long",
        "comment": "Âm thanh ổn, điều hòa tốt.",
        "createdAt": "2026-05-03 19:20",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "10",
    "label": "UCP B2",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0374158,
    "lng": 105.7824545,
    "image": "https://lh3.googleusercontent.com/u/0/d/1v7d1KI-zMDtm0hFBdPGkpdreLVXH8C4t=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [
      "hoi truong g2",
      "g2 uet"
    ],
    "descriptionVi": "Căng-tin UCP B2 và B3 là “tọa độ quen mặt” của sinh viên với vô vàn món ngon và đồ uống hấp dẫn, không gian xinh xắn, thoáng mát cực hợp để vừa ăn uống vừa chill cùng bạn bè sau giờ học; đây không chỉ là nơi nạp năng lượng mà còn là góc tụ tập siêu vui, nơi lưu giữ vô số khoảnh khắc đáng nhớ.",
    "descriptionEn": "Large auditorium for events and seminars.",
    "openingHour": "08:00",
    "closingHour": "21:30",
    "feedbacks": [
      {
        "user": "Thanh Hà",
        "comment": "Âm thanh hội trường rất tốt.",
        "createdAt": "2026-05-02 20:05",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "11",
    "label": "UCP B3",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0384685,
    "lng": 105.7824162,
    "image": "https://lh3.googleusercontent.com/u/0/d/1dDPLAkAdXArqKvnPSEHjUt8C0cr4h38m=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [
      "203 ueb",
      "phong 203"
    ],
    "descriptionVi": "Căng-tin UCP B2 và B3 là “tọa độ quen mặt” của sinh viên với vô vàn món ngon và đồ uống hấp dẫn, không gian xinh xắn, thoáng mát cực hợp để vừa ăn uống vừa chill cùng bạn bè sau giờ học; đây không chỉ là nơi nạp năng lượng mà còn là góc tụ tập siêu vui, nơi lưu giữ vô số khoảnh khắc đáng nhớ.",
    "descriptionEn": "Second-floor classroom in UEB building, suitable for medium-sized classes.",
    "openingHour": "07:00",
    "closingHour": "18:30",
    "feedbacks": [
      {
        "user": "Thảo My",
        "comment": "Phòng gọn gàng, ánh sáng tốt.",
        "createdAt": "2026-05-01 08:48",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      }
    ],
  },
  {
    "id": "12",
    "label": "UCP đối diện Khoa Pháp",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0389845,
    "lng": 105.7826707,
    "image": "https://lh3.googleusercontent.com/u/0/d/134CIldMsQJGxWqQ6kWgvCsi3CAyhl0zT=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Ở đây chúng tôi có bánh mì, nước uống, và đặc biệt nhất phải kể đến kem mỗi ngày 2 vị khác nhau 😝 có thể lựa chọn 1 vị hoặc mix vị đó nhen 🥰",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "13",
    "label": "Khu vực đồ ăn cổng sắt",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0409638,
    "lng": 105.782671,
    "image": "https://lh3.googleusercontent.com/u/0/d/1sdWRctZULgyYK7vH7pvps0VMACcunSvO=w1227-h848-iv2?auditContext=forDisplay",
    "aliases": [],
    "descriptionVi": "Nếu không biết ăn gì, nơi đây sẽ là thiên đường lý tưởng với vô vàn sự lựa chọn cho bạn 😍 ",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "14",
    "label": "Căng tin nhà ăn VNU",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0406571,
    "lng": 105.782838,
    "image": "https://lh3.googleusercontent.com/u/0/d/1iRxwnRS-J9OCdfiumy0UCvlY09XMezuk=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Chân ái của sinh viên, đồ ăn giá hạt dẻ mà vẫn đầy đặn, thịt rau đủ cả nên ăn rất ổn🥰",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "15",
    "label": "Căng tin ký túc xá",
    "type": "Các địa điểm ăn uống",
    "lat": 21.0408083,
    "lng": 105.7822037,
    "image": "https://lh3.googleusercontent.com/u/0/d/1unCkE4Un1n_O6u6J8PhKDRJrnE2k5dqV=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Một dãy quán ăn đối diện ký túc xá với đủ món từ bún, cơm, phở đến chè, muốn ăn gì cũng có mà giá vẫn rất sinh viên. Ăn xong bước ra là có sân cầu lông, ghế đá ngồi hóng mát, buôn chuyện với bạn bè đúng chuẩn chill hết nấc",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "16",
    "label": "UMP - Trường Đại học Y Dược ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0403511,
    "lng": 105.7812904,
    "image": "https://lh3.googleusercontent.com/u/0/d/1aJWYYi4jFREGybj3vyVMMLTSCAtkHbMy=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Đại học Y Dược - Đại học Quốc gia Hà Nội là trường đào tạo các ngành thuộc lĩnh vực sức khỏe như Y khoa, Dược học, Răng Hàm Mặt, Điều dưỡng…  Trường theo đuổi triết lý phát triển “Cùng nhau tạo dựng niềm tin”, hướng tới đào tạo nguồn nhân lực y tế chất lượng cao, giỏi chuyên môn và giàu y đức. UMP có môi trường học tập hiện đại, chú trọng nghiên cứu khoa học và thực hành lâm sàng, là một trong những trường đào tạo khối ngành sức khỏe uy tín tại Việt Nam.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "17",
    "label": "UL - Trường Đại học Luật ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0379312,
    "lng": 105.7824447,
    "image": "https://lh3.googleusercontent.com/u/0/d/1rk7vkm1_mj_ybcbP_2aFXQTZdnuGur3q=w1227-h848-iv2?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Đại học Luật – Đại học Quốc gia Hà Nội (VNU–LS) là cơ sở đào tạo luật uy tín, hướng tới chất lượng cao và hội nhập quốc tế. Trường có các khoa tiêu biểu như Luật Kinh tế, Luật Dân sự, Luật Hành chính, Luật Quốc tế và Luật Hình sự. Với đội ngũ giảng viên giàu kinh nghiệm, trường chú trọng kết hợp lý thuyết và thực tiễn nhằm đào tạo nguồn nhân lực pháp lý chất lượng cho xã hội.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "18",
    "label": "SIS - Trường Khoa học Liên ngành và Nghệ thuật ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0382197,
    "lng": 105.7812354,
    "image": "https://lh3.googleusercontent.com/u/0/d/1_k_sEtbEF4HCY9H6KBOysMj7wZTKJCqB=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Khoa học Liên ngành và Nghệ thuật - Đại học Quốc gia Hà Nội (VNU-SIS) là một trong 21 đơn vị đào tạo trực thuộc Đại học Quốc gia Hà Nội, chuyên đào tạo về lĩnh vực công nghiệp văn hóa, công nghiệp sáng tạo và nghệ thuật trên nền tảng khoa học liên ngành. Với khẩu hiệu \"Kiến tạo tương lai bằng tri thức liên ngành\" và triết lý giáo dục \"Tư duy liên ngành - Tinh thần khai phóng - Tầm nhìn toàn cầu\", nhà trường hướng đến đào tạo thế hệ sáng tạo mới, đáp ứng nhu cầu phát triển kinh tế sáng tạo của Việt Nam và hội nhập quốc tế. Hiện tại, VNU-SIS đào tạo các ngành: Quản trị thương hiệu, Quản lý giải trí và sự kiện, Quản trị tài nguyên di sản, Quản trị đô thị thông minh và bền vững, Thiết kế sáng tạo, Kiến trúc và thiết kế cảnh quan, Nghệ thuật thị giác và Công nghệ truyền thông. Trường có hơn 2.500 sinh viên đại học chính quy theo học tại 4 cơ sở trên địa bàn Hà Nội, cùng hơn 200 học viên cao học và nghiên cứu sinh.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "19",
    "label": "UET - Trường Đại học Công nghệ ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0382686,
    "lng": 105.7826429,
    "image": "https://lh3.googleusercontent.com/u/0/d/1rEhcuhIqv_E-aJbDWs43t5oyNz8_-wJP=w1227-h848-iv2?auditContext=forDisplay",
    "aliases": [],
    "descriptionVi": "Trường Đại học Công nghệ – Đại học Quốc gia Hà Nội (UET–VNU) là một trong những trường hàng đầu tại Việt Nam trong lĩnh vực kỹ thuật và công nghệ. Trường có slogan “Creative Thinking for the Future – Sáng tạo, Tiên phong, Chất lượng cao”, thể hiện định hướng đào tạo nguồn nhân lực công nghệ chất lượng cao. Các khoa chính của trường gồm Công nghệ thông tin, Điện tử – Viễn thông, Vật lý kỹ thuật & Công nghệ nano, Cơ học kỹ thuật & Tự động hóa, Công nghệ nông nghiệp, Xây dựng, cùng các viện như Trí tuệ nhân tạo và Công nghệ hàng không vũ trụ. UET hướng tới môi trường đào tạo gắn với nghiên cứu khoa học và phát triển các công nghệ tiên tiến như AI, dữ liệu lớn, vi điện tử và tự động hóa.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "20",
    "label": "UEB - Trường Đại học Kinh tế ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0380714,
    "lng": 105.7828293,
    "image": "https://lh3.googleusercontent.com/u/0/d/1dsXwffttVjyJ81SszLw5e1k22r5TAlLF=w1227-h848-iv2?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Đại học Kinh tế - Đại học Quốc gia Hà Nội (UEB - VNU) là cơ sở đào tạo và nghiên cứu uy tín trong lĩnh vực kinh tế, quản lý và quản trị kinh doanh tại Việt Nam. Trường định hướng phát triển theo mô hình đại học nghiên cứu, chú trọng đào tạo nguồn nhân lực có tư duy đổi mới, năng lực hội nhập quốc tế và khả năng thích ứng với bối cảnh kinh tế số. VNU-UEB hiện đào tạo các ngành như Kinh tế quốc tế, Tài chính – Ngân hàng, Kế toán, Quản trị kinh doanh, Kinh tế phát triển và Kinh tế số. Nhà trường chú trọng gắn kết giữa lý thuyết với thực tiễn thông qua hoạt động nghiên cứu, hợp tác doanh nghiệp và các chương trình trao đổi học thuật trong và ngoài nước. Với môi trường học tập năng động và định hướng đổi mới sáng tạo, VNU-UEB hướng tới đào tạo thế hệ công dân toàn cầu có năng lực chuyên môn và trách nhiệm xã hội.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "21",
    "label": "UEd - Trường Đại học Giáo dục ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0384404,
    "lng": 105.7813554,
    "image": "https://lh3.googleusercontent.com/u/0/d/1y-CiJGEP8w33rLJODfZ_JkakkbP1GVjf=w1227-h848-iv2?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Đại học Giáo dục – Đại học Quốc gia Hà Nội (VNU-UED) là cơ sở đào tạo và nghiên cứu chuyên sâu trong lĩnh vực khoa học giáo dục, đào tạo giáo viên và quản lý giáo dục. Trường hướng tới xây dựng môi trường giáo dục hiện đại, tiên phong đổi mới phương pháp dạy học và phát triển nguồn nhân lực chất lượng cao cho ngành giáo dục Việt Nam. VNU-UED đào tạo các ngành thuộc lĩnh vực sư phạm, quản lý giáo dục, tâm lý học giáo dục và khoa học giáo dục. Nhà trường chú trọng kết hợp giữa nghiên cứu học thuật với thực hành nghề nghiệp, đồng thời đẩy mạnh ứng dụng công nghệ và phương pháp giáo dục tiên tiến trong đào tạo. Với định hướng phát triển bền vững và hội nhập quốc tế, VNU-UED góp phần đào tạo đội ngũ nhà giáo, nhà nghiên cứu và chuyên gia giáo dục đáp ứng yêu cầu đổi mới giáo dục trong thời đại mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "22",
    "label": "HSB - Trường Quản trị và Kinh doanh ĐHQGHN",
    "type": "Các trường trong VNU",
    "lat": 21.0384231,
    "lng": 105.7815304,
    "image": "https://lh3.googleusercontent.com/u/0/d/1GJl7kHMoFbMHVBaAAQn8OfB--zsfrkDO=w1227-h848-iv1?auditContext=prefetch",
    "aliases": [],
    "descriptionVi": "Trường Quản trị và Kinh doanh (HSB) là thành viên của Đại học Quốc gia Hà Nội, nổi tiếng với các chương trình đào tạo đạt chuẩn kiểm định quốc tế (ACQUIN). Trường hiện đào tạo 4 ngành cử nhân chất lượng cao gồm: Quản trị doanh nghiệp và Công nghệ, Marketing và Truyền thông, Quản trị Nhân lực và Nhân tài, và Quản trị và An ninh. Điểm đặc biệt của HSB là lộ trình giảng dạy bằng tiếng Anh, chú trọng kết hợp giữa tư duy quản trị hiện đại và kỹ năng giải quyết các vấn đề an ninh phi truyền thống.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": [],
  },
  {
    "id": "23",
    "label": "A1",
    "type": "",
    "lat": 21.0397187,
    "lng": 105.783238,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "24",
    "label": "A2",
    "type": "",
    "lat": 21.0394167,
    "lng": 105.7832135,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "25",
    "label": "A3",
    "type": "",
    "lat": 21.0391435,
    "lng": 105.7827803,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "26",
    "label": "A4",
    "type": "",
    "lat": 21.0399205,
    "lng": 105.7827897,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "27",
    "label": "A5",
    "type": "",
    "lat": 21.0398588,
    "lng": 105.7829688,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "28",
    "label": "A6",
    "type": "",
    "lat": 21.0394999,
    "lng": 105.7816099,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "29",
    "label": "B2",
    "type": "",
    "lat": 21.0375382,
    "lng": 105.7824575,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "30",
    "label": "B3",
    "type": "",
    "lat": 21.038435,
    "lng": 105.7820729,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "31",
    "label": "C1",
    "type": "",
    "lat": 21.0393359,
    "lng": 105.7816548,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "32",
    "label": "C2",
    "type": "",
    "lat": 21.0386869,
    "lng": 105.7816535,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "33",
    "label": "C3",
    "type": "",
    "lat": 21.0390136,
    "lng": 105.7820035,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "34",
    "label": "C4",
    "type": "",
    "lat": 21.0386851,
    "lng": 105.782196,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "35",
    "label": "C5",
    "type": "",
    "lat": 21.0392781,
    "lng": 105.7821725,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "36",
    "label": "Nhà đa năng",
    "type": "",
    "lat": 21.0398848,
    "lng": 105.7815298,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "37",
    "label": "Nhà Sunwah",
    "type": "",
    "lat": 21.0372913,
    "lng": 105.7822617,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "38",
    "label": "Hội trường Vũ Đình Liên",
    "type": "",
    "lat": 21.039019,
    "lng": 105.7813393,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "39",
    "label": "Hội trường Nguyễn Văn Đạo",
    "type": "",
    "lat": 21.0374568,
    "lng": 105.7813789,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  },
  {
    "id": "40",
    "label": "KTX ULIS",
    "type": "",
    "lat": 21.040603,
    "lng": 105.7824166,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    "aliases": [],
    "descriptionVi": "Mô tả mới.",
    "descriptionEn": "New description.",
    "openingHour": "07:00",
    "closingHour": "18:00",
    "feedbacks": []
  }
];

export const mockEdges: Edge[] = [
  {
    "from": "gate-main",
    "to": "hub-central",
    "distance": 300,
    "note": "Truc duong chinh"
  },
  {
    "from": "gate-side",
    "to": "hub-central",
    "distance": 230,
    "note": "Loi di sinh vien"
  },
  {
    "from": "hub-central",
    "to": "ulis",
    "distance": 210,
    "note": "Duong noi bo 1"
  },
  {
    "from": "hub-central",
    "to": "uet",
    "distance": 230,
    "note": "Duong noi bo 2"
  },
  {
    "from": "hub-central",
    "to": "ueb",
    "distance": 200,
    "note": "Duong noi bo 3"
  },
  {
    "from": "uet",
    "to": "sis",
    "distance": 180,
    "note": "Loi di qua thu vien"
  },
  {
    "from": "uet",
    "to": "is",
    "distance": 170,
    "note": "Loi noi bo khu giang duong"
  },
  {
    "from": "ulis",
    "to": "ulis-a2-301",
    "distance": 70,
    "note": "Len toa A2"
  },
  {
    "from": "uet",
    "to": "uet-g2",
    "distance": 60,
    "note": "Sanh truoc G2"
  },
  {
    "from": "ueb",
    "to": "ueb-203",
    "distance": 45,
    "note": "Tang 2 khu UEB"
  },
  {
    "from": "gate-side",
    "to": "ulis",
    "distance": 160,
    "note": "Loi tat can bo (khong co tren Google Maps)"
  },
  {
    "from": "ueb",
    "to": "sis",
    "distance": 120,
    "note": "Loi noi bo ven ho"
  }
];

export const mockMembers: TeamMember[] = [
  {
    "name": "Hoàng Thùy Linh",
    "role": "Nhóm trưởng",
    "bio": "Khoa NN&VH Anh",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1FmVfwCWJYZqClaRIbYVgm_9SXNM7c7o6=w2000-h3040-iv2?auditContext=forDisplay"
  },
  {
    "name": "Kiều Gia Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Nhật",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1NHh6rVcPRLoymSAUvDCjIvs2rbGSxWZC=w2000-h3040-iv1?auditContext=forDisplay"
  },
  {
    "name": "Lê Đàm Ngọc Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Nhật",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1707_WnLIL9SjUCOpr-1Le9IaA6oPZxED=w1227-h868-iv1?auditContext=prefetch"
  },
  {
    "name": "Lê Khánh Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Trung",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1Mh5-Da3I2va1sar8WLpB76WvfWJfjrhP=w1227-h868-iv1?auditContext=prefetch"
  },
  {
    "name": "Lê Kiều Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Trung",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1I18DDoenxyxetbB-SIIxP87yMYKfhVZT=w1227-h868-iv1?auditContext=prefetch"
  },
  {
    "name": "Lê Mai Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Trung",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1vQoynEMU5aqo9y56Mv0BxSHXI-b3HNqU=w1227-h868-iv2?auditContext=prefetch"
  },
  {
    "name": "Lê Ngọc Linh",
    "role": "Thành viên",
    "bio": "Khoa NN&VH Pháp",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1bQ6YBaMcEiw4anTWomZb_aiZPRLF_d2N=w1227-h868-iv1?auditContext=prefetch"
  }
];

export const mockCommunityFeedbacks: CommunityFeedback[] = [
  {
    "id": "cf-001",
    "user": "Nguyễn Ngọc Anh - NN&VH Nhật",
    "comment": "Tính năng tìm đường dùng khá tiện, nhất là với những bạn hay bị lạc trong trường. Chỉ cần vài thao tác là biết đường đi rõ ràng, đỡ mất thời gian hỏi han. Ngoài ra web còn giới thiệu các địa điểm trong trường như Homies, sân bóng, giảng đường…, nên vừa dễ di chuyển vừa hiểu thêm về không gian học tập và sinh hoạt ở ULIS.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1hHVi1Sqb48S80pKlVhzZa-p4HaBs44NC=w1920-h868-iv2?auditContext=prefetch"
  },
  {
    "id": "cf-002",
    "user": "Diệu Linh - UMP",
    "comment": "Mình hay phải qua ULIS để thi nhưng vì không quen đường nên hay bị lạc, khá mất thời gian tìm phòng. Dùng web map này thấy tiện hơn hẳn vì có thể xem trước các toà nhà và đường đi, đỡ bị rối. Mình khá thích phần có quán ăn với chỗ check-in xung quanh, thi xong có thể tìm chỗ ăn luôn. Nhưng nếu web tối ưu tốt hơn trên điện thoại và tải nhanh hơn thì trải nghiệm sẽ mượt mà hơn.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1KHkBHD7_4kV7Nk_l2VhWcKl0HuOLehyM=w1227-h868-iv2?auditContext=prefetch"
  },
  {
    "id": "cf-003",
    "user": "Đỗ Ngọc Bảo An - NN&VH Anh",
    "comment": "Tính năng tìm quán ăn của web rất hữu ích, mỗi lúc đi học về không còn phải lăn tăn suy nghĩ xem hôm nay ăn gì ở đâu. Vừa đỡ mất thời gian vừa biết thêm được các món ăn mới xung quanh trường.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1Wpw-mTSVPHAIh0jDIKOTo3--hDgPh1Ju=w1227-h868-iv2?auditContext=prefetch"
  },
  {
    "id": "cf-004",
    "user": "Lê Linh Trâm - USSH",
    "comment": "Mình là sinh viên trường ngoài hay qua Ulis đón bạn đi chơi. Nhưng mà mỗi lần tìm điểm hẹn ở của bạn ấy là mỗi toà khác nhau khó tìm khó để biết ở đâu quá. May mà có web này để mình đỡ phải đi hỏi người đi đường xung quanh.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1whIvsfOz1In8aSxfZQPnhoEBiEF0xLeo=w1227-h868-iv2?auditContext=prefetch"
  },
  {
    "id": "cf-005",
    "user": "Ngô Vũ Minh Phương - NN&VH Pháp",
    "comment": "Tính năng chỉ đường khá ổn luôn, đặc biệt cứu cánh cho mấy bạn hay “mù đường” trong trường. Chỉ cần bấm vài cái là biết đi lối nào cho nhanh, khỏi phải đứng ngơ ngác hỏi người khác.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1NgqcMv6emnEBznAX-3GQxWA-zOamer1S=w1227-h868-iv4?auditContext=prefetch"
  },
  {
    "id": "cf-006",
    "user": "Nguyễn Vũ Hoàng Trang- NN&VH Trung Quốc",
    "comment": "Mình thấy web này khá tiện cho sinh viên ULIS vì có thể vừa xem chỉ đường vừa tìm đồ ăn luôn. Giao diện dễ dùng, thông tin rõ ràng nên những bạn mới vào trường hay bị lạc sẽ đỡ mất thời gian tìm phòng học và căng tin hơn nhiều.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1CGlOBGntUpRsqYw3Tv5mzXkV7L36bnzx=w1920-h868-iv1?auditContext=prefetch"
  },
  {
    "id": "cf-007",
    "user": "Vũ Minh Phương - NN&VH Anh",
    "comment": "Mình thấy tính năng giới thiệu các địa điểm check - in rất thú vị. Như vậy thì các bạn sinh viên, đặc biệt là sinh viên năm nhất và sinh viên quốc tế đều có thể hiểu hơn và làm quen tốt hơn với không gian của ULIS.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/15qVkbTw7I50EuOqhvieWhPA1QD1fypo1=w1227-h868-iv2?auditContext=prefetch"
  },
  {
    "id": "cf-008",
    "user": "Nguyễn Anh Thy - NN&VH Nhật",
    "comment": "Mình rất thích tính năng chỉ đường của web, nhiều khi gặp vấn đề ngôn ngữ không chỉ đường được mình có thể sử dụng web để giúp các bạn.",
    "createdAt": "",
    "avatar": "https://lh3.googleusercontent.com/u/0/d/1H17PSo4p3VGfR8cbBLcz8L7rYMFX2YhQ=w1920-h868-iv1?auditContext=forDisplay"
  }
];

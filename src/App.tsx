import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockCommunityFeedbacks, mockEdges, mockMembers, mockNodes, type CampusNode, type CommunityFeedback, type TeamMember } from './mockData';
import './App.css';
type RouteView = 'landing' | 'map' | 'about' | 'feedback' | 'admin' | 'importData' | 'detail';
type RouteState = { view: RouteView; detailId: string };
type Language = 'vi' | 'en' | 'zh' | 'ko' | 'ja';
type ThemeMode = 'light' | 'dark';

const TYPE_LABELS: Record<Language, Record<string, string>> = {
  vi: { campus: 'Trường', gate: 'Cổng', hall: 'Hội trường', room: 'Phòng học', hub: 'Nút giao' },
  en: { campus: 'Campus', gate: 'Gate', hall: 'Hall', room: 'Room', hub: 'Hub' },
  zh: { campus: '学校', gate: '校门', hall: '礼堂', room: '教室', hub: '节点' },
  ko: { campus: '캠퍼스', gate: '정문', hall: '강당', room: '강의실', hub: '허브' },
  ja: { campus: 'キャンパス', gate: '門', hall: 'ホール', room: '教室', hub: 'ハブ' }
};
const STORAGE_KEY = 'vnu-map-nodes-v3';
const NAV_ITEMS: Array<{ key: 'landing' | 'map' | 'about' | 'feedback'; path: string }> = [
  { key: 'landing', path: '/' },
  { key: 'map', path: '/thao-tac-ban-do' },
  { key: 'about', path: '/ve-chung-toi' },
  { key: 'feedback', path: '/phan-hoi' }
];
const BRAND_LOGO_URL =
  'https://lh3.googleusercontent.com/u/0/d/1C6K22ihxiBsgVCghJ7BHQbSWKX7VEvY_=w2560-h1398-iv1?auditContext=prefetch';
const MEMBER_AVATAR_FALLBACKS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
];
const INTRO_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/DSNvqbEhwHk?rel=0';
const FEEDBACK_STORAGE_KEY = 'vnu-map-community-feedback-v3';
const LANGUAGE_OPTIONS: Array<{ value: Language; label: string; icon: string }> = [
  { value: 'vi', label: 'Tiếng Việt', icon: 'https://flagcdn.com/w40/vn.png' },
  { value: 'en', label: 'English', icon: 'https://flagcdn.com/w40/gb.png' },
  { value: 'zh', label: '中文', icon: 'https://flagcdn.com/w40/cn.png' },
  { value: 'ko', label: '한국어', icon: 'https://flagcdn.com/w40/kr.png' },
  { value: 'ja', label: '日本語', icon: 'https://flagcdn.com/w40/jp.png' }
];
const TEXT = {
  vi: {
    brand: 'Lạc lối ở ULIS',
    nav: { landing: 'Trang chủ', map: 'Thao tác bản đồ', about: 'Về chúng tôi', feedback: 'Phản hồi' },
    heroKicker: 'Bản đồ thông minh - cập nhật mỗi tuần',
    heroTitle: 'Tìm đường trong ULIS nhanh và rõ ràng',
    heroDesc:
      'Kết nối bạn với phòng học, hội trường và các điểm trọng yếu trong khuôn viên. Trải nghiệm tìm kiếm dễ hiểu, thông tin rõ ràng và điều hướng nhanh.',
    ctaMap: 'Mở thao tác bản đồ',
    ctaAbout: 'Tìm hiểu dự án',
    f1t: 'Uy tín',
    f1d: 'Dữ liệu điểm đến được quản trị tập trung và dễ cập nhật.',
    f2t: 'An tâm',
    f2d: 'Thông tin rõ ràng, dễ kiểm tra trước khi di chuyển đến tòa nhà.',
    f3t: 'Đồng hành',
    f3d: 'Popup thông tin và liên kết Google Maps trong một lần chạm.',
    introVideo: 'Video giới thiệu',
    catalogTitle: 'Danh mục địa điểm nổi bật',
    catalogDesc: 'Chọn thẻ để mở trang thông tin chi tiết cho từng địa điểm trong hệ thống.',
    landingSearchPlaceholder: 'Tìm địa điểm trên trang chủ...',
    filterType: 'Lọc loại địa điểm',
    allTypes: 'Tất cả loại',
    backHome: '← Quay lại trang chủ',
    typePrefix: 'Loại',
    detailTitle: 'Thông tin địa danh',
    detailDescription: 'Mô tả chi tiết',
    openClose: 'Giờ hoạt động',
    openAt: 'Mở cửa',
    closeAt: 'Đóng cửa',
    rating: 'Đánh giá',
    highlights: 'Thông tin nhanh',
    convenient: 'Mức độ thuận tiện',
    internalRoute: 'Lộ trình nội bộ',
    mapPositionTitle: 'Vị trí trên bản đồ',
    mapPositionDesc: 'Ghim bản đồ',
    openAddressMaps: 'Mở địa chỉ trong Google Maps',
    feedback: 'Phản hồi cộng đồng',
    coordsPrefix: 'Tọa độ',
    openLocation: 'Mở vị trí trên Google Maps',
    searchTitle: 'Tìm kiếm và điều hướng',
    searchLabel: 'Tìm phòng / hội trường',
    searchPlaceholder: 'VD: A2-301, hội trường G2, phòng 203...',
    foundPrefix: 'Đã tìm thấy',
    fromLabel: 'Vị trí hiện tại',
    toLabel: 'Điểm đến',
    routeDetail: 'Chi tiết lộ trình',
    toPrefix: 'Đến',
    chooseDestination: 'Chọn điểm đến để bắt đầu chỉ đường.',
    suggestionTitle: 'Gợi ý theo từ khóa',
    noRoute: 'Không tìm thấy đường đi phù hợp.',
    mapPanelIntro:
      'Bấm GPS để cập nhật vị trí hiện tại (tọa độ + điểm xuất phát trên đồ thị). Sau đó chọn đích bằng ô tìm kiếm (gợi ý / Enter), danh sách hoặc bấm điểm trên bản đồ. Đường đi ngắn nhất được vẽ và liệt kê các chặng.',
    mapClearDestination: 'Xóa điểm đến',
    mapSwapEnds: 'Đổi chiều đi–đến',
    mapSameStartEnd: 'Điểm xuất phát và đích trùng nhau — hãy đổi một trong hai.',
    mapRouteLegend: 'Đường gợi ý (ngắn nhất)',
    mapSearchHint: 'Enter để chọn gợi ý đầu tiên',
    mapPickAsDestination: 'Chọn làm điểm đến',
    mapMyLocation: 'Vị trí của tôi (GPS)',
    mapGeoLoading: 'Đang xin quyền và lấy vị trí...',
    mapGeoDenied: 'Trình duyệt từ chối quyền vị trí. Hãy cho phép trong biểu tượng khóa / cài đặt trang.',
    mapGeoUnavailable: 'Không đọc được GPS (thiết bị hoặc trình duyệt không hỗ trợ).',
    mapGeoTimeout: 'GPS quá lâu không phản hồi. Thử ngoài trời hoặc bật định vị.',
    mapGeoInsecure: 'Định vị chỉ hoạt động trên HTTPS hoặc localhost.',
    mapGeoSuccess: 'Đã căn bản đồ theo vị trí của bạn.',
    mapYouAreHere: 'Bạn đang ở đây (GPS)',
    mapInternalRouteFrom: 'Đường nội bộ xuất phát từ:',
    mapLocationNoGpsHint: 'Bấm nút GPS phía trên để hiển thị tọa độ thật của bạn.',
    mapArOpen: 'Chỉ đường qua camera',
    mapArClose: 'Đóng camera',
    mapArHint:
      'Mở camera sau và la bàn: mũi tên chỉ hướng tới đích (độ chính xác tùy máy; trong nhà thường kém).',
    mapArCameraDenied: 'Không mở được camera — kiểm tra quyền trình duyệt.',
    mapArOrientDenied: 'Cần cho phép cảm biến hướng / la bàn để mũi tên chỉ đúng.',
    mapArNoHeading: 'Đang chờ la bàn… giữ điện thoại ngang và xoay nhẹ.',
    mapArDistance: 'Ước lượng còn lại',
    mapArDisclaimer:
      'Chế độ web đơn giản, không phải AR thực như Google Maps Live View. Tránh dựa hoàn toàn vào mũi tên khi an toàn giao thông.',
    mapTitle: 'Bản đồ khuôn viên',
    mapSub: 'Nền vệ tinh + popup thông tin.',
    mapLayerLabel: 'Kiểu bản đồ',
    mapLayerDefault: 'Mặc định',
    mapLayerSatellite: 'Vệ tinh',
    openMaps: 'Mở trên Google Maps',
    aboutTitle: 'Về chúng tôi',
    aboutDesc: 'Nhóm dự án Lạc lối ở ULIS phát triển nền tảng bản đồ nội bộ cho sinh viên và giảng viên.',
    feedbackFormTitle: 'Gửi phản hồi cho chúng tôi',
    fullName: 'Họ và tên',
    phoneNumber: 'Số điện thoại',
    emailAddress: 'Email',
    feedbackContent: 'Phản hồi',
    sendFeedback: 'Gửi phản hồi',
    sendingFeedback: 'Đang gửi...',
    feedbackSuccess: 'Đã gửi phản hồi thành công.',
    feedbackError: 'Gửi phản hồi thất bại. Vui lòng thử lại.',
    adminHint: 'Path ẩn: `/adminDashboard`. Sau khi sửa, bấm "Xuất mockData JSON" để lưu file dữ liệu.',
    adminMembers: 'Dữ liệu về chúng tôi',
    adminLocationData: 'Dữ liệu địa danh',
    adminCommunityFeedbackData: 'Dữ liệu feedback người dùng',
    adminDetailManager: 'Quản lý chi tiết địa điểm',
    selectLocationDetail: 'Chọn địa điểm',
    feedbackManager: 'Quản lý phản hồi',
    addFeedback: '+ Thêm phản hồi',
    adminTitle: 'Admin Dashboard',
    addLocation: '+ Thêm địa danh',
    addMember: '+ Thêm thành viên',
    actions: 'Thao tác',
    edit: 'Sửa',
    update: 'Cập nhật',
    cancel: 'Hủy',
    locationEditor: 'Bảng chỉnh sửa địa danh',
    memberEditor: 'Bảng chỉnh sửa thành viên',
    delete: 'Xóa',
    image: 'Ảnh',
    latitude: 'Vĩ độ',
    longitude: 'Kinh độ',
    filterData: 'Lọc dữ liệu',
    all: 'Tất cả',
    locationDataFilter: 'Dữ liệu địa danh',
    membersDataFilter: 'Dữ liệu về chúng tôi',
    feedbacksDataFilter: 'Dữ liệu feedback',
    importDataTitle: 'Nhập dữ liệu JSON',
    importDataDesc: 'Path ẩn: `/importMockData`. Chọn file JSON đã xuất để nạp dữ liệu vào web.',
    importDataChooseFile: 'Chọn file JSON',
    importDataSuccess: 'Đã nhập dữ liệu thành công.',
    footerSchool: 'Đại học Quốc gia Hà Nội - Trường Đại học Ngoại ngữ',
    footerAddress: 'Địa chỉ',
    footerAddressValue: 'Số 2 đường Phạm Văn Đồng, Phường Cầu Giấy, Hà Nội',
    footerPhone: 'Tel',
    footerFax: 'Fax',
    footerEmail: 'Email',
    footerCopy: '© Trường Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội.',
    importError: 'File mockData không hợp lệ.',
    reset: 'Khôi phục mặc định',
    export: 'Xuất mockData JSON',
    import: 'Nhập mockData JSON',
    lang: 'EN',
    theme: 'Tối'
  },
  en: {
    brand: 'Lost at ULIS',
    nav: { landing: 'Home', map: 'Map Actions', about: 'About Us', feedback: 'Feedback' },
    heroKicker: 'Smart map - updated weekly',
    heroTitle: 'Find your way around ULIS quickly',
    heroDesc:
      'Connect to classrooms, halls, and key spots across campus with clear information and fast routing.',
    ctaMap: 'Open map actions',
    ctaAbout: 'Explore project',
    f1t: 'Reliable',
    f1d: 'Destination data is centrally managed and easy to update.',
    f2t: 'Trusted',
    f2d: 'Clear location information before moving to any building.',
    f3t: 'Companion',
    f3d: 'One-tap detail popup and Google Maps integration.',
    introVideo: 'Introduction video',
    catalogTitle: 'Featured locations',
    catalogDesc: 'Select a card to open detailed information for each location.',
    landingSearchPlaceholder: 'Search locations on home page...',
    filterType: 'Filter by location type',
    allTypes: 'All types',
    backHome: '← Back to home',
    typePrefix: 'Type',
    detailTitle: 'Location details',
    detailDescription: 'Detailed description',
    openClose: 'Operating hours',
    openAt: 'Open',
    closeAt: 'Close',
    rating: 'Rating',
    highlights: 'Quick facts',
    convenient: 'Convenience',
    internalRoute: 'Internal route',
    mapPositionTitle: 'Map location',
    mapPositionDesc: 'Pinned map',
    openAddressMaps: 'Open address in Google Maps',
    feedback: 'Community feedback',
    coordsPrefix: 'Coordinates',
    openLocation: 'Open location on Google Maps',
    searchTitle: 'Search and navigation',
    searchLabel: 'Search room / hall',
    searchPlaceholder: 'Ex: A2-301, Hall G2, Room 203...',
    foundPrefix: 'Found',
    fromLabel: 'Current location',
    toLabel: 'Destination',
    routeDetail: 'Route details',
    toPrefix: 'To',
    chooseDestination: 'Pick a destination to start routing.',
    suggestionTitle: 'Suggestions',
    noRoute: 'No suitable route found.',
    mapPanelIntro:
      'Use GPS to update your position (coordinates + graph start). Then pick a destination via search (suggestions / Enter), the destination list, or the map. The shortest path is drawn with step notes.',
    mapClearDestination: 'Clear destination',
    mapSwapEnds: 'Swap start / destination',
    mapSameStartEnd: 'Start and destination are the same — change one of them.',
    mapRouteLegend: 'Suggested shortest route',
    mapSearchHint: 'Press Enter to pick the first suggestion',
    mapPickAsDestination: 'Set as destination',
    mapMyLocation: 'My location (GPS)',
    mapGeoLoading: 'Requesting permission and reading location...',
    mapGeoDenied: 'Location permission denied. Allow it in the site lock/settings.',
    mapGeoUnavailable: 'Could not read GPS (unsupported device or browser).',
    mapGeoTimeout: 'GPS timed out. Try again outdoors or enable location services.',
    mapGeoInsecure: 'Geolocation requires HTTPS or localhost.',
    mapGeoSuccess: 'Map centered on your location.',
    mapYouAreHere: 'You are here (GPS)',
    mapInternalRouteFrom: 'Indoor route starts from:',
    mapLocationNoGpsHint: 'Use the GPS button above to show your real coordinates.',
    mapArOpen: 'Camera directions',
    mapArClose: 'Close',
    mapArHint: 'Uses rear camera + compass; arrow points toward the destination (often weak indoors).',
    mapArCameraDenied: 'Camera permission denied.',
    mapArOrientDenied: 'Motion/orientation permission is required for the arrow.',
    mapArNoHeading: 'Waiting for compass… hold the phone flat.',
    mapArDistance: 'Approx. distance',
    mapArDisclaimer:
      'Simple web mode, not full AR like Live View. Do not rely on it alone for safety-critical navigation.',
    mapTitle: 'Campus map',
    mapSub: 'Satellite view + location popup.',
    mapLayerLabel: 'Map style',
    mapLayerDefault: 'Default',
    mapLayerSatellite: 'Satellite',
    openMaps: 'Open in Google Maps',
    aboutTitle: 'About us',
    aboutDesc: 'Lost at ULIS team builds an internal smart mapping platform for students and staff.',
    feedbackFormTitle: 'Send us your feedback',
    fullName: 'Full name',
    phoneNumber: 'Phone number',
    emailAddress: 'Email',
    feedbackContent: 'Feedback',
    sendFeedback: 'Send feedback',
    sendingFeedback: 'Sending...',
    feedbackSuccess: 'Feedback sent successfully.',
    feedbackError: 'Failed to send feedback. Please try again.',
    adminHint: 'Hidden path: `/adminDashboard`. Export JSON after editing to save your mock data.',
    adminMembers: 'About us data',
    adminLocationData: 'Location data',
    adminCommunityFeedbackData: 'User feedback data',
    adminDetailManager: 'Location detail manager',
    selectLocationDetail: 'Select location',
    feedbackManager: 'Feedback manager',
    addFeedback: '+ Add feedback',
    adminTitle: 'Admin Dashboard',
    addLocation: '+ Add location',
    addMember: '+ Add member',
    actions: 'Actions',
    edit: 'Edit',
    update: 'Update',
    cancel: 'Cancel',
    locationEditor: 'Location editor',
    memberEditor: 'Member editor',
    delete: 'Delete',
    image: 'Image',
    latitude: 'Latitude',
    longitude: 'Longitude',
    filterData: 'Filter data',
    all: 'All',
    locationDataFilter: 'Location data',
    membersDataFilter: 'About us data',
    feedbacksDataFilter: 'Feedback data',
    importDataTitle: 'Import JSON data',
    importDataDesc: 'Hidden path: `/importMockData`. Choose exported JSON file to load data into the app.',
    importDataChooseFile: 'Choose JSON file',
    importDataSuccess: 'Data imported successfully.',
    footerSchool: 'VNU University of Languages and International Studies',
    footerAddress: 'Address',
    footerAddressValue: 'No. 2 Pham Van Dong Street, Cau Giay Ward, Ha Noi',
    footerPhone: 'Tel',
    footerFax: 'Fax',
    footerEmail: 'Email',
    footerCopy: '© University of Languages and International Studies - VNU.',
    importError: 'Invalid mockData file.',
    reset: 'Reset default',
    export: 'Export mockData JSON',
    import: 'Import mockData JSON',
    lang: 'VI',
    theme: 'Dark'
  },
  zh: {
    brand: '迷路在 ULIS',
    nav: { landing: '首页', map: '地图操作', about: '关于我们', feedback: '反馈' },
    heroKicker: '智能地图 - 每周更新',
    heroTitle: '快速清晰地找到 ULIS 路线',
    heroDesc:
      '连接你与教室、礼堂和校园关键地点，提供清晰信息与快速导航。',
    ctaMap: '打开地图操作',
    ctaAbout: '了解项目',
    f1t: '可靠',
    f1d: '地点数据集中管理，更新方便。',
    f2t: '安心',
    f2d: '出发前先查看清晰地点信息。',
    f3t: '陪伴',
    f3d: '一次点击即可查看详情并打开 Google Maps。',
    introVideo: '介绍视频',
    catalogTitle: '热门地点目录',
    catalogDesc: '选择卡片查看每个地点的详细信息。',
    landingSearchPlaceholder: '在首页搜索地点...',
    filterType: '按地点类型筛选',
    allTypes: '全部类型',
    backHome: '← 返回首页',
    typePrefix: '类型',
    detailTitle: '地点信息',
    detailDescription: '详细描述',
    openClose: '开放时间',
    openAt: '开放',
    closeAt: '关闭',
    rating: '评分',
    highlights: '快速信息',
    convenient: '便利程度',
    internalRoute: '校内路线',
    mapPositionTitle: '地图位置',
    mapPositionDesc: '地图标记',
    openAddressMaps: '在 Google Maps 打开地址',
    feedback: '社区反馈',
    coordsPrefix: '坐标',
    openLocation: '在 Google Maps 打开位置',
    searchTitle: '搜索与导航',
    searchLabel: '搜索教室 / 礼堂',
    searchPlaceholder: '例如: A2-301, G2 礼堂, 203 教室...',
    foundPrefix: '已找到',
    fromLabel: '当前位置',
    toLabel: '目的地',
    routeDetail: '路线详情',
    toPrefix: '前往',
    chooseDestination: '请选择目的地开始导航。',
    suggestionTitle: '关键词建议',
    noRoute: '未找到合适路线。',
    mapPanelIntro:
      '使用 GPS 更新当前位置（坐标与图上出发点），再通过搜索、目的地列表或地图选终点，系统绘制最短路线并列出步骤。',
    mapClearDestination: '清除目的地',
    mapSwapEnds: '交换起点 / 终点',
    mapSameStartEnd: '起点与终点相同，请修改其中一个。',
    mapRouteLegend: '推荐最短路线',
    mapSearchHint: '按 Enter 选择第一条建议',
    mapPickAsDestination: '设为目的地',
    mapMyLocation: '我的位置 (GPS)',
    mapGeoLoading: '正在请求权限并获取位置...',
    mapGeoDenied: '已拒绝位置权限。请在站点设置中允许。',
    mapGeoUnavailable: '无法获取 GPS（设备或浏览器不支持）。',
    mapGeoTimeout: 'GPS 超时。请到室外或开启定位后再试。',
    mapGeoInsecure: '定位需要 HTTPS 或 localhost。',
    mapGeoSuccess: '地图已定位到您的位置。',
    mapYouAreHere: '当前位置 (GPS)',
    mapInternalRouteFrom: '室内路线出发点：',
    mapLocationNoGpsHint: '点击上方 GPS 按钮显示您的真实坐标。',
    mapArOpen: '摄像头指路',
    mapArClose: '关闭',
    mapArHint: '使用后置摄像头与指南针；箭头指向目的地（室内可能不准）。',
    mapArCameraDenied: '无法打开摄像头。',
    mapArOrientDenied: '需要授权设备方向传感器。',
    mapArNoHeading: '等待指南针… 请将手机放平。',
    mapArDistance: '大致剩余距离',
    mapArDisclaimer: '网页简化模式，非完整 AR。请勿完全依赖箭头判断路况。',
    mapTitle: '校园地图',
    mapSub: '标准底图 + 地点弹窗。',
    mapLayerLabel: '地图样式',
    mapLayerDefault: '默认',
    mapLayerSatellite: '卫星',
    openMaps: '在 Google Maps 打开',
    aboutTitle: '关于我们',
    aboutDesc: 'Lost at ULIS 团队为师生打造校内智能地图平台。',
    feedbackFormTitle: '向我们发送反馈',
    fullName: '姓名',
    phoneNumber: '电话号码',
    emailAddress: '邮箱',
    feedbackContent: '反馈内容',
    sendFeedback: '发送反馈',
    sendingFeedback: '发送中...',
    feedbackSuccess: '反馈已成功发送。',
    feedbackError: '发送失败，请重试。',
    adminHint: '隐藏路径: `/adminDashboard`。编辑后导出 JSON 保存数据。',
    adminMembers: '关于我们数据',
    adminLocationData: '地点数据',
    adminCommunityFeedbackData: '用户反馈数据',
    adminDetailManager: '地点详情管理',
    selectLocationDetail: '选择地点',
    feedbackManager: '反馈管理',
    addFeedback: '+ 添加反馈',
    adminTitle: '管理面板',
    addLocation: '+ 新增地点',
    addMember: '+ 新增成员',
    actions: '操作',
    edit: '编辑',
    update: '更新',
    cancel: '取消',
    locationEditor: '地点编辑',
    memberEditor: '成员编辑',
    delete: '删除',
    image: '图片',
    latitude: '纬度',
    longitude: '经度',
    filterData: '数据筛选',
    all: '全部',
    locationDataFilter: '地点数据',
    membersDataFilter: '关于我们数据',
    feedbacksDataFilter: '反馈数据',
    importDataTitle: '导入 JSON 数据',
    importDataDesc: '隐藏路径: `/importMockData`。选择已导出的 JSON 文件导入数据。',
    importDataChooseFile: '选择 JSON 文件',
    importDataSuccess: '数据导入成功。',
    footerSchool: '河内国家大学 - 外国语大学',
    footerAddress: '地址',
    footerAddressValue: '河内市纸桥郡范文同路 2 号',
    footerPhone: '电话',
    footerFax: '传真',
    footerEmail: '邮箱',
    footerCopy: '© 外国语大学 - 河内国家大学。',
    importError: 'mockData 文件无效。',
    reset: '恢复默认',
    export: '导出 mockData JSON',
    import: '导入 mockData JSON',
    lang: 'ZH',
    theme: '深色'
  },
  ko: {
    brand: 'ULIS 길찾기',
    nav: { landing: '홈', map: '지도 조작', about: '소개', feedback: '피드백' },
    heroKicker: '스마트 지도 - 주간 업데이트',
    heroTitle: 'ULIS 길찾기를 빠르고 명확하게',
    heroDesc:
      '강의실, 강당, 주요 지점을 빠르게 연결하고 명확한 정보로 안내합니다.',
    ctaMap: '지도 조작 열기',
    ctaAbout: '프로젝트 보기',
    f1t: '신뢰',
    f1d: '목적지 데이터는 중앙에서 쉽게 관리됩니다.',
    f2t: '안심',
    f2d: '이동 전에 위치 정보를 명확히 확인할 수 있습니다.',
    f3t: '동행',
    f3d: '한 번의 클릭으로 상세 정보와 Google Maps 연결.',
    introVideo: '소개 영상',
    catalogTitle: '주요 위치 목록',
    catalogDesc: '카드를 선택해 각 위치의 상세 정보를 확인하세요.',
    landingSearchPlaceholder: '홈에서 위치 검색...',
    filterType: '유형 필터',
    allTypes: '전체 유형',
    backHome: '← 홈으로',
    typePrefix: '유형',
    detailTitle: '위치 정보',
    detailDescription: '상세 설명',
    openClose: '운영 시간',
    openAt: '열림',
    closeAt: '닫힘',
    rating: '평점',
    highlights: '빠른 정보',
    convenient: '편의성',
    internalRoute: '내부 경로',
    mapPositionTitle: '지도 위치',
    mapPositionDesc: '지도 핀',
    openAddressMaps: 'Google Maps에서 주소 열기',
    feedback: '커뮤니티 후기',
    coordsPrefix: '좌표',
    openLocation: 'Google Maps에서 위치 열기',
    searchTitle: '검색 및 길찾기',
    searchLabel: '강의실 / 강당 검색',
    searchPlaceholder: '예: A2-301, G2 강당, 203호...',
    foundPrefix: '검색 결과',
    fromLabel: '현재 위치',
    toLabel: '목적지',
    routeDetail: '경로 상세',
    toPrefix: '도착',
    chooseDestination: '길찾기를 시작하려면 목적지를 선택하세요.',
    suggestionTitle: '추천 검색어',
    noRoute: '적절한 경로를 찾을 수 없습니다.',
    mapPanelIntro:
      'GPS로 현재 위치를 갱신한 뒤(좌표·그래프 출발점), 검색·목록·지도로 목적지를 고르면 최단 경로가 표시됩니다.',
    mapClearDestination: '목적지 지우기',
    mapSwapEnds: '출발·도착 바꾸기',
    mapSameStartEnd: '출발과 도착이 같습니다. 하나를 바꿔 주세요.',
    mapRouteLegend: '추천 최단 경로',
    mapSearchHint: 'Enter로 첫 추천 선택',
    mapPickAsDestination: '목적지로 선택',
    mapMyLocation: '내 위치 (GPS)',
    mapGeoLoading: '권한 요청 및 위치 읽는 중...',
    mapGeoDenied: '위치 권한이 거부되었습니다. 사이트 설정에서 허용하세요.',
    mapGeoUnavailable: 'GPS를 읽을 수 없습니다.',
    mapGeoTimeout: 'GPS 시간 초과. 실외에서 다시 시도하세요.',
    mapGeoInsecure: 'HTTPS 또는 localhost에서만 동작합니다.',
    mapGeoSuccess: '지도가 내 위치로 이동했습니다.',
    mapYouAreHere: '현재 위치 (GPS)',
    mapInternalRouteFrom: '실내 경로 출발:',
    mapLocationNoGpsHint: '위의 GPS 버튼으로 실제 좌표를 표시하세요.',
    mapArOpen: '카메라 길안내',
    mapArClose: '닫기',
    mapArHint: '후면 카메라와 나침반 사용. 실내에서는 부정확할 수 있습니다.',
    mapArCameraDenied: '카메라를 열 수 없습니다.',
    mapArOrientDenied: '방향 센서 권한이 필요합니다.',
    mapArNoHeading: '나침반 대기 중…',
    mapArDistance: '예상 거리',
    mapArDisclaimer: '웹 간이 모드입니다. 안전 판단에만 의존하지 마세요.',
    mapTitle: '캠퍼스 지도',
    mapSub: '기본 지도 + 위치 팝업.',
    mapLayerLabel: '지도 스타일',
    mapLayerDefault: '기본',
    mapLayerSatellite: '위성',
    openMaps: 'Google Maps에서 열기',
    aboutTitle: '소개',
    aboutDesc: 'Lost at ULIS 팀은 교내 스마트 지도 플랫폼을 개발합니다.',
    feedbackFormTitle: '피드백 보내기',
    fullName: '성함',
    phoneNumber: '전화번호',
    emailAddress: '이메일',
    feedbackContent: '피드백',
    sendFeedback: '보내기',
    sendingFeedback: '전송 중...',
    feedbackSuccess: '피드백이 성공적으로 전송되었습니다.',
    feedbackError: '전송에 실패했습니다. 다시 시도해주세요.',
    adminHint: '숨겨진 경로: `/adminDashboard`. 수정 후 JSON으로 저장하세요.',
    adminMembers: '소개 데이터',
    adminLocationData: '위치 데이터',
    adminCommunityFeedbackData: '사용자 피드백 데이터',
    adminDetailManager: '위치 상세 관리',
    selectLocationDetail: '위치 선택',
    feedbackManager: '피드백 관리',
    addFeedback: '+ 피드백 추가',
    adminTitle: '관리 대시보드',
    addLocation: '+ 위치 추가',
    addMember: '+ 팀원 추가',
    actions: '작업',
    edit: '수정',
    update: '업데이트',
    cancel: '취소',
    locationEditor: '위치 편집기',
    memberEditor: '팀원 편집기',
    delete: '삭제',
    image: '이미지',
    latitude: '위도',
    longitude: '경도',
    filterData: '데이터 필터',
    all: '전체',
    locationDataFilter: '위치 데이터',
    membersDataFilter: '소개 데이터',
    feedbacksDataFilter: '피드백 데이터',
    importDataTitle: 'JSON 데이터 가져오기',
    importDataDesc: '숨겨진 경로: `/importMockData`. 내보낸 JSON 파일을 선택해 데이터를 가져오세요.',
    importDataChooseFile: 'JSON 파일 선택',
    importDataSuccess: '데이터를 성공적으로 가져왔습니다.',
    footerSchool: '하노이국립대학교 - 외국어대학교',
    footerAddress: '주소',
    footerAddressValue: '하노이 Cau Giay, Pham Van Dong 2번지',
    footerPhone: '전화',
    footerFax: '팩스',
    footerEmail: '이메일',
    footerCopy: '© 외국어대학교 - 하노이국립대학교.',
    importError: '유효하지 않은 mockData 파일입니다.',
    reset: '기본값 복원',
    export: 'mockData JSON 내보내기',
    import: 'mockData JSON 가져오기',
    lang: 'KO',
    theme: '다크'
  },
  ja: {
    brand: 'ULIS 迷子ナビ',
    nav: { landing: 'ホーム', map: '地図操作', about: '私たちについて', feedback: 'フィードバック' },
    heroKicker: 'スマートマップ - 毎週更新',
    heroTitle: 'ULIS での道案内を素早く明確に',
    heroDesc:
      '教室・ホール・重要地点をつなぎ、分かりやすい情報で素早く案内します。',
    ctaMap: '地図操作を開く',
    ctaAbout: 'プロジェクトを見る',
    f1t: '信頼性',
    f1d: '目的地データを一元管理し、更新しやすい。',
    f2t: '安心',
    f2d: '移動前に位置情報を明確に確認できます。',
    f3t: '伴走',
    f3d: 'ワンタップで詳細表示と Google Maps 連携。',
    introVideo: '紹介動画',
    catalogTitle: '注目スポット',
    catalogDesc: 'カードを選択して各地点の詳細を表示します。',
    landingSearchPlaceholder: 'ホームで地点検索...',
    filterType: '種類でフィルター',
    allTypes: 'すべての種類',
    backHome: '← ホームへ戻る',
    typePrefix: '種類',
    detailTitle: '地点情報',
    detailDescription: '詳細説明',
    openClose: '営業時間',
    openAt: '開始',
    closeAt: '終了',
    rating: '評価',
    highlights: 'クイック情報',
    convenient: '利便性',
    internalRoute: '学内ルート',
    mapPositionTitle: '地図上の位置',
    mapPositionDesc: 'ピン留め',
    openAddressMaps: 'Google Maps で住所を開く',
    feedback: 'コミュニティの声',
    coordsPrefix: '座標',
    openLocation: 'Google Maps で位置を開く',
    searchTitle: '検索とナビ',
    searchLabel: '教室 / ホールを検索',
    searchPlaceholder: '例: A2-301, G2 ホール, 203 教室...',
    foundPrefix: '見つかりました',
    fromLabel: '現在地',
    toLabel: '目的地',
    routeDetail: 'ルート詳細',
    toPrefix: '到着先',
    chooseDestination: '案内を始めるには目的地を選択してください。',
    suggestionTitle: '候補',
    noRoute: '適切なルートが見つかりません。',
    mapPanelIntro:
      'GPS で現在地を更新し（座標・グラフ上の出発点）、検索・一覧・地図で目的地を選ぶと最短経路が表示されます。',
    mapClearDestination: '目的地をクリア',
    mapSwapEnds: '出発/目的地を入れ替え',
    mapSameStartEnd: '出発と目的地が同じです。どちらかを変更してください。',
    mapRouteLegend: '推奨最短経路',
    mapSearchHint: 'Enter で先頭の候補を選択',
    mapPickAsDestination: '目的地に設定',
    mapMyLocation: '現在地 (GPS)',
    mapGeoLoading: '許可を求め位置情報を取得しています...',
    mapGeoDenied: '位置情報が拒否されました。サイト設定で許可してください。',
    mapGeoUnavailable: 'GPS を取得できません。',
    mapGeoTimeout: 'GPS がタイムアウトしました。屋外で再試行してください。',
    mapGeoInsecure: 'HTTPS または localhost が必要です。',
    mapGeoSuccess: 'マップを現在地に合わせました。',
    mapYouAreHere: '現在地 (GPS)',
    mapInternalRouteFrom: '屋内経路の出発点：',
    mapLocationNoGpsHint: '上の GPS ボタンで実座標を表示できます。',
    mapArOpen: 'カメラで案内',
    mapArClose: '閉じる',
    mapArHint: '背面カメラとコンパスを使用。屋内では誤差が大きいことがあります。',
    mapArCameraDenied: 'カメラを開けませんでした。',
    mapArOrientDenied: 'デバイスの向きの許可が必要です。',
    mapArNoHeading: 'コンパス待ち…',
    mapArDistance: 'およその残り距離',
    mapArDisclaimer: '簡易ウェブ表示であり完全な AR ではありません。',
    mapTitle: 'キャンパスマップ',
    mapSub: '標準地図 + ポップアップ情報。',
    mapLayerLabel: '地図スタイル',
    mapLayerDefault: '標準',
    mapLayerSatellite: '衛星',
    openMaps: 'Google Maps で開く',
    aboutTitle: '私たちについて',
    aboutDesc: 'Lost at ULIS チームは学内スマートマップを開発しています。',
    feedbackFormTitle: 'フィードバックを送信',
    fullName: 'お名前',
    phoneNumber: '電話番号',
    emailAddress: 'メール',
    feedbackContent: 'ご意見',
    sendFeedback: '送信',
    sendingFeedback: '送信中...',
    feedbackSuccess: '送信に成功しました。',
    feedbackError: '送信に失敗しました。もう一度お試しください。',
    adminHint: '隠しパス: `/adminDashboard`。編集後に JSON をエクスポートしてください。',
    adminMembers: 'メンバーデータ',
    adminLocationData: '地点データ',
    adminCommunityFeedbackData: 'ユーザーフィードバックデータ',
    adminDetailManager: '地点詳細管理',
    selectLocationDetail: '地点を選択',
    feedbackManager: 'フィードバック管理',
    addFeedback: '+ フィードバック追加',
    adminTitle: '管理ダッシュボード',
    addLocation: '+ 地点を追加',
    addMember: '+ メンバー追加',
    actions: '操作',
    edit: '編集',
    update: '更新',
    cancel: 'キャンセル',
    locationEditor: '地点エディタ',
    memberEditor: 'メンバーエディタ',
    delete: '削除',
    image: '画像',
    latitude: '緯度',
    longitude: '経度',
    filterData: 'データフィルター',
    all: 'すべて',
    locationDataFilter: '地点データ',
    membersDataFilter: 'メンバーデータ',
    feedbacksDataFilter: 'フィードバックデータ',
    importDataTitle: 'JSON データをインポート',
    importDataDesc: '隠しパス: `/importMockData`。エクスポート済み JSON を選択してデータを読み込みます。',
    importDataChooseFile: 'JSON ファイルを選択',
    importDataSuccess: 'データを正常に取り込みました。',
    footerSchool: 'ハノイ国家大学 - 外国語大学',
    footerAddress: '住所',
    footerAddressValue: 'ハノイ市カウザイ区ファムヴァンドン通り2番',
    footerPhone: '電話',
    footerFax: 'Fax',
    footerEmail: 'メール',
    footerCopy: '© 外国語大学 - ハノイ国家大学。',
    importError: 'mockData ファイルが無効です。',
    reset: '初期化',
    export: 'mockData JSON を出力',
    import: 'mockData JSON を読込',
    lang: 'JA',
    theme: 'ダーク'
  }
} as const;

function MapRouteBounds({ latLngs, boundsKey }: { latLngs: [number, number][]; boundsKey: string }) {
  const map = useMap();
  useEffect(() => {
    if (!boundsKey || latLngs.length < 2) return;
    map.fitBounds(L.latLngBounds(latLngs), { padding: [48, 48], maxZoom: 17, animate: true });
  }, [map, boundsKey, latLngs]);
  return null;
}

function MapPanToUserLocation({
  lat,
  lng,
  panNonce,
  zoom
}: {
  lat: number | null;
  lng: number | null;
  panNonce: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (!panNonce || lat === null || lng === null) return;
    map.setView([lat, lng], zoom, { animate: true });
  }, [map, lat, lng, panNonce, zoom]);
  return null;
}

function normalize(input: string) {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/** Approximate distance in meters (fine for campus-scale snapping). */
function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Bearing from (lat1,lng1) to (lat2,lng2), degrees clockwise from north, in [0,360). */
function bearingDegrees(lat1: number, lng1: number, lat2: number, lng2: number) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

function headingFromDeviceOrientation(event: DeviceOrientationEvent): number | null {
  const e = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
  if (typeof e.webkitCompassHeading === 'number' && !Number.isNaN(e.webkitCompassHeading)) {
    return e.webkitCompassHeading;
  }
  if (event.absolute && event.alpha != null && !Number.isNaN(event.alpha)) {
    return (360 - event.alpha + 360) % 360;
  }
  return null;
}

function getTypeLabel(type: string, language: Language) {
  return TYPE_LABELS[language][type] ?? type;
}
function getMarkerRadius(type: string) {
  if (type === 'campus') return 9;
  if (type === 'gate') return 8;
  return 7;
}
function getMarkerColor(type: string) {
  if (type === 'campus') return '#2563eb';
  if (type === 'gate') return '#16a34a';
  if (type === 'hub') return '#f59e0b';
  return '#7c3aed';
}
function getRouteFromPath(pathname: string): RouteView {
  if (pathname === '/thao-tac-ban-do') return 'map';
  if (pathname === '/ve-chung-toi') return 'about';
  if (pathname === '/phan-hoi') return 'feedback';
  if (pathname === '/adminDashboard') return 'admin';
  if (pathname === '/importMockData') return 'importData';
  if (pathname.startsWith('/dia-diem/')) return 'detail';
  return 'landing';
}
function getDetailId(pathname: string) {
  return pathname.startsWith('/dia-diem/') ? pathname.replace('/dia-diem/', '') : '';
}
function resolveRouteState(pathname: string): RouteState {
  return {
    view: getRouteFromPath(pathname),
    detailId: getDetailId(pathname)
  };
}
function dijkstra(start: string, end: string, nodes: CampusNode[]) {
  const graph = new Map<string, Array<{ to: string; distance: number }>>();
  nodes.forEach((node) => graph.set(node.id, []));
  mockEdges.forEach((edge) => {
    if (!graph.has(edge.from) || !graph.has(edge.to)) return;
    graph.get(edge.from)?.push({ to: edge.to, distance: edge.distance });
    graph.get(edge.to)?.push({ to: edge.from, distance: edge.distance });
  });
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const unvisited = new Set<string>();
  nodes.forEach((node) => {
    dist.set(node.id, Number.POSITIVE_INFINITY);
    prev.set(node.id, null);
    unvisited.add(node.id);
  });
  dist.set(start, 0);
  while (unvisited.size > 0) {
    let current: string | null = null;
    let best = Number.POSITIVE_INFINITY;
    unvisited.forEach((id) => {
      const value = dist.get(id) ?? Number.POSITIVE_INFINITY;
      if (value < best) {
        best = value;
        current = id;
      }
    });
    if (!current || best === Number.POSITIVE_INFINITY) break;
    const currentId = current;
    if (currentId === end) break;
    unvisited.delete(currentId);
    (graph.get(currentId) ?? []).forEach((neighbor) => {
      if (!unvisited.has(neighbor.to)) return;
      const alt = (dist.get(currentId) ?? 0) + neighbor.distance;
      if (alt < (dist.get(neighbor.to) ?? Number.POSITIVE_INFINITY)) {
        dist.set(neighbor.to, alt);
        prev.set(neighbor.to, currentId);
      }
    });
  }
  const total = dist.get(end) ?? Number.POSITIVE_INFINITY;
  if (total === Number.POSITIVE_INFINITY) return null;
  const path: string[] = [];
  let crawl: string | null = end;
  while (crawl) {
    path.unshift(crawl);
    crawl = prev.get(crawl) ?? null;
  }
  return { path, distance: total };
}

function hydrateNode(rawNode: Partial<CampusNode>): CampusNode {
  const fallback = mockNodes.find((item) => item.id === rawNode.id) ?? mockNodes[0];
  return {
    ...fallback,
    ...rawNode,
    aliases: Array.isArray(rawNode.aliases) ? rawNode.aliases : fallback.aliases,
    feedbacks: Array.isArray(rawNode.feedbacks) ? rawNode.feedbacks : fallback.feedbacks,
    openingHour: typeof rawNode.openingHour === 'string' ? rawNode.openingHour : fallback.openingHour,
    closingHour: typeof rawNode.closingHour === 'string' ? rawNode.closingHour : fallback.closingHour,
    descriptionVi:
      typeof rawNode.descriptionVi === 'string' ? rawNode.descriptionVi : fallback.descriptionVi,
    descriptionEn:
      typeof rawNode.descriptionEn === 'string' ? rawNode.descriptionEn : fallback.descriptionEn
  };
}

function hydrateNodes(rawNodes: unknown): CampusNode[] {
  if (!Array.isArray(rawNodes)) {
    return mockNodes;
  }
  return rawNodes.map((item) => hydrateNode(item as Partial<CampusNode>));
}
function hydrateCommunityFeedbacks(rawFeedbacks: unknown): CommunityFeedback[] {
  if (!Array.isArray(rawFeedbacks)) {
    return mockCommunityFeedbacks;
  }
  return rawFeedbacks.map((item, index) => {
    const feedback = item as Partial<CommunityFeedback>;
    const fallback = mockCommunityFeedbacks[index % mockCommunityFeedbacks.length];
    return {
      id: typeof feedback.id === 'string' && feedback.id ? feedback.id : `cf-${Date.now()}-${index}`,
      user: typeof feedback.user === 'string' ? feedback.user : fallback.user,
      comment: typeof feedback.comment === 'string' ? feedback.comment : fallback.comment,
      createdAt: typeof feedback.createdAt === 'string' ? feedback.createdAt : fallback.createdAt,
      avatar: typeof feedback.avatar === 'string' ? feedback.avatar : fallback.avatar
    };
  });
}

function App() {
  const [nodes, setNodes] = useState<CampusNode[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockNodes;
    try {
      return hydrateNodes(JSON.parse(raw));
    } catch {
      return mockNodes;
    }
  });
  const [routeState, setRouteState] = useState<RouteState>(resolveRouteState(window.location.pathname));
  const [language, setLanguage] = useState<Language>('vi');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [communityFeedbacks, setCommunityFeedbacks] = useState<CommunityFeedback[]>(() => {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return mockCommunityFeedbacks;
    try {
      return hydrateCommunityFeedbacks(JSON.parse(raw));
    } catch {
      return mockCommunityFeedbacks;
    }
  });
  const [nodeEditor, setNodeEditor] = useState<CampusNode | null>(null);
  const [nodeEditorMode, setNodeEditorMode] = useState<'create' | 'edit'>('edit');
  const [nodeEditorOriginalId, setNodeEditorOriginalId] = useState<string | null>(null);
  const [memberEditor, setMemberEditor] = useState<TeamMember | null>(null);
  const [memberEditorMode, setMemberEditorMode] = useState<'create' | 'edit'>('edit');
  const [memberEditorIndex, setMemberEditorIndex] = useState<number | null>(null);
  const [communityFeedbackEditor, setCommunityFeedbackEditor] = useState<CommunityFeedback | null>(null);
  const [communityFeedbackEditorMode, setCommunityFeedbackEditorMode] = useState<'create' | 'edit'>('edit');
  const [communityFeedbackEditorId, setCommunityFeedbackEditorId] = useState<string | null>(null);
  const [adminDataFilter, setAdminDataFilter] = useState<'all' | 'locations' | 'members' | 'feedbacks'>('all');
  const [mapSearchDraft, setMapSearchDraft] = useState('');
  const [mapDestinationId, setMapDestinationId] = useState('');
  const [landingQuery, setLandingQuery] = useState('');
  const [landingTypeFilter, setLandingTypeFilter] = useState<string>('all');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMapLayerOpen, setIsMapLayerOpen] = useState(false);
  const [mapLayerMode, setMapLayerMode] = useState<'default' | 'satellite'>('default');
  const [userGeoPosition, setUserGeoPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geoPanNonce, setGeoPanNonce] = useState(0);
  const [geoUiStatus, setGeoUiStatus] = useState<
    'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'timeout' | 'insecure'
  >('idle');
  const [arCameraOpen, setArCameraOpen] = useState(false);
  const [arHeadingDeg, setArHeadingDeg] = useState<number | null>(null);
  const [arLivePosition, setArLivePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [arCameraErrorKey, setArCameraErrorKey] = useState<'cameraDenied' | 'orientDenied' | 'insecure' | null>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const arStreamRef = useRef<MediaStream | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [from, setFrom] = useState('gate-main');
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const commitMapDestination = useCallback((node: CampusNode) => {
    setMapSearchDraft(node.label);
    setMapDestinationId(node.id);
  }, []);

  const clearMapDestination = useCallback(() => {
    setMapDestinationId('');
  }, []);

  const swapFromAndDestination = useCallback(() => {
    if (!mapDestinationId) return;
    const nextFrom = mapDestinationId;
    const nextDestId = from;
    const destNode = nodeById.get(nextDestId);
    setFrom(nextFrom);
    setMapDestinationId(nextDestId);
    setMapSearchDraft(destNode?.label ?? '');
  }, [from, mapDestinationId, nodeById]);

  const requestUserGeolocation = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!window.isSecureContext) {
      setGeoUiStatus('insecure');
      return;
    }
    if (!navigator.geolocation) {
      setGeoUiStatus('unavailable');
      return;
    }
    setGeoUiStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserGeoPosition({ lat, lng });
        setGeoPanNonce((n) => n + 1);
        setGeoUiStatus('success');
      },
      (error: GeolocationPositionError) => {
        if (error.code === 1) setGeoUiStatus('denied');
        else if (error.code === 3) setGeoUiStatus('timeout');
        else setGeoUiStatus('unavailable');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  }, []);

  const closeArCamera = useCallback(() => {
    arStreamRef.current?.getTracks().forEach((track) => track.stop());
    arStreamRef.current = null;
    const video = arVideoRef.current;
    if (video) video.srcObject = null;
    setArCameraOpen(false);
    setArHeadingDeg(null);
    setArLivePosition(null);
  }, []);

  const openArCamera = useCallback(async () => {
    const dest = mapDestinationId ? nodeById.get(mapDestinationId) : undefined;
    if (!dest) return;
    setArCameraErrorKey(null);
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setArCameraErrorKey('insecure');
      return;
    }
    try {
      const orientationCtor = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof orientationCtor.requestPermission === 'function') {
        const perm = await orientationCtor.requestPermission();
        if (perm !== 'granted') {
          setArCameraErrorKey('orientDenied');
          return;
        }
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setArCameraErrorKey('cameraDenied');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      arStreamRef.current = stream;
      setArLivePosition(userGeoPosition);
      setArCameraOpen(true);
    } catch {
      setArCameraErrorKey('cameraDenied');
    }
  }, [mapDestinationId, nodeById, userGeoPosition]);

  useEffect(() => {
    if (routeState.view !== 'map' && arCameraOpen) closeArCamera();
  }, [routeState.view, arCameraOpen, closeArCamera]);

  useEffect(() => {
    if (arCameraOpen && !mapDestinationId) closeArCamera();
  }, [arCameraOpen, mapDestinationId, closeArCamera]);

  useEffect(() => {
    setArCameraErrorKey(null);
  }, [mapDestinationId]);

  useEffect(() => {
    if (!arCameraOpen) return;
    const video = arVideoRef.current;
    const stream = arStreamRef.current;
    if (video && stream) {
      video.srcObject = stream;
      void video.play().catch(() => {});
    }
  }, [arCameraOpen]);

  useEffect(() => {
    if (!arCameraOpen) return;
    const onOrient = (event: DeviceOrientationEvent) => {
      const h = headingFromDeviceOrientation(event);
      if (h != null) setArHeadingDeg(h);
    };
    window.addEventListener('deviceorientation', onOrient, true);
    return () => window.removeEventListener('deviceorientation', onOrient, true);
  }, [arCameraOpen]);

  useEffect(() => {
    if (!arCameraOpen || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setArLivePosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 2500 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [arCameraOpen]);

  const routeStartCandidates = useMemo(
    () => nodes.filter((node) => node.type === 'gate' || node.type === 'campus' || node.type === 'hub'),
    [nodes]
  );

  useEffect(() => {
    if (!userGeoPosition || routeStartCandidates.length === 0) return;
    let bestId = routeStartCandidates[0].id;
    let bestD = Infinity;
    for (const node of routeStartCandidates) {
      const d = haversineMeters(userGeoPosition, { lat: node.lat, lng: node.lng });
      if (d < bestD) {
        bestD = d;
        bestId = node.id;
      }
    }
    setFrom(bestId);
  }, [userGeoPosition, routeStartCandidates]);

  const mapSuggestions = useMemo(() => {
    const keyword = normalize(mapSearchDraft);
    if (!keyword) return [];
    const scored = nodes
      .map((node) => {
        const nl = normalize(node.label);
        let score = 0;
        if (nl === keyword) score = 100;
        else if (nl.startsWith(keyword)) score = 80;
        else if (nl.includes(keyword)) score = 60;
        else {
          const aliasBest = Math.max(
            0,
            ...node.aliases.map((alias) => {
              const na = normalize(alias);
              if (na === keyword) return 95;
              if (na.startsWith(keyword)) return 75;
              if (na.includes(keyword)) return 55;
              return 0;
            })
          );
          if (!aliasBest) return null;
          score = aliasBest;
        }
        return { node, score };
      })
      .filter((item): item is { node: CampusNode; score: number } => Boolean(item));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((item) => item.node);
  }, [mapSearchDraft, nodes]);

  const activeId = mapDestinationId;
  const route = useMemo(() => {
    if (!mapDestinationId || from === mapDestinationId) return null;
    return dijkstra(from, mapDestinationId, nodes);
  }, [from, mapDestinationId, nodes]);
  const routeLatLngs = useMemo(() => {
    if (!route) return [] as [number, number][];
    const coords: [number, number][] = [];
    for (const id of route.path) {
      const n = nodeById.get(id);
      if (n) coords.push([n.lat, n.lng]);
    }
    return coords;
  }, [route, nodeById]);
  const routeBoundsKey = route?.path.join('|') ?? '';
  const routeSegments = useMemo(() => {
    if (!route) return [];
    const list: string[] = [];
    for (let i = 0; i < route.path.length - 1; i += 1) {
      const a = route.path[i];
      const b = route.path[i + 1];
      const edge = mockEdges.find((item) => (item.from === a && item.to === b) || (item.from === b && item.to === a));
      if (edge) list.push(edge.note);
    }
    return list;
  }, [route]);
  const activeNode = nodeById.get(activeId);
  const arPositionForArrow = arLivePosition ?? userGeoPosition;
  const arOverlayMetrics = useMemo(() => {
    const dest = mapDestinationId ? nodeById.get(mapDestinationId) : undefined;
    if (!dest || !arPositionForArrow) return { bearing: null as number | null, dist: null as number | null };
    return {
      bearing: bearingDegrees(arPositionForArrow.lat, arPositionForArrow.lng, dest.lat, dest.lng),
      dist: haversineMeters(arPositionForArrow, { lat: dest.lat, lng: dest.lng })
    };
  }, [mapDestinationId, nodeById, arPositionForArrow]);
  const arArrowRotateDeg =
    arOverlayMetrics.bearing != null && arHeadingDeg != null
      ? ((arOverlayMetrics.bearing - arHeadingDeg + 540) % 360) - 180
      : 0;
  const fromNode = nodeById.get(from);
  const detailNode = nodeById.get(routeState.detailId);
  const routeView = routeState.view;
  const t = TEXT[language];
  const currentLang = LANGUAGE_OPTIONS.find((item) => item.value === language) ?? LANGUAGE_OPTIONS[0];
  const uniqueNodeTypes = useMemo(() => Array.from(new Set(nodes.map((node) => node.type))).filter(Boolean), [nodes]);
  const landingNodes = useMemo(() => {
    const keyword = normalize(landingQuery);
    return nodes.filter((node) => {
      const matchKeyword =
        !keyword ||
        normalize(node.label).includes(keyword) ||
        node.aliases.some((alias) => normalize(alias).includes(keyword));
      const matchType = landingTypeFilter === 'all' || node.type === landingTypeFilter;
      return matchKeyword && matchType;
    });
  }, [landingQuery, landingTypeFilter, nodes]);
  React.useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes)), [nodes]);
  React.useEffect(() => localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(communityFeedbacks)), [communityFeedbacks]);
  React.useEffect(() => {
    const onPopState = () => setRouteState(resolveRouteState(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, '', path);
    setRouteState(resolveRouteState(path));
  }, []);

  const isNavActive = useCallback(
    (key: 'landing' | 'map' | 'about' | 'feedback') => {
      if (key === 'landing') {
        return routeState.view === 'landing' || routeState.view === 'detail';
      }
      return routeState.view === key;
    },
    [routeState.view]
  );
  const deleteNode = (id: string) => {
    setNodes((current) => current.filter((node) => node.id !== id));
    if (nodeEditorOriginalId === id) {
      setNodeEditor(null);
      setNodeEditorOriginalId(null);
    }
  };
  const createNodeDraft = () => {
    const suffix = String(Date.now()).slice(-6);
    return {
      id: `new-${suffix}`,
      label: language === 'vi' ? 'Địa danh mới' : 'New location',
      type: 'room',
      lat: 21.0377,
      lng: 105.7868,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      aliases: [],
      descriptionVi: 'Mô tả mới.',
      descriptionEn: 'New description.',
      openingHour: '07:00',
      closingHour: '18:00',
      feedbacks: []
    };
  };
  const openCreateNodeEditor = () => {
    setNodeEditorMode('create');
    setNodeEditorOriginalId(null);
    setNodeEditor(createNodeDraft());
  };
  const openEditNodeEditor = (node: CampusNode) => {
    setNodeEditorMode('edit');
    setNodeEditorOriginalId(node.id);
    setNodeEditor({ ...node });
  };
  const saveNodeEditor = () => {
    if (!nodeEditor) return;
    if (nodeEditorMode === 'create') {
      setNodes((current) => [...current, nodeEditor]);
    } else if (nodeEditorOriginalId) {
      setNodes((current) => current.map((item) => (item.id === nodeEditorOriginalId ? nodeEditor : item)));
    }
    setNodeEditor(null);
    setNodeEditorOriginalId(null);
  };
  const updateMember = (index: number, patch: Partial<TeamMember>) => {
    setMembers((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const createMemberDraft = () => {
    const fallback = MEMBER_AVATAR_FALLBACKS[members.length % MEMBER_AVATAR_FALLBACKS.length];
    return {
      name: language === 'vi' ? 'Thành viên mới' : 'New member',
      role: 'Role',
      bio: language === 'vi' ? 'Mô tả ngắn.' : 'Short bio.',
      avatar: fallback
    };
  };
  const openCreateMemberEditor = () => {
    setMemberEditorMode('create');
    setMemberEditorIndex(null);
    setMemberEditor(createMemberDraft());
  };
  const openEditMemberEditor = (member: TeamMember, index: number) => {
    setMemberEditorMode('edit');
    setMemberEditorIndex(index);
    setMemberEditor({ ...member });
  };
  const saveMemberEditor = () => {
    if (!memberEditor) return;
    if (memberEditorMode === 'create') {
      setMembers((current) => [...current, memberEditor]);
    } else if (memberEditorIndex !== null) {
      updateMember(memberEditorIndex, memberEditor);
    }
    setMemberEditor(null);
    setMemberEditorIndex(null);
  };
  const deleteMember = (index: number) => {
    setMembers((current) => current.filter((_, i) => i !== index));
    if (memberEditorIndex === index) {
      setMemberEditor(null);
      setMemberEditorIndex(null);
    }
  };
  const getMemberAvatar = (member: TeamMember, index: number) => member.avatar || MEMBER_AVATAR_FALLBACKS[index % MEMBER_AVATAR_FALLBACKS.length];
  const createCommunityFeedbackDraft = () => ({
    id: `cf-${Date.now()}`,
    user: language === 'vi' ? 'Người dùng mới' : 'New user',
    comment: '',
    createdAt: new Date().toISOString().slice(0, 10),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  });
  const openCreateCommunityFeedbackEditor = () => {
    setCommunityFeedbackEditorMode('create');
    setCommunityFeedbackEditorId(null);
    setCommunityFeedbackEditor(createCommunityFeedbackDraft());
  };
  const openEditCommunityFeedbackEditor = (feedback: CommunityFeedback) => {
    setCommunityFeedbackEditorMode('edit');
    setCommunityFeedbackEditorId(feedback.id);
    setCommunityFeedbackEditor({ ...feedback });
  };
  const saveCommunityFeedbackEditor = () => {
    if (!communityFeedbackEditor) return;
    if (communityFeedbackEditorMode === 'create') {
      setCommunityFeedbacks((current) => [...current, communityFeedbackEditor]);
    } else if (communityFeedbackEditorId) {
      setCommunityFeedbacks((current) =>
        current.map((item) => (item.id === communityFeedbackEditorId ? communityFeedbackEditor : item))
      );
    }
    setCommunityFeedbackEditor(null);
    setCommunityFeedbackEditorId(null);
  };
  const deleteCommunityFeedback = (id: string) => {
    setCommunityFeedbacks((current) => current.filter((item) => item.id !== id));
    if (communityFeedbackEditorId === id) {
      setCommunityFeedbackEditor(null);
      setCommunityFeedbackEditorId(null);
    }
  };
  const exportMockData = () => {
    const fileContent = `export type CampusNode = {
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

export const mockNodes: CampusNode[] = ${JSON.stringify(nodes, null, 2)};

export const mockEdges: Edge[] = ${JSON.stringify(mockEdges, null, 2)};

export const mockMembers: TeamMember[] = ${JSON.stringify(members, null, 2)};

export const mockCommunityFeedbacks: CommunityFeedback[] = ${JSON.stringify(communityFeedbacks, null, 2)};
`;
    const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mockData.ts';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };
  const importMockData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const parsed = JSON.parse(content) as Partial<{
        mockNodes: unknown;
        mockMembers: unknown;
        mockCommunityFeedbacks: unknown;
      }>;
      if (parsed.mockNodes !== undefined) {
        setNodes(hydrateNodes(parsed.mockNodes));
      }
      if (Array.isArray(parsed.mockMembers)) {
        setMembers(parsed.mockMembers as TeamMember[]);
      }
      if (parsed.mockCommunityFeedbacks !== undefined) {
        setCommunityFeedbacks(hydrateCommunityFeedbacks(parsed.mockCommunityFeedbacks));
      }
      setImportStatus('success');
    } catch {
      setImportStatus('error');
    } finally {
      event.target.value = '';
    }
  };
  const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (feedbackStatus === 'sending') return;
    setFeedbackStatus('sending');
    const form = event.currentTarget;
    try {
      const response = await fetch('https://formspree.io/f/xnjwbqbj', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error('submit_failed');
      }
      const formData = new FormData(form);
      const fullName = String(formData.get('fullName') ?? '').trim();
      const feedbackText = String(formData.get('feedback') ?? '').trim();
      if (fullName && feedbackText) {
        setCommunityFeedbacks((current) => [
          {
            id: `cf-${Date.now()}`,
            user: fullName,
            comment: feedbackText,
            createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          },
          ...current
        ]);
      }
      form.reset();
      setFeedbackStatus('success');
    } catch {
      setFeedbackStatus('error');
    }
  };

  return (
    <div className={`app ${themeMode === 'dark' ? 'dark' : ''}`}>
      <header className="topNav">
        <div className="navLeft">
          <button type="button" className="brand brandButton" onClick={() => navigate('/')}>
            <img src={BRAND_LOGO_URL} alt="Lac Loi O ULIS logo" className="brandLogo" />
          <span className="brandText">{t.brand}</span>
          </button>
          <nav className="navGroup">
            {NAV_ITEMS.filter((item) => item.key !== 'about' && item.key !== 'feedback').map((item) => (
              <button
                key={item.key}
                className={`navBtn ${isNavActive(item.key) ? 'activeNav' : ''}`}
                type="button"
                onClick={() => navigate(item.path)}
              >
                {t.nav[item.key]}
              </button>
            ))}
          </nav>
        </div>

        <div className="navRight">
          {NAV_ITEMS.filter((item) => item.key === 'about' || item.key === 'feedback').map((item) => (
            <button
              key={item.key}
              className={`navBtn ${isNavActive(item.key) ? 'activeNav' : ''}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              {t.nav[item.key]}
            </button>
          ))}
          <label className="themeSwitch" title={t.theme}>
            <input
              type="checkbox"
              checked={themeMode === 'dark'}
              onChange={() => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
            />
            <span className="themeSlider" />
          </label>
          <div className="langMenuWrap">
            <button type="button" className="utilityBtn langMenuBtn" onClick={() => setIsLangOpen((prev) => !prev)}>
              <img src={currentLang.icon} alt={currentLang.label} />
            </button>
            {isLangOpen && (
              <div className="langMenu">
                {LANGUAGE_OPTIONS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`langMenuItem ${language === item.value ? 'activeLangItem' : ''}`}
                    onClick={() => {
                      setLanguage(item.value);
                      setIsLangOpen(false);
                    }}
                  >
                    <img src={item.icon} alt={item.label} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {routeView === 'landing' && (
        <main className="landingPage">
          <section className="landingShell">
            <div className="landingTopRow">
              <div className="landingHero">
                <span className="landingKicker">{t.heroKicker}</span>
                <h1>{t.heroTitle}</h1>
                <p>{t.heroDesc}</p>
                <div className="landingActions">
                  <button type="button" className="primaryBtn" onClick={() => navigate('/thao-tac-ban-do')}>
                    {t.ctaMap}
                  </button>
                  <button type="button" className="ghostBtn" onClick={() => navigate('/ve-chung-toi')}>
                    {t.ctaAbout}
                  </button>
                </div>
              </div>
              <section className="landingVideoSection">
                <h3>{t.introVideo}</h3>
                <div className="landingVideoWrap">
                  <iframe
                    src={INTRO_VIDEO_EMBED_URL}
                    title="ULIS introduction video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </section>
            </div>
            <section className="landingFeatures">
              <article className="featureCard">
                <h4>{t.f1t}</h4>
                <p>{t.f1d}</p>
              </article>
              <article className="featureCard">
                <h4>{t.f2t}</h4>
                <p>{t.f2d}</p>
              </article>
              <article className="featureCard">
                <h4>{t.f3t}</h4>
                <p>{t.f3d}</p>
              </article>
            </section>
          </section>

          <section className="card landingCatalog">
            <h3>{t.catalogTitle}</h3>
            <p>{t.catalogDesc}</p>
            <div className="landingToolbar">
              <input
                value={landingQuery}
                onChange={(event) => setLandingQuery(event.target.value)}
                placeholder={t.landingSearchPlaceholder}
              />
              <select value={landingTypeFilter} onChange={(event) => setLandingTypeFilter(event.target.value)}>
                <option value="all">{t.allTypes}</option>
                {uniqueNodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {getTypeLabel(type, language)}
                  </option>
                ))}
              </select>
            </div>
          </section>
          <div className="locationGrid">
            {landingNodes.map((node) => (
              <article key={node.id} className="locationCard" onClick={() => navigate(`/dia-diem/${node.id}`)}>
                <img src={node.image} alt={node.label} />
                <div>
                  <h3>{node.label}</h3>
                  <p>{getTypeLabel(node.type, language)}</p>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {routeView === 'detail' && detailNode && (
        <main className="card detailPage">
          <button type="button" className="linkBtn" onClick={() => navigate('/')}>{t.backHome}</button>
          <h1 className="detailTitle">{detailNode.label}</h1>
          <p className="detailSubtitle">{t.typePrefix}: {getTypeLabel(detailNode.type, language)}</p>
          <div className="detailLayout">
            <div className="detailMainColumn">
              <img src={detailNode.image} alt={detailNode.label} className="detailImage" />
              <div className="detailThumbRow">
                <img src={detailNode.image} alt={detailNode.label} className="detailThumb active" />
              </div>
            </div>
            <div className="detailInfo">
              <section className="card detailHeroCard">
                <h3>{detailNode.label}</h3>
                <p>{t.convenient}</p>
                <div className="detailBadgeRow">
                  <span className="statusBadge">{getTypeLabel(detailNode.type, language)}</span>
                  <span className="statusBadge">{t.internalRoute}</span>
                </div>
                <p className="detailCoord">{t.coordsPrefix}: {detailNode.lat}, {detailNode.lng}</p>
              </section>
              <section className="card">
                <h3>{t.detailDescription}</h3>
                <p>{detailNode.descriptionVi}</p>
              </section>
              <section className="card detailMetaGrid">
                <article>
                  <h4>{t.openClose}</h4>
                  <p>{t.openAt}: {detailNode.openingHour}</p>
                  <p>{t.closeAt}: {detailNode.closingHour}</p>
                </article>
                <article>
                  <h4>{t.highlights}</h4>
                  <p>{t.coordsPrefix}: {detailNode.lat}, {detailNode.lng}</p>
                </article>
              </section>
              <section className="card detailMapCard">
                <h3>{t.mapPositionTitle}</h3>
                <p className="detailMapDesc">
                  {detailNode.label} — {t.mapPositionDesc}: {detailNode.label}.
                </p>
                <div className="detailMapEmbedWrap">
                  <iframe
                    title={`map-${detailNode.id}`}
                    src={`https://maps.google.com/maps?q=${detailNode.lat},${detailNode.lng}&z=17&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${detailNode.lat},${detailNode.lng}`} target="_blank" rel="noreferrer">
                  {t.openAddressMaps}
                </a>
              </section>
            </div>
          </div>
        </main>
      )}

      {routeView === 'map' && (
        <>
        <main className="content">
          <aside className="panel">
            <section className="card searchCard">
              <h2>{t.searchTitle}</h2>
              <p className="mapPanelIntro">{t.mapPanelIntro}</p>
              <label htmlFor="search">{t.searchLabel}</label>
              <div className="searchSuggestWrap">
                <input
                  id="search"
                  value={mapSearchDraft}
                  onChange={(event) => {
                    setMapSearchDraft(event.target.value);
                    setMapDestinationId('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    const first = mapSuggestions[0];
                    if (first) {
                      event.preventDefault();
                      commitMapDestination(first);
                    }
                  }}
                  placeholder={t.searchPlaceholder}
                  autoComplete="off"
                />
                <p className="mapSearchHint">{t.mapSearchHint}</p>
                {mapSuggestions.length > 0 && !mapDestinationId && (
                  <div className="suggestList">
                    <span>{t.suggestionTitle}</span>
                    {mapSuggestions.map((node) => (
                      <button key={node.id} type="button" onClick={() => commitMapDestination(node)}>
                        {node.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mapDestToolbar">
                {mapDestinationId ? (
                  <p className="hit mapDestChosen">
                    {t.toPrefix}: <strong>{nodeById.get(mapDestinationId)?.label}</strong>
                  </p>
                ) : (
                  <p className="mapDestPlaceholder">{t.chooseDestination}</p>
                )}
                <div className="mapDestActions">
                  <button type="button" className="ghostBtn smallGhost" onClick={clearMapDestination} disabled={!mapDestinationId}>
                    {t.mapClearDestination}
                  </button>
                  <button type="button" className="ghostBtn smallGhost" onClick={swapFromAndDestination} disabled={!mapDestinationId}>
                    {t.mapSwapEnds}
                  </button>
                </div>
              </div>
              <div className="mapGeoRow">
                <button
                  type="button"
                  className="primaryBtn mapGeoBtn"
                  onClick={requestUserGeolocation}
                  disabled={geoUiStatus === 'loading'}
                >
                  {t.mapMyLocation}
                </button>
                {geoUiStatus !== 'idle' && (
                  <p
                    className={`mapGeoMsg ${geoUiStatus === 'success' ? 'mapGeoOk' : geoUiStatus === 'loading' ? 'mapGeoNeutral' : 'mapGeoErr'}`}
                  >
                    {geoUiStatus === 'loading' && t.mapGeoLoading}
                    {geoUiStatus === 'success' && t.mapGeoSuccess}
                    {geoUiStatus === 'denied' && t.mapGeoDenied}
                    {geoUiStatus === 'timeout' && t.mapGeoTimeout}
                    {geoUiStatus === 'unavailable' && t.mapGeoUnavailable}
                    {geoUiStatus === 'insecure' && t.mapGeoInsecure}
                  </p>
                )}
              </div>
              <div className="mapLocationReadout">
                <div className="mapLocationLabel">{t.fromLabel}</div>
                {userGeoPosition ? (
                  <>
                    <p className="mapLocationPrimary">
                      {t.coordsPrefix}: {userGeoPosition.lat.toFixed(6)}, {userGeoPosition.lng.toFixed(6)}
                    </p>
                    <p className="mapLocationMeta">
                      {t.mapInternalRouteFrom} <strong>{nodeById.get(from)?.label ?? '—'}</strong>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mapLocationPrimary">{nodeById.get(from)?.label ?? '—'}</p>
                    <p className="mapLocationMeta">{t.mapLocationNoGpsHint}</p>
                  </>
                )}
              </div>
              <label htmlFor="to">{t.toLabel}</label>
              <select
                id="to"
                value={mapDestinationId}
                onChange={(event) => {
                  const id = event.target.value;
                  setMapDestinationId(id);
                  const node = nodeById.get(id);
                  setMapSearchDraft(node?.label ?? '');
                }}
              >
                <option value="">{t.chooseDestination}</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
              {mapDestinationId && activeNode && (
                <div className="mapArRow">
                  <button type="button" className="ghostBtn smallGhost mapArOpenBtn" onClick={() => void openArCamera()}>
                    {t.mapArOpen}
                  </button>
                  <p className="mapArHint">{t.mapArHint}</p>
                  {arCameraErrorKey && (
                    <p className="mapGeoMsg mapGeoErr">
                      {arCameraErrorKey === 'insecure' && t.mapGeoInsecure}
                      {arCameraErrorKey === 'orientDenied' && t.mapArOrientDenied}
                      {arCameraErrorKey === 'cameraDenied' && t.mapArCameraDenied}
                    </p>
                  )}
                </div>
              )}
            </section>
            <section className="routeBox card">
              <h2>{t.routeDetail}</h2>
              {!mapDestinationId ? (
                <p>{t.chooseDestination}</p>
              ) : from === mapDestinationId ? (
                <p>{t.mapSameStartEnd}</p>
              ) : route ? (
                <>
                  <p>
                    {t.toPrefix} <strong>{activeNode?.label}</strong>: ~{route.distance} m
                  </p>
                  <ol>
                    {route.path.map((id) => (
                      <li key={id}>{nodeById.get(id)?.label}</li>
                    ))}
                  </ol>
                  <div className="steps">
                    {routeSegments.map((segment, segmentIndex) => (
                      <span key={`${routeBoundsKey}-seg-${segmentIndex}`}>{segment}</span>
                    ))}
                  </div>
                </>
              ) : (
                <p>{t.noRoute}</p>
              )}
            </section>
          </aside>
          <section className="mapSection card">
            <div className="mapHeader">
              <div>
                <h2>{t.mapTitle}</h2>
                {routeLatLngs.length >= 2 && <p className="mapRouteLegend">{t.mapRouteLegend}</p>}
              </div>
              <div className="mapHeaderControls">
                <label htmlFor="map-layer">{t.mapLayerLabel}</label>
                <div className="mapLayerMenuWrap">
                  <button
                    id="map-layer"
                    type="button"
                    className="mapLayerMenuBtn"
                    onClick={() => setIsMapLayerOpen((prev) => !prev)}
                  >
                    {mapLayerMode === 'default' ? t.mapLayerDefault : t.mapLayerSatellite}
                  </button>
                  {isMapLayerOpen && (
                    <div className="mapLayerMenu">
                      <button
                        type="button"
                        className={`mapLayerMenuItem ${mapLayerMode === 'default' ? 'activeMapLayer' : ''}`}
                        onClick={() => {
                          setMapLayerMode('default');
                          setIsMapLayerOpen(false);
                        }}
                      >
                        {t.mapLayerDefault}
                      </button>
                      <button
                        type="button"
                        className={`mapLayerMenuItem ${mapLayerMode === 'satellite' ? 'activeMapLayer' : ''}`}
                        onClick={() => {
                          setMapLayerMode('satellite');
                          setIsMapLayerOpen(false);
                        }}
                      >
                        {t.mapLayerSatellite}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mapCanvas">
              <MapContainer center={[21.0377, 105.7868]} zoom={16} className="leafletMap" scrollWheelZoom>
                {mapLayerMode === 'satellite' ? (
                  <TileLayer attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                ) : (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                )}
                {routeLatLngs.length >= 2 && (
                  <Polyline
                    positions={routeLatLngs}
                    pathOptions={{
                      color: '#2563eb',
                      weight: 6,
                      opacity: 0.85,
                      lineCap: 'round',
                      lineJoin: 'round'
                    }}
                  />
                )}
                <MapRouteBounds latLngs={routeLatLngs} boundsKey={routeBoundsKey} />
                <MapPanToUserLocation
                  lat={userGeoPosition?.lat ?? null}
                  lng={userGeoPosition?.lng ?? null}
                  panNonce={geoPanNonce}
                  zoom={18}
                />
                {nodes.map((node) => (
                  <CircleMarker
                    key={node.id}
                    center={[node.lat, node.lng]}
                    radius={activeId === node.id ? getMarkerRadius(node.type) + 3 : getMarkerRadius(node.type)}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 2,
                      fillColor: getMarkerColor(node.type),
                      fillOpacity: 0.95
                    }}
                    eventHandlers={{
                      click: () => {
                        commitMapDestination(node);
                      }
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -8]} opacity={1} className="mapLabel">
                      {node.label}
                    </Tooltip>
                    <Popup>
                      <div className="mapPopup">
                        <h3>{node.label}</h3>
                        <p>{getTypeLabel(node.type, language)}</p>
                        <button type="button" className="linkBtn mapPopupDestBtn" onClick={() => commitMapDestination(node)}>
                          {t.mapPickAsDestination}
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${fromNode?.lat ?? node.lat},${fromNode?.lng ?? node.lng}&destination=${node.lat},${node.lng}&travelmode=walking`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.openMaps}
                        </a>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
                {userGeoPosition && (
                  <CircleMarker
                    center={[userGeoPosition.lat, userGeoPosition.lng]}
                    radius={11}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 3,
                      fillColor: '#0ea5e9',
                      fillOpacity: 1
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -10]} opacity={1} className="mapLabel mapUserGeoLabel">
                      {t.mapYouAreHere}
                    </Tooltip>
                    <Popup>
                      <div className="mapPopup">
                        <h3>{t.mapYouAreHere}</h3>
                        <p>
                          {t.coordsPrefix}: {userGeoPosition.lat.toFixed(6)}, {userGeoPosition.lng.toFixed(6)}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${userGeoPosition.lat},${userGeoPosition.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.openLocation}
                        </a>
                      </div>
                    </Popup>
                  </CircleMarker>
                )}
              </MapContainer>
              {activeNode && (
                <div className="mapInfoCard">
                  <strong>{activeNode.label}</strong>
                  <span>
                    {getTypeLabel(activeNode.type, language)}
                    {route ? ` • ~${route.distance} m` : ''}
                  </span>
                </div>
              )}
            </div>
          </section>
        </main>
        {arCameraOpen && activeNode && (
          <div className="arCameraOverlay" role="dialog" aria-modal="true" aria-label={t.mapArOpen}>
            <video ref={arVideoRef} className="arCameraVideo" autoPlay playsInline muted />
            <div className="arCameraHud">
              <div className="arCameraTopBar">
                <button type="button" className="arCameraCloseBtn" onClick={closeArCamera}>
                  {t.mapArClose}
                </button>
              </div>
              <div className="arArrowStage">
                <div className="arArrowPivot" style={{ transform: `rotate(${arArrowRotateDeg}deg)` }} aria-hidden>
                  <svg className="arArrowSvg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <polygon
                      points="60,12 108,96 12,96"
                      fill="#fbbf24"
                      stroke="#1e293b"
                      strokeWidth="5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {arHeadingDeg == null && <p className="arHeadingWait">{t.mapArNoHeading}</p>}
              </div>
              <div className="arCameraFooter">
                <strong className="arDestTitle">{activeNode.label}</strong>
                {arOverlayMetrics.dist != null && (
                  <p className="arDistLine">
                    {t.mapArDistance}: ~{Math.round(arOverlayMetrics.dist)} m
                  </p>
                )}
                <p className="arDisclaimer">{t.mapArDisclaimer}</p>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      {routeView === 'about' && (
        <main className="aboutPage card">
          <section className="aboutHero">
            <div>
              <h1>{t.aboutTitle}</h1>
              <p>{t.aboutDesc}</p>
            </div>
          </section>

          <div className="aboutLayout">
            <section className="aboutTeamSection">
              <div className="aboutGrid">
                {members.map((member, index) => (
                  <article key={member.name} className="aboutMemberCard">
                    <img src={getMemberAvatar(member, index)} alt={member.name} className="memberAvatar" />
                    <h3>{member.name}</h3>
                    <p><strong>{member.role}</strong></p>
                    <p>{member.bio}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      {routeView === 'feedback' && (
        <main className="feedbackPage">
          <section className="feedbackHero card">
            <h1>{t.feedbackFormTitle}</h1>
            <p>{t.aboutDesc}</p>
          </section>
          <div className="feedbackLayout">
            <aside className="feedbackInfo card">
              <h3>{t.feedback}</h3>
              <div className="communityFeedbackList">
                {communityFeedbacks.map((item) => (
                  <article key={item.id} className="communityFeedbackItem">
                    <div className="communityFeedbackHead">
                      {item.avatar ? <img src={item.avatar} alt={item.user} className="communityFeedbackAvatar" /> : <span className="communityFeedbackAvatar fallback">U</span>}
                      <div>
                        <strong>{item.user}</strong>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                    <p>{item.comment}</p>
                  </article>
                ))}
              </div>
            </aside>
            <section className="aboutFeedback card">
              <form onSubmit={submitFeedback} className="feedbackForm">
                <input type="text" name="fullName" placeholder={t.fullName} required />
                <input type="tel" name="phoneNumber" placeholder={t.phoneNumber} required />
                <input type="email" name="email" placeholder={t.emailAddress} required />
                <textarea name="feedback" placeholder={t.feedbackContent} rows={5} required />
                <button type="submit" disabled={feedbackStatus === 'sending'}>
                  {feedbackStatus === 'sending' ? t.sendingFeedback : t.sendFeedback}
                </button>
                {feedbackStatus === 'success' && <p className="formNotice success">{t.feedbackSuccess}</p>}
                {feedbackStatus === 'error' && <p className="formNotice error">{t.feedbackError}</p>}
              </form>
            </section>
          </div>
        </main>
      )}

      {routeView === 'importData' && (
        <main className="importDataPage card">
          <h1>{t.importDataTitle}</h1>
          <p>{t.importDataDesc}</p>
          <label className="importBtn">
            {t.importDataChooseFile}
            <input type="file" accept="application/json" onChange={importMockData} />
          </label>
          {importStatus === 'success' && <p className="formNotice success">{t.importDataSuccess}</p>}
          {importStatus === 'error' && <p className="formNotice error">{t.importError}</p>}
        </main>
      )}

      {routeView === 'admin' && (
        <main className="adminPage card">
          <div className="adminHeader">
            <h1>{t.adminTitle}</h1>
            <div className="adminActions">
              <button type="button" onClick={exportMockData}>{t.export}</button>
            </div>
          </div>
          <section className="adminFilters card">
            <h3>{t.filterData}</h3>
            <div className="adminFilterRow">
              <button type="button" className={`filterBtn ${adminDataFilter === 'all' ? 'active' : ''}`} onClick={() => setAdminDataFilter('all')}>{t.all}</button>
              <button type="button" className={`filterBtn ${adminDataFilter === 'locations' ? 'active' : ''}`} onClick={() => setAdminDataFilter('locations')}>{t.locationDataFilter}</button>
              <button type="button" className={`filterBtn ${adminDataFilter === 'members' ? 'active' : ''}`} onClick={() => setAdminDataFilter('members')}>{t.membersDataFilter}</button>
              <button type="button" className={`filterBtn ${adminDataFilter === 'feedbacks' ? 'active' : ''}`} onClick={() => setAdminDataFilter('feedbacks')}>{t.feedbacksDataFilter}</button>
            </div>
          </section>
          {(adminDataFilter === 'all' || adminDataFilter === 'locations') && <section className="adminSection card">
            <div className="adminSectionHead">
              <h3>{t.adminLocationData}</h3>
              <button type="button" className="sectionAddBtn" onClick={openCreateNodeEditor}>{t.addLocation}</button>
            </div>
            <div className="adminTableWrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên điểm</th>
                    <th>Loại</th>
                    <th>{t.image}</th>
                    <th>{t.latitude}</th>
                    <th>{t.longitude}</th>
                    <th>Mở</th>
                    <th>Đóng</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr key={node.id}>
                      <td>{node.id}</td>
                      <td>{node.label}</td>
                      <td>{node.type}</td>
                      <td>{node.image}</td>
                      <td>{node.lat}</td>
                      <td>{node.lng}</td>
                      <td>{node.openingHour}</td>
                      <td>{node.closingHour}</td>
                      <td className="adminActionCell">
                        <button
                          type="button"
                          className="neutralBtn"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditNodeEditor(node);
                          }}
                        >
                          {t.edit}
                        </button>
                        <button type="button" className="dangerBtn" onClick={() => deleteNode(node.id)}>{t.delete}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>}

          {(adminDataFilter === 'all' || adminDataFilter === 'members') && <section className="adminSection card">
            <div className="adminSectionHead">
              <h3>{t.adminMembers}</h3>
              <button type="button" className="sectionAddBtn" onClick={openCreateMemberEditor}>{t.addMember}</button>
            </div>
            <div className="adminTableWrap">
              <table>
                <thead><tr><th>Avatar</th><th>Tên</th><th>Vai trò</th><th>Mô tả</th><th>Avatar URL</th><th>{t.actions}</th></tr></thead>
                <tbody>
                  {members.map((member, index) => {
                    return (
                    <tr key={`${member.name}-${index}`}>
                      <td><img src={getMemberAvatar(member, index)} alt={member.name} className="adminMiniAvatar" /></td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.bio}</td>
                      <td>{member.avatar}</td>
                      <td className="adminActionCell">
                        <button
                          type="button"
                          className="neutralBtn"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditMemberEditor(member, index);
                          }}
                        >
                          {t.edit}
                        </button>
                        <button type="button" className="dangerBtn" onClick={() => deleteMember(index)}>{t.delete}</button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>}
          {(adminDataFilter === 'all' || adminDataFilter === 'feedbacks') && <section className="adminSection card">
            <div className="adminSectionHead">
              <h3>{t.adminCommunityFeedbackData}</h3>
              <button type="button" className="sectionAddBtn" onClick={openCreateCommunityFeedbackEditor}>{t.addFeedback}</button>
            </div>
            <div className="adminTableWrap">
              <table>
                <thead><tr><th>ID</th><th>Avatar</th><th>User</th><th>Comment</th><th>Date</th><th>{t.actions}</th></tr></thead>
                <tbody>
                  {communityFeedbacks.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.avatar}</td>
                      <td>{item.user}</td>
                      <td>{item.comment}</td>
                      <td>{item.createdAt}</td>
                      <td className="adminActionCell">
                        <button
                          type="button"
                          className="neutralBtn"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditCommunityFeedbackEditor(item);
                          }}
                        >
                          {t.edit}
                        </button>
                        <button type="button" className="dangerBtn" onClick={() => deleteCommunityFeedback(item.id)}>{t.delete}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>}
          {(nodeEditor || memberEditor || communityFeedbackEditor) && (
            <div
              className="adminModalBackdrop"
              onClick={() => {
                setNodeEditor(null);
                setMemberEditor(null);
                setCommunityFeedbackEditor(null);
              }}
            >
              <section className="adminModal card" onClick={(event) => event.stopPropagation()}>
                {nodeEditor && (
                  <>
                    <h4>{t.locationEditor}</h4>
                    <div className="adminEditorGrid">
                      <label className="adminField"><span>ID</span><input value={nodeEditor.id} onChange={(event) => setNodeEditor((current) => (current ? { ...current, id: event.target.value } : current))} /></label>
                      <label className="adminField"><span>Tên điểm</span><input value={nodeEditor.label} onChange={(event) => setNodeEditor((current) => (current ? { ...current, label: event.target.value } : current))} /></label>
                      <label className="adminField"><span>Loại</span><input value={nodeEditor.type} onChange={(event) => setNodeEditor((current) => (current ? { ...current, type: event.target.value } : current))} /></label>
                      <label className="adminField"><span>{t.image}</span><input value={nodeEditor.image} onChange={(event) => setNodeEditor((current) => (current ? { ...current, image: event.target.value } : current))} /></label>
                      <label className="adminField"><span>{t.latitude}</span><input value={nodeEditor.lat} onChange={(event) => setNodeEditor((current) => (current ? { ...current, lat: Number(event.target.value) || current.lat } : current))} /></label>
                      <label className="adminField"><span>{t.longitude}</span><input value={nodeEditor.lng} onChange={(event) => setNodeEditor((current) => (current ? { ...current, lng: Number(event.target.value) || current.lng } : current))} /></label>
                      <label className="adminField"><span>Mở cửa</span><input value={nodeEditor.openingHour} onChange={(event) => setNodeEditor((current) => (current ? { ...current, openingHour: event.target.value } : current))} /></label>
                      <label className="adminField"><span>Đóng cửa</span><input value={nodeEditor.closingHour} onChange={(event) => setNodeEditor((current) => (current ? { ...current, closingHour: event.target.value } : current))} /></label>
                      <label className="adminField"><span>Mô tả</span><input value={nodeEditor.descriptionVi} onChange={(event) => setNodeEditor((current) => (current ? { ...current, descriptionVi: event.target.value } : current))} /></label>
                    </div>
                    <div className="adminEditorActions">
                      <button type="button" className="neutralBtn" onClick={() => setNodeEditor(null)}>{t.cancel}</button>
                      <button type="button" className="sectionAddBtn" onClick={saveNodeEditor}>{t.update}</button>
                    </div>
                  </>
                )}
                {memberEditor && (
                  <>
                    <h4>{t.memberEditor}</h4>
                    <div className="adminEditorGrid">
                      <input value={memberEditor.name} onChange={(event) => setMemberEditor((current) => (current ? { ...current, name: event.target.value } : current))} />
                      <input value={memberEditor.role} onChange={(event) => setMemberEditor((current) => (current ? { ...current, role: event.target.value } : current))} />
                      <input value={memberEditor.bio} onChange={(event) => setMemberEditor((current) => (current ? { ...current, bio: event.target.value } : current))} />
                      <input value={memberEditor.avatar} onChange={(event) => setMemberEditor((current) => (current ? { ...current, avatar: event.target.value } : current))} />
                    </div>
                    <div className="adminEditorActions">
                      <button type="button" className="neutralBtn" onClick={() => setMemberEditor(null)}>{t.cancel}</button>
                      <button type="button" className="sectionAddBtn" onClick={saveMemberEditor}>{t.update}</button>
                    </div>
                  </>
                )}
                {communityFeedbackEditor && (
                  <>
                    <h4>{t.adminCommunityFeedbackData}</h4>
                    <div className="adminEditorGrid">
                      <input value={communityFeedbackEditor.id} onChange={(event) => setCommunityFeedbackEditor((current) => (current ? { ...current, id: event.target.value } : current))} />
                      <input value={communityFeedbackEditor.avatar ?? ''} onChange={(event) => setCommunityFeedbackEditor((current) => (current ? { ...current, avatar: event.target.value } : current))} />
                      <input value={communityFeedbackEditor.user} onChange={(event) => setCommunityFeedbackEditor((current) => (current ? { ...current, user: event.target.value } : current))} />
                      <input value={communityFeedbackEditor.createdAt} onChange={(event) => setCommunityFeedbackEditor((current) => (current ? { ...current, createdAt: event.target.value } : current))} />
                      <input value={communityFeedbackEditor.comment} onChange={(event) => setCommunityFeedbackEditor((current) => (current ? { ...current, comment: event.target.value } : current))} />
                    </div>
                    <div className="adminEditorActions">
                      <button type="button" className="neutralBtn" onClick={() => setCommunityFeedbackEditor(null)}>{t.cancel}</button>
                      <button type="button" className="sectionAddBtn" onClick={saveCommunityFeedbackEditor}>{t.update}</button>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}
        </main>
      )}

      <footer className="siteFooter card">
        <h3>{t.footerSchool}</h3>
        <p><strong>{t.footerAddress}:</strong> {t.footerAddressValue}</p>
        <p><strong>{t.footerPhone}:</strong> <a href="tel:+84868433805">(+84)868.433.805</a></p>
        <p><strong>{t.footerEmail}:</strong> <a href="mailto:thuylinh1612006@gmail.com">thuylinh1612006@gmail.com</a></p>
        <div className="footerCopy">{t.footerCopy}</div>
      </footer>
    </div>
  );
}

export default App;

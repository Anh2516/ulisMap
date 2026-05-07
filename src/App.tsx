 import React, { useCallback, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockEdges, mockMembers, mockNodes, type CampusNode, type TeamMember } from './mockData';
import './App.css';
type RouteView = 'landing' | 'map' | 'about' | 'admin' | 'detail';
type RouteState = { view: RouteView; detailId: string };
type Language = 'vi' | 'en';
type ThemeMode = 'light' | 'dark';

const TYPE_LABELS: Record<Language, Record<string, string>> = {
  vi: { campus: 'Trường', gate: 'Cổng', hall: 'Hội trường', room: 'Phòng học', hub: 'Nút giao' },
  en: { campus: 'Campus', gate: 'Gate', hall: 'Hall', room: 'Room', hub: 'Hub' }
};
const STORAGE_KEY = 'vnu-map-nodes-v1';
const NAV_ITEMS: Array<{ key: 'landing' | 'map' | 'about'; path: string }> = [
  { key: 'landing', path: '/' },
  { key: 'map', path: '/thao-tac-ban-do' },
  { key: 'about', path: '/ve-chung-toi' }
];
const BRAND_LOGO_URL =
  'https://lh3.googleusercontent.com/u/0/d/1C6K22ihxiBsgVCghJ7BHQbSWKX7VEvY_=w2560-h1398-iv1?auditContext=prefetch';
const MEMBER_AVATAR_FALLBACKS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
];
const TEXT = {
  vi: {
    brand: 'Lạc lối ở ULIS',
    nav: { landing: 'Trang chủ', map: 'Thao tác bản đồ', about: 'Về chúng tôi' },
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
    mapTitle: 'Bản đồ khuôn viên',
    mapSub: 'Nền vệ tinh + popup thông tin.',
    openMaps: 'Mở trên Google Maps',
    aboutTitle: 'Về chúng tôi',
    aboutDesc: 'Nhóm dự án Lạc lối ở ULIS phát triển nền tảng bản đồ nội bộ cho sinh viên và giảng viên.',
    adminHint: 'Path ẩn: `/adminDashboard`. Sau khi sửa, bấm "Xuất mockData JSON" để lưu file dữ liệu.',
    adminMembers: 'Dữ liệu về chúng tôi',
    adminLocationData: 'Dữ liệu địa danh',
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
    nav: { landing: 'Home', map: 'Map Actions', about: 'About Us' },
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
    mapTitle: 'Campus map',
    mapSub: 'Satellite view + location popup.',
    openMaps: 'Open in Google Maps',
    aboutTitle: 'About us',
    aboutDesc: 'Lost at ULIS team builds an internal smart mapping platform for students and staff.',
    adminHint: 'Hidden path: `/adminDashboard`. Export JSON after editing to save your mock data.',
    adminMembers: 'About us data',
    adminLocationData: 'Location data',
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
  }
} as const;

function normalize(input: string) {
  return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
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
  if (pathname === '/adminDashboard') return 'admin';
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
function searchDestination(query: string, nodes: CampusNode[]) {
  const keyword = normalize(query);
  if (!keyword) return null;
  return nodes.find((node) => normalize(node.label).includes(keyword) || node.aliases.some((alias) => normalize(alias).includes(keyword))) ?? null;
}
function dijkstra(start: string, end: string, nodes: CampusNode[]) {
  const graph = new Map<string, Array<{ to: string; distance: number }>>();
  nodes.forEach((node) => graph.set(node.id, []));
  mockEdges.forEach((edge) => {
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
    rating: typeof rawNode.rating === 'number' ? rawNode.rating : fallback.rating,
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
  const [nodeEditor, setNodeEditor] = useState<CampusNode | null>(null);
  const [nodeEditorMode, setNodeEditorMode] = useState<'create' | 'edit'>('edit');
  const [nodeEditorOriginalId, setNodeEditorOriginalId] = useState<string | null>(null);
  const [memberEditor, setMemberEditor] = useState<TeamMember | null>(null);
  const [memberEditorMode, setMemberEditorMode] = useState<'create' | 'edit'>('edit');
  const [memberEditorIndex, setMemberEditorIndex] = useState<number | null>(null);
  const [adminDataFilter, setAdminDataFilter] = useState<'all' | 'locations' | 'members'>('all');
  const [mapQuery, setMapQuery] = useState('');
  const [landingQuery, setLandingQuery] = useState('');
  const [landingTypeFilter, setLandingTypeFilter] = useState<string>('all');
  const [from, setFrom] = useState('gate-main');
  const [selectedId, setSelectedId] = useState<string>('');
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const destination = useMemo(() => searchDestination(mapQuery, nodes), [mapQuery, nodes]);
  const mapSuggestions = useMemo(() => {
    const keyword = normalize(mapQuery);
    if (!keyword) return [];
    return nodes
      .filter((node) => normalize(node.label).includes(keyword) || node.aliases.some((alias) => normalize(alias).includes(keyword)))
      .slice(0, 6);
  }, [mapQuery, nodes]);
  const activeId = selectedId || destination?.id || '';
  const route = useMemo(() => {
    if (!activeId || from === activeId) return null;
    return dijkstra(from, activeId, nodes);
  }, [from, activeId, nodes]);
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
  const fromNode = nodeById.get(from);
  const detailNode = nodeById.get(routeState.detailId);
  const routeView = routeState.view;
  const t = TEXT[language];
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
    (key: 'landing' | 'map' | 'about') => {
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
      rating: 4,
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
  const exportMockData = () => {
    const payload = {
      mockNodes: nodes,
      mockEdges,
      mockMembers: members
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mockData.generated.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
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
            {NAV_ITEMS.filter((item) => item.key !== 'about').map((item) => (
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
          {NAV_ITEMS.filter((item) => item.key === 'about').map((item) => (
            <button
              key={item.key}
              className={`navBtn ${isNavActive(item.key) ? 'activeNav' : ''}`}
              type="button"
              onClick={() => navigate(item.path)}
            >
              {t.nav[item.key]}
            </button>
          ))}
          <button type="button" className="utilityBtn" onClick={() => setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))}>
            {t.lang}
          </button>
          <button type="button" className="utilityBtn" onClick={() => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}>
            {t.theme}
          </button>
        </div>
      </header>

      {routeView === 'landing' && (
        <main className="landingPage">
          <section className="landingShell">
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
              <section className="card">
                <h3>{t.feedback}</h3>
                <div className="feedbackList">
                  {detailNode.feedbacks.map((item) => (
                    <article key={`${item.user}-${item.createdAt}`} className="feedbackItem">
                      <strong>{item.user}</strong>
                      <span>{item.rating}/5 • {item.createdAt}</span>
                      <p>{item.comment}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <div className="detailInfo">
              <section className="card detailHeroCard">
                <h3>{(detailNode.rating ?? 0).toFixed(1)} / 5</h3>
                <p>{t.convenient}</p>
                <div className="detailBadgeRow">
                  <span className="statusBadge">{getTypeLabel(detailNode.type, language)}</span>
                  <span className="statusBadge">{t.internalRoute}</span>
                </div>
                <p className="detailCoord">{t.coordsPrefix}: {detailNode.lat}, {detailNode.lng}</p>
              </section>
              <section className="card">
                <h3>{t.detailDescription}</h3>
                <p>{language === 'vi' ? detailNode.descriptionVi : detailNode.descriptionEn}</p>
              </section>
              <section className="card detailMetaGrid">
                <article>
                  <h4>{t.openClose}</h4>
                  <p>{t.openAt}: {detailNode.openingHour}</p>
                  <p>{t.closeAt}: {detailNode.closingHour}</p>
                </article>
                <article>
                  <h4>{t.highlights}</h4>
                  <p>{(detailNode.rating ?? 0).toFixed(1)} / 5</p>
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
        <main className="content">
          <aside className="panel">
            <section className="card">
              <h2>{t.searchTitle}</h2>
              <label htmlFor="search">{t.searchLabel}</label>
              <div className="searchSuggestWrap">
                <input
                  id="search"
                  value={mapQuery}
                  onChange={(event) => {
                    setMapQuery(event.target.value);
                    setSelectedId('');
                  }}
                  placeholder={t.searchPlaceholder}
                />
                {mapSuggestions.length > 0 && (
                  <div className="suggestList">
                    <span>{t.suggestionTitle}</span>
                    {mapSuggestions.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          setMapQuery(node.label);
                          setSelectedId(node.id);
                        }}
                      >
                        {node.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {destination && <p className="hit">{t.foundPrefix}: {destination.label}</p>}
              <label htmlFor="from">{t.fromLabel}</label>
              <select id="from" value={from} onChange={(event) => setFrom(event.target.value)}>
                {nodes.filter((node) => node.type === 'gate' || node.type === 'campus').map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
              </select>
              <label htmlFor="to">{t.toLabel}</label>
              <select id="to" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                <option value="">{t.chooseDestination}</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </section>
            <section className="routeBox card">
              <h2>{t.routeDetail}</h2>
              {activeNode && route ? (
                <>
                  <p>{t.toPrefix} <strong>{activeNode.label}</strong>: ~{route.distance} m</p>
                  <ol>{route.path.map((id) => <li key={id}>{nodeById.get(id)?.label}</li>)}</ol>
                  <div className="steps">{routeSegments.map((segment) => <span key={segment}>{segment}</span>)}</div>
                </>
              ) : activeNode ? (
                <p>{t.noRoute}</p>
              ) : (
                <p>{t.chooseDestination}</p>
              )}
            </section>
          </aside>
          <section className="mapSection card">
            <div className="mapHeader"><h2>{t.mapTitle}</h2><p>{t.mapSub}</p></div>
            <div className="mapCanvas">
              <MapContainer center={[21.0377, 105.7868]} zoom={16} className="leafletMap" scrollWheelZoom>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {nodes.map((node) => (
                  <CircleMarker key={node.id} center={[node.lat, node.lng]} radius={activeId === node.id ? getMarkerRadius(node.type) + 3 : getMarkerRadius(node.type)} pathOptions={{ color: '#ffffff', weight: 2, fillColor: getMarkerColor(node.type), fillOpacity: 0.95 }} eventHandlers={{ click: () => setSelectedId(node.id) }}>
                    <Tooltip permanent direction="top" offset={[0, -8]} opacity={1} className="mapLabel">{node.label}</Tooltip>
                    <Popup>
                      <div className="mapPopup">
                        <h3>{node.label}</h3>
                        <p>{getTypeLabel(node.type, language)}</p>
                        <a href={`https://www.google.com/maps/dir/?api=1&origin=${fromNode?.lat ?? node.lat},${fromNode?.lng ?? node.lng}&destination=${node.lat},${node.lng}&travelmode=walking`} target="_blank" rel="noreferrer">{t.openMaps}</a>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
              {activeNode && <div className="mapInfoCard"><strong>{activeNode.label}</strong><span>{getTypeLabel(activeNode.type, language)} • {route?.distance ?? 0}m</span></div>}
            </div>
          </section>
        </main>
      )}

      {routeView === 'about' && (
        <main className="aboutPage card">
          <h1>{t.aboutTitle}</h1>
          <p>{t.aboutDesc}</p>
          <div className="aboutGrid">
            {members.map((member, index) => (
              <article key={member.name}>
                <img src={getMemberAvatar(member, index)} alt={member.name} className="memberAvatar" />
                <h3>{member.name}</h3>
                <p><strong>{member.role}</strong></p>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
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
                    <th>Rating</th>
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
                      <td>{node.rating}</td>
                      <td className="adminActionCell">
                        <button type="button" className="neutralBtn" onClick={() => openEditNodeEditor(node)}>{t.edit}</button>
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
                        <button type="button" className="neutralBtn" onClick={() => openEditMemberEditor(member, index)}>{t.edit}</button>
                        <button type="button" className="dangerBtn" onClick={() => deleteMember(index)}>{t.delete}</button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>}
          {(nodeEditor || memberEditor) && (
            <div
              className="adminModalBackdrop"
              onClick={() => {
                setNodeEditor(null);
                setMemberEditor(null);
              }}
            >
              <section className="adminModal card" onClick={(event) => event.stopPropagation()}>
                {nodeEditor && (
                  <>
                    <h4>{t.locationEditor}</h4>
                    <div className="adminEditorGrid">
                      <input value={nodeEditor.id} onChange={(event) => setNodeEditor((current) => (current ? { ...current, id: event.target.value } : current))} />
                      <input value={nodeEditor.label} onChange={(event) => setNodeEditor((current) => (current ? { ...current, label: event.target.value } : current))} />
                      <input value={nodeEditor.type} onChange={(event) => setNodeEditor((current) => (current ? { ...current, type: event.target.value } : current))} />
                      <input value={nodeEditor.image} onChange={(event) => setNodeEditor((current) => (current ? { ...current, image: event.target.value } : current))} />
                      <input value={nodeEditor.lat} onChange={(event) => setNodeEditor((current) => (current ? { ...current, lat: Number(event.target.value) || current.lat } : current))} />
                      <input value={nodeEditor.lng} onChange={(event) => setNodeEditor((current) => (current ? { ...current, lng: Number(event.target.value) || current.lng } : current))} />
                      <input value={nodeEditor.openingHour} onChange={(event) => setNodeEditor((current) => (current ? { ...current, openingHour: event.target.value } : current))} />
                      <input value={nodeEditor.closingHour} onChange={(event) => setNodeEditor((current) => (current ? { ...current, closingHour: event.target.value } : current))} />
                      <input value={nodeEditor.rating} onChange={(event) => setNodeEditor((current) => (current ? { ...current, rating: Number(event.target.value) || current.rating } : current))} />
                      <input value={nodeEditor.descriptionVi} onChange={(event) => setNodeEditor((current) => (current ? { ...current, descriptionVi: event.target.value } : current))} />
                      <input value={nodeEditor.descriptionEn} onChange={(event) => setNodeEditor((current) => (current ? { ...current, descriptionEn: event.target.value } : current))} />
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
              </section>
            </div>
          )}
        </main>
      )}

      <footer className="siteFooter card">
        <h3>{t.footerSchool}</h3>
        <p><strong>{t.footerAddress}:</strong> {t.footerAddressValue}</p>
        <p><strong>{t.footerPhone}:</strong> <a href="tel:+842437547269">(+84)243.754.7269</a></p>
        <p><strong>{t.footerFax}:</strong> (+84)243.754.8057</p>
        <p><strong>{t.footerEmail}:</strong> <a href="mailto:dhnn@vnu.edu.vn">dhnn@vnu.edu.vn</a></p>
        <div className="footerCopy">{t.footerCopy}</div>
      </footer>
    </div>
  );
}

export default App;

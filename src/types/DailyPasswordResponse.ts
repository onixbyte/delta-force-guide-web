export interface PasswordItem {
  mapName: string;   // 地图名称，如 "零号大坝"
  password: string;  // 四位数字密码，如 "6460"
}

// data 字段的类型
export interface DailyPasswordData {
  updateDate: string;       // 如 "06月14日每日密码已更新"
  totalCount: number;       // 总数，这里固定为 5
  passwords: PasswordItem[]; // 密码数组
  source: string;           // 如 "三角洲行动每日密码"
  lastUpdated: string;      // 最后更新时间字符串，如 "2026-06-14 16:54:46"
  timestamp: number;        // Unix 时间戳（秒），如 1781427286
}

// 根返回值的类型
export interface DailyPasswordResponse {
  status: 'success' | 'error'; // 可根据实际调整字面量，或直接用 string
  message: string;             // 如 "每日密码获取成功"
  data: DailyPasswordData;
  metadata: {
    version: string;   // 如 "1.0"
    author: string;    // 如 "tmini.net"
  };
}
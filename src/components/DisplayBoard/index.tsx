import React, { useState, useEffect } from 'react';
import './DisplayBoard.css';
import { DailyPasswordApi } from '@/api';
import { DailyPasswordData,PasswordItem } from '@/types/DailyPasswordResponse';

// 单条数据接口
interface DisplayItem {
  mapName: string;
  password: number;
}

// 组件 Props 接口（支持动态获取 + 静态传入）
interface DisplayBoardProps {
  /** 可选：静态数据，若同时提供 fetchData，则静态数据仅作为初始值 */
  items?: PasswordItem[];
  /** 可选：异步获取数据的函数，返回值应为 DisplayItem[] */
  fetchData?: () => Promise<PasswordItem[]>;
  /** 可选：自动刷新间隔（毫秒），默认不自动刷新 */
  refreshInterval?: number;
  /** 可选：是否强制要求数组长度为 5（默认 true） */
  enforceLength?: boolean;
}

/**
 * 头部导航栏显示框组件
 * - 支持静态数据传入
 * - 支持动态数据获取（通过 fetchData 属性）
 * - 自动处理加载状态（显示简短占位符）
 * - 紧凑设计（高 48px），荧光绿主题，计算器风格密码
 */
const DisplayBoard: React.FC<DisplayBoardProps> = ({
  items: staticItems,
  fetchData,
  refreshInterval,
  enforceLength = true,
}) => {
  const [items, setItems] = useState<PasswordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(!!fetchData);

  const defaultItems: PasswordItem[] = [
    { mapName: 'Alex', password: '1234' },
    { mapName: 'Jamie', password: '5678' },
    { mapName: 'Taylor', password: '9012'},
    { mapName: 'Jordan', password: '3456' },
    { mapName: 'Casey', password: '7890' },
  ];

  // 确保数组长度为 5（若 enforceLength 为 true）
  const ensureLength = (data: PasswordItem[]): PasswordItem[] => {
    if (!enforceLength) return data;
    if (data.length === 5) return data;
    if (data.length < 5) {
      // 不足则用默认数据补齐，实际项目中可自定义补齐逻辑
      return [...data, ...defaultItems.slice(data.length, 5)];
    }
    // 超过5个则截取前5个
    return data.slice(0, 5);
  };

  // 加载数据的函数
  const loadData = async () => {
    if (DailyPasswordApi.getDailyPassword) {
      setLoading(true);
      try {
        const dynamicData = await DailyPasswordApi.getDailyPassword();
        const finalData = ensureLength(dynamicData);
        setItems(finalData);
      } catch (error) {
        console.error('动态获取密码数据失败', error);
        // 出错时使用静态数据或默认数据兜底
        if (staticItems && staticItems.length > 0) {
          setItems(ensureLength(staticItems));
        } else {
          setItems(defaultItems);
        }
      } finally {
        setLoading(false);
      }
    } else if (staticItems) {
      // 仅静态数据模式
      setItems(ensureLength(staticItems));
    } else {
      // 无任何数据源，使用默认
      setItems(defaultItems);
    }
  };

  // 初次加载 & fetchData 变化时重新拉取
  useEffect(() => {
    loadData();
  }, [fetchData]); // 注意：staticItems 变化不会自动触发重新拉取，如需可自行添加依赖

  // 定时刷新逻辑
  useEffect(() => {
    if (!fetchData || !refreshInterval || refreshInterval <= 0) return;
    const timer = setInterval(() => {
      loadData();
    }, refreshInterval);
    return () => clearInterval(timer);
  }, [fetchData, refreshInterval]);

  // 辅助：格式化密码为四位数字（计算器风格）
  const formatPassword = (pwd: string | number): string => {
    const str = String(pwd).replace(/\D/g, '');
    if (str.length >= 4) return str.slice(0, 4);
    return str.padStart(4, '0');
  };

  // 加载状态时显示简洁的占位符（保持高度不变，避免布局抖动）
  if (loading && items.length === 0) {
    return (
      <div className="display-board loading">
        <div className="loading-placeholder">加载密码...</div>
      </div>
    );
  }

  return (
    <div className="display-board">
      {items.map((item, index) => (
        <div className="display-item" key={`${item.mapName}-${index}`}>
          <span className="item-name">{item.mapName}</span>
          <div className="calculator-digit">
          <div>
            {formatPassword(item.password)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayBoard;
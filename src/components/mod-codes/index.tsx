// ModCodes.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, Col, Pagination, Row, Tag, Typography, Button, Popconfirm, Space, Select, App } from "antd";
import { Link } from "react-router-dom";
import { ModificationApi, TagApi } from "@/api";
import { Modification } from "@/types";
import ModificationCreateModal from "@/components/modification-create-modal";
import ModificationEditModal from "@/components/modification-edit-modal";
import { useAppSelector } from "@/hooks/store";

const pageSize = 10; // 常量，不需要 useState

interface ModCodesProps {
  firearmId: string; // 从父组件传入
}

export default function ModCodes({ firearmId }: ModCodesProps) {
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.auth.user);

  // ✅ 所有 useState 必须放在组件函数内部
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingModification, setEditingModification] = useState<Modification | null>(null);
  const [loading, setLoading] = useState(false);
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 获取标签选项
  useEffect(() => {
    const _firearmId = firearmId ? Number(firearmId) : undefined;
    if (_firearmId) {
      TagApi.getTags(_firearmId).then(setTagOptions);
    }
  }, [firearmId]);

  // 加载改枪码列表
  const loadModifications = useCallback(async () => {
    const numericId = firearmId
    if (!numericId) return;
    setLoading(true);
    try {
      const pagedData = await ModificationApi.getModifications({
        page: page - 1,
        size: pageSize,
        sortBy: "id",
        direction: "ASC",
        firearmId: numericId, // 使用数字类型
        tags: selectedTags,
      });
      setModifications(pagedData.items);
      setTotal(pagedData.totalElements);
    } finally {
      setLoading(false);
    }
  }, [firearmId, page, selectedTags]);

  useEffect(() => {
    loadModifications();
  }, [loadModifications]);

  const handleDelete = async (modification: Modification) => {
    setDeletingId(modification.id);
    try {
      await ModificationApi.removeModification(modification.id);
      message.success("删除成功");
      if (modifications.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadModifications();
      }
    } catch {
      message.error("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  // 当 firearmId 或标签改变时重置分页
  useEffect(() => {
    setPage(1);
  }, [firearmId, selectedTags]);

  const parsedFirearmId = useMemo(() => {
    const value = Number(firearmId);
    return isNaN(value) ? undefined : value;
  }, [firearmId]);

  if (!parsedFirearmId) {
    return <Typography.Text type="secondary">无效的武器 ID</Typography.Text>;
  }
const tagColors = [
  '#e28010', // 青绿
  '#0EA5E9', // 天蓝
  '#8B5CF6', // 紫色
  '#F59E0B', // 琥珀
  '#EF4444', // 红色
  '#EC4899', // 粉红
];


  return (
    <div className="bg-#1e1e1e">
      <div className="mb-4 flex items-start justify-between gap-4 bg-#1e1e1e">
        <div className="flex flex-wrap items-center justify-end gap-3 bg-#1e1e1e">
          <Space wrap>
            <span>标签：</span>
            <Select<string[]>
              mode="multiple"
              allowClear
              placeholder="请选择标签"
              className="w-64"
              value={selectedTags}
              options={tagOptions.map((tag) => ({ value: tag, label: tag }))}
              onChange={(values) => {
                setSelectedTags(values);
              }}
            />
            {firearmId && <Tag color="geekblue">武器 ID: {firearmId}</Tag>}
            {(firearmId || selectedTags.length > 0) && (
              <Link to="/mod-codes">
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedTags([]);
                    setPage(1);
                  }}
                >
                  清除筛选
                </Button>
              </Link>
            )}
          </Space>
          {user && (
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              添加改装
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Row gutter={[16, 16]}>
          {modifications.map((modification) => (
            <Col key={modification.id} span={24}>
              <Card
                title={modification.name}
                extra={
                  user ? (
                    <div className="flex items-center gap-1">
                      <Button type="link" size="small" onClick={() => setEditingModification(modification)}>
                        编辑
                      </Button>
                      <Popconfirm
                        title="确认删除改枪码"
                        description={`确定要删除 ${modification.name} 吗？该操作不可撤销。`}
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true, loading: deletingId === modification.id }}
                        onConfirm={() => handleDelete(modification)}
                      >
                        <Button type="link" danger size="small" loading={deletingId === modification.id}>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  ) : null
                }
                variant="outlined"
                styles={{
                  root: {
                    background: '#35333385'
                  },
                  header: { minHeight: 56 },
                }}
              >
                <div className="flex flex-col gap-3">
                  {/* 改枪码行 */}
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <strong style={{
                        color: '#10E28C',
                        fontWeight:800
                      }}>改枪码：</strong>
                      <code className="rounded" style={{
                          color: '#10E28C',
                          fontWeight:600
                      }}>
                        {modification.code}
                      </code>
                    </span>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(modification.code)}
                    >
                      复制
                    </Button>
                  </div>

                  {/* 作者 */}
                  <div className="flex items-center justify-between gap-2">
                    <Typography.Text style={{
                        color:'#B59728',
                        fontWeight:800
                      }}>
                      <strong>作者：</strong>
                      {modification.author || "未知"}
                    </Typography.Text>
                  </div>
                  {/* 标签列表 */}
                  {(modification.tags?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(modification.tags || []).map((tag,idx) => (
                        <Tag key={`${modification.id}-${tag}`} style={{
                          background: tagColors[idx % tagColors.length],
                          font: '800'
                        }}>{tag}</Tag>
                      ))}
                    </div>
                  )}

                  {/* 配件配置区域 */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Typography.Text strong>配件配置：</Typography.Text></div>
                    {(modification.accessories?.length || 0) > 0 ? (
                      <div className="mt-2 overflow-x-auto">
                        <div className="grid min-w-[275px] grid-cols-6 gap-2">
                          {(modification.accessories || []).map((accessory, accessoryIndex) => (
                            <div
                              key={`${modification.id}-accessory-${accessoryIndex}`}
                              className="" style={{
                                borderRadius: '0.25rem',
                                border: '2px solid #10E28C',
                                padding: '0.5rem',
                                background: '#16343b96'

                              }}
                            >
                              <div className="flex items-center justify-between gap-2 rounded px-2 py-1">
                                <Typography.Text className="mr-0 text-cyan-400" style={{
                                  color: '#10E28C',
                                }}>
                                  {accessory.slotName || "未填写槽位"}
                                </Typography.Text>
                                <Typography.Text className="mr-0 text-cyan-300" style={{
                                  color: '#ffffff',
                                }}>
                                  {accessory.accessoryName || "未填写配件"}
                                </Typography.Text>
                              </div>
                              {(accessory.tunings?.length || 0) > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {accessory.tunings.map((tuning, tuningIndex) => (
                                    <Tag
                                      key={`${modification.id}-${accessoryIndex}-tuning-${tuningIndex}`}
                                      style={{
                                        background: '#10E28C',
                                      }}
                                    >
                                      {tuning.tuningName || "未命名"}: {tuning.tuningValue ?? "-"}
                                    </Tag>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Typography.Text type="secondary" className="mt-1 block">
                        暂无配件信息
                      </Typography.Text>
                    )}
                  </div>

                  {/* 备注 */}
                  <div className="flex items-center justify-between gap-2">
                    <Typography.Paragraph
                      style={{ marginBottom: 0 }}
                      type="secondary"
                      ellipsis={{ rows: 3 }}
                    >
                      {modification.note || "暂无备注"}
                    </Typography.Paragraph>
                  </div>
                  {/* 视频链接 */}
                  <div className="flex items-center justify-between gap-2">
                    {modification.videoUrl && (
                      <div>
                        <a
                          href={modification.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          查看视频
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          ))}

          {modifications.length === 0 && (
            <Col span={24}>
              <Card>
                <Typography.Text type="secondary">暂无改枪码数据</Typography.Text>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      <div className="flex justify-end">
        <Pagination
          align="end"
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(nextPage) => {
            setPage(nextPage);
          }}
          showSizeChanger={false}
        />
      </div>

      <ModificationCreateModal
        open={createModalOpen}
        defaultFirearmId={parsedFirearmId}
        lockedFirearmId={parsedFirearmId}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          void loadModifications();
        }}
      />

      <ModificationEditModal
        open={!!editingModification}
        modification={editingModification}
        lockedFirearmId={parsedFirearmId}
        onCancel={() => setEditingModification(null)}
        onSuccess={() => {
          setEditingModification(null);
          void loadModifications();
        }}
      />
    </div>
  );
}
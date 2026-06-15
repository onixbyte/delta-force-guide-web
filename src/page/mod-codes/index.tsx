import {
  App,
  Button,
  Card,
  Col,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ModificationApi, TagApi } from "@/api"
import ModificationCreateModal from "@/components/modification-create-modal"
import ModificationEditModal from "@/components/modification-edit-modal"
import { useAppSelector } from "@/store/hooks"
import { Modification } from "@/types"

const pageSize = 10

export default function ModCodesPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()
  const firearmId = useMemo(() => searchParams.get("firearmId") || undefined, [searchParams])
  const parsedFirearmId = useMemo(() => {
    if (!firearmId) {
      return undefined
    }

    const value = Number(firearmId)
    return Number.isFinite(value) ? value : undefined
  }, [firearmId])

  const [page, setPage] = useState<number>(1)
  const [modifications, setModifications] = useState<Modification[]>([])
  const [tagOptions, setTagOptions] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [total, setTotal] = useState<number>(0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingModification, setEditingModification] = useState<Modification | null>(null)

  useEffect(() => {
    const _firearmId = firearmId ? +firearmId : void 0
    TagApi.getTags(_firearmId).then((tags) => {
      setTagOptions(tags)
    })
  }, [firearmId])

  const loadModifications = useCallback(async () => {
    return ModificationApi.getModifications({
      page: page - 1,
      size: pageSize,
      sortBy: "id",
      direction: "DESC",
      firearmId,
      tags: selectedTags,
    }).then((pagedData) => {
      setModifications(pagedData.items)
      setTotal(pagedData.totalElements)
    })
  }, [page, firearmId, selectedTags])

  useEffect(() => {
    void loadModifications()
  }, [loadModifications])

  async function handleDelete(modification: Modification) {
    if (!user) {
      return
    }

    setDeletingId(modification.id)
    try {
      await ModificationApi.removeModification(modification.id)
      message.success("改枪码删除成功")
      if (modifications.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        void loadModifications()
      }
    } catch {
      message.error("改枪码删除失败，请稍后重试")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [firearmId])

  useEffect(() => {
    setPage(1)
  }, [selectedTags])

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-4">
        <Typography.Title level={4} className="mb-0!">
          改枪码列表
        </Typography.Title>
        <div className="flex flex-wrap items-center justify-end gap-3">
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
                setSelectedTags(values)
              }}
            />
            {firearmId && <Tag color="geekblue">武器 ID: {firearmId}</Tag>}
            {(firearmId || selectedTags.length > 0) && (
              <Link to="/mod-codes">
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedTags([])
                    setPage(1)
                  }}>
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
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setEditingModification(modification)}>
                        编辑
                      </Button>
                      <Popconfirm
                        title="确认删除改枪码"
                        description={`确定要删除 ${modification.name} 吗？该操作不可撤销。`}
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true, loading: deletingId === modification.id }}
                        onConfirm={() => handleDelete(modification)}>
                        <Button
                          type="link"
                          danger
                          size="small"
                          loading={deletingId === modification.id}>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  ) : null
                }
                variant="outlined"
                styles={{
                  header: { minHeight: 56 },
                }}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <strong>改枪码：</strong>
                      <code className="bg-gray-400 px-2 py-1 rounded text-sm text-white">
                        {modification.code}
                      </code>
                    </span>
                    <Button
                      type="text"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(modification.code)}>
                      复制
                    </Button>
                  </div>

                  <Typography.Text>
                    <strong>作者：</strong>
                    {modification.author || "未知"}
                  </Typography.Text>

                  {(modification.tags?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(modification.tags || []).map((tag) => (
                        <Tag key={`${modification.id}-${tag}`}>{tag}</Tag>
                      ))}
                    </div>
                  )}

                  <div>
                    <Typography.Text strong>配件配置：</Typography.Text>
                    {(modification.accessories?.length || 0) > 0 ? (
                      <div className="mt-2 overflow-x-auto">
                        <div className="grid min-w-275 grid-cols-5 gap-2">
                          {(modification.accessories || []).map((accessory, accessoryIndex) => (
                            <div
                              key={`${modification.id}-accessory-${accessoryIndex}`}
                              className="rounded border border-gray-100 p-2">
                              <div className="flex items-center justify-between gap-2 rounded bg-gray-50 px-2 py-1">
                                <Typography color="blue" className="mr-0">
                                  {accessory.slotName || "未填写槽位"}
                                </Typography>
                                <Typography className="mr-0 text-[#4C1D95]">
                                  {accessory.accessoryName || "未填写配件"}
                                </Typography>
                              </div>
                              {(accessory.tunings?.length || 0) > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {accessory.tunings.map((tuning, tuningIndex) => (
                                    <Tag
                                      key={`${modification.id}-${accessoryIndex}-tuning-${tuningIndex}`}
                                      color="geekblue">
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
                      <Typography.Text type="secondary" className="block mt-1">
                        暂无配件信息
                      </Typography.Text>
                    )}
                  </div>

                  <Typography.Paragraph
                    style={{ marginBottom: 0 }}
                    type="secondary"
                    ellipsis={{ rows: 3 }}>
                    {modification.note || "暂无备注"}
                  </Typography.Paragraph>

                  {modification.videoUrl && (
                    <div>
                      <a href={modification.videoUrl} target="_blank" rel="noopener noreferrer">
                        查看视频
                      </a>
                    </div>
                  )}
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
            setPage(nextPage)
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
          setCreateModalOpen(false)
          void loadModifications()
        }}
      />

      <ModificationEditModal
        open={!!editingModification}
        modification={editingModification}
        lockedFirearmId={parsedFirearmId}
        onCancel={() => setEditingModification(null)}
        onSuccess={() => {
          setEditingModification(null)
          void loadModifications()
        }}
      />
    </>
  )
}

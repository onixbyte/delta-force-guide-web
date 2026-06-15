import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FirearmApi } from "@/api"
import FirearmCreateModal from "@/components/firearm-create-modal"
import FirearmEditModal from "@/components/firearm-edit-modal"
import ModCodes from "@/components/mod-codes"
import { useAppSelector } from "@/hooks/store"
import { Firearm, FirearmType } from "@/types"
import { Button, Card, Col, Pagination, Popconfirm, Row, Select, Tag, Typography, App } from "antd"
import { ConfigProvider, theme } from 'antd';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';


const firearmTypeText: Record<FirearmType, string> = {
  RIFLE: "步枪",
  SUB_MACHINE_GUN: "冲锋枪",
  SHOTGUN: "霰弹枪",
  LIGHT_MACHINE_GUN: "轻机枪",
  DESIGNATED_MARKSMAN_RIFLE: "射手步枪",
  SNIPER_RIFLE: "狙击步枪",
  PISTOL: "手枪",
  SPECIAL: "特殊",
}



const darkTheme = {
  algorithm: theme.darkAlgorithm,

  // token: { colorPrimary: '#00b96b' },
};

const allTypeValue = "ALL"
type FirearmTypeFilter = FirearmType | typeof allTypeValue

function asDps(fireRate: number, damage: number) {
  return ((fireRate / 60) * damage).toFixed(2)
}

export default function FirearmsPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { message } = App.useApp()
  const [page, setPage] = useState<number>(1)
  const [typeFilter, setTypeFilter] = useState<FirearmTypeFilter>(allTypeValue)
  const [firearms, setFirearms] = useState<Firearm[]>([])
  const [total, setTotal] = useState<number>(0)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingFirearm, setEditingFirearm] = useState<Firearm | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadFirearms = useCallback(async () => {
    const pagedData = await FirearmApi.getFirearms({
      page: page - 1,
      size: 12,
      sortBy: "id",
      direction: "ASC",
      type: typeFilter === allTypeValue ? undefined : typeFilter,
    })
    setFirearms(pagedData.items)
    setTotal(pagedData.totalElements)
  }, [page, typeFilter])

  const [expandedId, setExpandedId] = useState<number | null>(null);




  useEffect(() => {
    void loadFirearms()
  }, [loadFirearms])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);


  async function handleDelete(firearm: Firearm) {
    setDeletingId(firearm.id)
    try {
      await FirearmApi.removeFirearm(firearm.id)
      message.success("武器删除成功")
      if (firearms.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        void loadFirearms()
      }
    } catch {
      message.error("武器删除失败，请稍后重试")
    } finally {
      setDeletingId(null)
    }
  }
  return (
    <>
      <ConfigProvider theme={darkTheme}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {user && (
              <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                新建武器
              </Button>
            )}
          </div>
          <Select<FirearmTypeFilter>
            className="w-full sm:w-64"
            value={typeFilter}
            options={[
              { value: allTypeValue, label: "全部类型" },
              ...Object.entries(firearmTypeText).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
            onChange={(nextType) => {
              setPage(1)
              setTypeFilter(nextType)
            }}
          />
        </div>
        <div className="mb-6">
          <Row gutter={[16, 16]}>
            {firearms.map((firearm) => (
              <Col key={firearm.id} xs={24} md={24} lg={24}>

                <Card
                  className="hex-bg border-5px-#142c38"
                  extra={
                    user ? (
                      <div className="flex items-center gap-1">
                        <Button type="link" size="small" onClick={() => setEditingFirearm(firearm)}>
                          编辑
                        </Button>
                        <Popconfirm
                          title="确认删除武器"
                          description={`确定要删除 ${firearm.name} 吗？该操作不可撤销。`}
                          okText="删除"
                          cancelText="取消"
                          okButtonProps={{ danger: true, loading: deletingId === firearm.id }}
                          onConfirm={() => handleDelete(firearm)}>
                          <Button type="link" danger size="small" loading={deletingId === firearm.id}>
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                    ) : null
                  }
                  variant="outlined"
                  style={{
                    height: '100%', display: 'flex', flexDirection: 'column'
                  }}
                  styles={{
                    root: {
                      border: '1px solid #313131'
                    },
                    header: {
                      borderBottom: '1px solid #303030',
                    },
                    body: {
                      flex: 1,
                      overflow: 'auto',
                      padding: '12px',

                    },
                    actions: {
                      flexShrink: 0,
                      background: '#1e1e1e',
                      display: 'flex'
                    }
                  }}
                  actions={[
                    <div>
                      <Collapse
                        expandIcon={() => null}
                        styles={
                          {
                            root: {
                              background: '#1e1e1e',
                            }
                          }
                        }
                        items={[{
                          key: '1',
                          label: (
                            <Button
                              variant="outlined"
                              styles={{
                                root: {
                                  color: '#10E28C',
                                  border: '1px solid #10E28C',
                                  background: '#16343b96',
                                  width: '20%',
                                }
                              }}
                            >
                              查看改枪码
                            </Button>
                          ),
                          children: <ModCodes firearmId={String(firearm.id)} />
                        }]}
                      />
                    </div>,
                  ]}>
                  <div className="flex flex-col gap-3">
                    <div className="lmr-container">
                      <div className="lmr-left">
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#555555',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500',
                            letterSpacing: '0.5px'
                          }}>
                            {firearm.name}
                          </span>
                          <span className="flex items-center justify-between"
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#2d4f5796',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              fontWeight: '500',
                              letterSpacing: '0.5px'
                            }}>
                            {firearmTypeText[firearm.type]}

                          </span></div>
                      </div>
                      <div className="lmr-middle">
                        <div style={{
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          letterSpacing: '0.5px'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // 最小宽度160px
                            gap: '12px',
                          }}>
                            {/* 武器输出等级 */}
                            <div style={{
                              border: '2px solid #10E28C',
                              backgroundColor: '#16343b96',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                padding: '4px 0px',
                                borderRadius: '4px',
                                color: '#10E28C',
                                fontSize: '13px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                whiteSpace: 'nowrap',
                                textAlign: 'center'
                              }}>
                                武器输出等级
                              </div>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#ffffff'
                              }}>
                                {firearm.level}
                              </div>
                            </div>

                            {/* 子弹口径 */}
                            <div style={{
                              border: '2px solid #10E28C',
                              backgroundColor: '#16343b96',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                color: '#10E28C',
                                fontSize: '13px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                whiteSpace: 'nowrap'
                              }}>
                                子弹口径
                              </div>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#ffffff'
                              }}>
                                {firearm.calibre}
                              </div>
                            </div>

                            {/* 每秒甲伤 */}
                            <div style={{
                              border: '2px solid #10E28C',
                              backgroundColor: '#16343b96',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                color: '#10E28C',
                                fontSize: '13px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                whiteSpace: 'nowrap'
                              }}>
                                每秒甲伤
                              </div>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#ffffff'
                              }}>
                                {asDps(firearm.fireRate, firearm.armourDamage)}
                              </div>
                            </div>

                            {/* 每秒肉伤 */}
                            <div style={{
                              border: '2px solid #10E28C',
                              backgroundColor: '#16343b96',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                padding: '4px 12px',
                                borderRadius: '4px',
                                color: '#10E28C',
                                fontSize: '13px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                whiteSpace: 'nowrap'
                              }}>
                                每秒肉伤
                              </div>
                              <div style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#ffffff'
                              }}>
                                {asDps(firearm.fireRate, firearm.bodyDamage)}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="lmr-right">
                        <Typography.Paragraph
                          style={{ marginBottom: 0 }}
                          type="secondary"
                          ellipsis={{
                            rows: 3,
                            tooltip: firearm.review
                              ? {
                                title: <div style={{ whiteSpace: "pre-line" }}>{firearm.review}</div>,
                                placement: "topLeft",
                              }
                              : false,
                          }}
                          className="whitespace-pre-line">
                          {firearm.review || "暂无描述"}
                        </Typography.Paragraph>
                      </div>
                    </div>

                  </div>
                </Card>
              </Col>
            ))}
            {firearms.length === 0 && (
              <Col span={24}>
                <Card>
                  <Typography.Text type="secondary">暂无武器数据</Typography.Text>
                </Card>
              </Col>
            )}
          </Row>
        </div>
        <div className="flex justify-end">
          <Pagination
            align="end"
            current={page}
            pageSize={12}
            total={total}
            onChange={(nextPage) => {
              setPage(nextPage)
            }}
            showSizeChanger={false}
          />
        </div>
        <FirearmCreateModal
          open={createModalOpen}
          onCancel={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false)
            void loadFirearms()
          }}
        />

        <FirearmEditModal
          open={!!editingFirearm}
          firearm={editingFirearm}
          onCancel={() => setEditingFirearm(null)}
          onSuccess={() => {
            setEditingFirearm(null)
            void loadFirearms()
          }}

        />
      </ConfigProvider>
    </>

  )
}

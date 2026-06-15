import { useEffect, useMemo, useState } from "react"
import { FirearmApi } from "@/api"
import slotNames from "@/constant/slots.json"
import tuningNames from "@/constant/tunings.json"
import { Firearm, ModificationRequest } from "@/types"
import { AutoComplete, Button, Card, Form, Input, InputNumber, Select, Space } from "antd"

interface ModificationFormProps {
  form: ReturnType<typeof Form.useForm<ModificationRequest>>[0]
  onFinish: (values: ModificationRequest) => void
  lockFirearmId?: number
}

const slotOptions = slotNames.map((slotName) => ({ value: slotName }))
const tuningOptions = tuningNames.map((tuningName) => ({ value: tuningName }))

export default function ModificationForm({ form, onFinish, lockFirearmId }: ModificationFormProps) {
  const [firearmOptions, setFirearmOptions] = useState<Array<{ value: number; label: string }>>([])
  const [firearmLoading, setFirearmLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function loadAllFirearms() {
      setFirearmLoading(true)
      try {
        const allFirearms: Firearm[] = []
        let page = 0
        let totalPages = 1

        while (page < totalPages) {
          const paged = await FirearmApi.getFirearms({
            page,
            size: 100,
            sortBy: "id",
            direction: "ASC",
          })

          allFirearms.push(...paged.items)
          totalPages = paged.totalPages
          page += 1
        }

        if (!active) {
          return
        }

        setFirearmOptions(
          allFirearms.map((firearm) => ({
            value: firearm.id,
            label: `${firearm.name}`,
          }))
        )
      } finally {
        if (active) {
          setFirearmLoading(false)
        }
      }
    }

    void loadAllFirearms()

    return () => {
      active = false
    }
  }, [])

  const mergedFirearmOptions = useMemo(() => {
    if (
      lockFirearmId === undefined ||
      firearmOptions.some((option) => option.value === lockFirearmId)
    ) {
      return firearmOptions
    }

    return [{ value: lockFirearmId, label: `武器 ID: ${lockFirearmId}` }, ...firearmOptions]
  }, [firearmOptions, lockFirearmId])

  return (
    <Form<ModificationRequest>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}>
      <Form.Item<ModificationRequest>
        name="firearmId"
        label="武器"
        rules={[{ required: true, message: "请输入武器" }]}>
        <Select<number>
          className="w-full"
          placeholder="请选择武器"
          options={mergedFirearmOptions}
          loading={firearmLoading}
          disabled={lockFirearmId !== undefined}
          showSearch={{
            filterOption: (input, option) => {
              const labelText = String(option?.label ?? "")
              return labelText.toLowerCase().includes(input.toLowerCase())
            },
          }}
        />
      </Form.Item>

      <Form.Item<ModificationRequest>
        name="name"
        label="改装名称"
        rules={[{ required: true, message: "请输入改装名称" }]}>
        <Input placeholder="请输入改装名称" />
      </Form.Item>

      <Form.Item<ModificationRequest>
        name="code"
        label="改枪码"
        rules={[{ required: true, message: "请输入改枪码" }]}>
        <Input placeholder="请输入改枪码" />
      </Form.Item>

      <Form.Item<ModificationRequest> name="tags" label="标签">
        <Select mode="tags" tokenSeparators={[",", " "]} placeholder="可选：输入后回车" />
      </Form.Item>

      <Form.Item<ModificationRequest> name="author" label="作者">
        <Input placeholder="可选：请输入作者" />
      </Form.Item>

      <Form.Item<ModificationRequest> name="videoUrl" label="视频链接">
        <Input placeholder="可选：请输入视频链接" />
      </Form.Item>

      <Form.Item<ModificationRequest> name="note" label="备注">
        <Input.TextArea rows={3} placeholder="可选：补充说明" />
      </Form.Item>

      <Form.List name="accessories">
        {(accessoryFields, { add: addAccessory, remove: removeAccessory }) => (
          <div className="flex flex-col gap-4">
            {accessoryFields.map((accessoryField) => (
              <Card
                key={accessoryField.key}
                title={`配件 ${accessoryField.name + 1}`}
                size="small"
                extra={
                  <Button
                    danger
                    type="link"
                    size="small"
                    onClick={() => removeAccessory(accessoryField.name)}>
                    删除配件
                  </Button>
                }>
                <Form.Item
                  name={[accessoryField.name, "slotName"]}
                  label="槽位"
                  rules={[{ required: true, message: "请选择或输入槽位" }]}>
                  <AutoComplete options={slotOptions} placeholder="请选择或输入槽位" />
                </Form.Item>

                <Form.Item
                  name={[accessoryField.name, "accessoryName"]}
                  label="配件名称"
                  rules={[{ required: true, message: "请输入配件名称" }]}>
                  <Input placeholder="请输入配件名称" />
                </Form.Item>

                <Form.List name={[accessoryField.name, "tunings"]}>
                  {(tuningFields, { add: addTuning, remove: removeTuning }) => (
                    <div className="flex flex-col gap-3">
                      {tuningFields.map((tuningField) => (
                        <Space key={tuningField.key} align="start" className="w-full" wrap>
                          <Form.Item
                            name={[tuningField.name, "tuningName"]}
                            label="精校属性"
                            rules={[{ required: true, message: "请选择或输入精校属性" }]}>
                            <AutoComplete
                              options={tuningOptions}
                              placeholder="例如：后坐控制"
                              className="w-44"
                            />
                          </Form.Item>
                          <Form.Item
                            name={[tuningField.name, "tuningValue"]}
                            label="精校值"
                            rules={[{ required: true, message: "请输入精校值" }]}>
                            <InputNumber className="w-32" placeholder="例如：0.35" />
                          </Form.Item>
                          <Button
                            type="link"
                            danger
                            className="mt-8"
                            onClick={() => removeTuning(tuningField.name)}>
                            删除
                          </Button>
                        </Space>
                      ))}
                      <Button
                        type="dashed"
                        disabled={tuningFields.length >= 2}
                        onClick={() => addTuning({ tuningName: "", tuningValue: 0 })}>
                        添加精校
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Card>
            ))}
            <Button
              variant="solid"
              color="lime"
              onClick={() => addAccessory({ slotName: "", accessoryName: "", tunings: [] })}>
              添加配件
            </Button>
          </div>
        )}
      </Form.List>
    </Form>
  )
}

import { useEffect, useState } from "react"
import { Button, Form, Input, InputNumber, Modal, AutoComplete, Space } from "antd"
import slotNames from "@/constant/slots.json"
import tuningNames from "@/constant/tunings.json"

interface AccessoryType {
  slotName: string
  accessoryName: string
  tunings: Array<{ tuningName: string; tuningValue: number }>
}

interface AccessoryFormModalProps {
  open: boolean
  onCancel: () => void
  onOk: (values: AccessoryType) => void
  initialData?: AccessoryType | null
  editingIndex?: number | null
}

const slotOptions = slotNames.map((slotName) => ({ value: slotName }))
const tuningOptions = tuningNames.map((tuningName) => ({ value: tuningName }))

export default function AccessoryFormModal({ 
  open, 
  onCancel, 
  onOk, 
  initialData, 
  editingIndex 
}: AccessoryFormModalProps) {
  const [form] = Form.useForm<AccessoryType>()

  // 重置表单或回填数据
  useEffect(() => {
    if (open) {
      if (initialData) {
        // 编辑模式：回填数据
        form.setFieldsValue(initialData)
      } else {
        // 新增模式：重置表单
        form.resetFields()
      }
    }
  }, [open, initialData, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onOk(values)
      form.resetFields()
    } catch (error) {
      console.log("表单校验失败:", error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={initialData ? `编辑配件 ${(editingIndex ?? 0) + 1}` : "添加配件"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="slotName"
          label="槽位"
          rules={[{ required: true, message: "请选择或输入槽位" }]}
        >
          <AutoComplete options={slotOptions} placeholder="请选择或输入槽位" />
        </Form.Item>

        <Form.Item
          name="accessoryName"
          label="配件名称"
          rules={[{ required: true, message: "请输入配件名称" }]}
        >
          <Input placeholder="请输入配件名称" />
        </Form.Item>

        <Form.List name="tunings">
          {(tuningFields, { add: addTuning, remove: removeTuning }) => (
            <div className="flex flex-col gap-3">
              <div className="font-medium">精校配置</div>
              {tuningFields.map((tuningField) => (
                <Space key={tuningField.key} align="start" className="w-full" wrap>
                  <Form.Item
                    name={[tuningField.name, "tuningName"]}
                    label="精校属性"
                    rules={[{ required: true, message: "请选择或输入精校属性" }]}
                  >
                    <AutoComplete
                      options={tuningOptions}
                      placeholder="例如：后坐控制"
                      className="w-44"
                    />
                  </Form.Item>
                  <Form.Item
                    name={[tuningField.name, "tuningValue"]}
                    label="精校值"
                    rules={[{ required: true, message: "请输入精校值" }]}
                  >
                    <InputNumber className="w-32" placeholder="例如：0.35" />
                  </Form.Item>
                  <Button
                    type="link"
                    danger
                    className="mt-8"
                    onClick={() => removeTuning(tuningField.name)}
                  >
                    删除
                  </Button>
                </Space>
              ))}
              <Button
                type="dashed"
                disabled={tuningFields.length >= 2}
                onClick={() => addTuning({ tuningName: "", tuningValue: 0 })}
              >
                + 添加精校
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}
import { useState } from "react"
import { App, Form, Modal } from "antd"
import { FirearmApi } from "@/api"
import FirearmForm from "@/components/firearm-form"
import { AddFirearmRequest, Firearm } from "@/types"

interface FirearmCreateModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: (firearm: Firearm) => void
}

function normalizeRequest(values: AddFirearmRequest): AddFirearmRequest {
  return {
    ...values,
    review: values.review?.trim() || null,
  }
}

export default function FirearmCreateModal({ open, onCancel, onSuccess }: FirearmCreateModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<AddFirearmRequest>()
  const [loading, setLoading] = useState(false)

  async function onFinish(values: AddFirearmRequest) {
    setLoading(true)
    try {
      const firearm = await FirearmApi.addFirearm(normalizeRequest(values))
      message.success("武器创建成功")
      form.resetFields()
      onSuccess(firearm)
    } catch {
      message.error("武器创建失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="新建武器"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="创建"
      cancelText="取消"
      confirmLoading={loading}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields()
        }
      }}>
      <FirearmForm form={form} onFinish={onFinish} />
    </Modal>
  )
}


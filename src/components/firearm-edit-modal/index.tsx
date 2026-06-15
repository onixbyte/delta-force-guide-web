import { useEffect, useState } from "react"
import { App, Form, Modal } from "antd"
import { FirearmApi } from "@/api"
import FirearmForm from "@/components/firearm-form"
import { AddFirearmRequest, Firearm } from "@/types"

interface FirearmEditModalProps {
  open: boolean
  firearm: Firearm | null
  onCancel: () => void
  onSuccess: (firearm: Firearm) => void
}

function normalizeRequest(values: AddFirearmRequest): AddFirearmRequest {
  return {
    ...values,
    review: values.review?.trim() || null,
  }
}

export default function FirearmEditModal({ open, firearm, onCancel, onSuccess }: FirearmEditModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<AddFirearmRequest>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !firearm) {
      return
    }

    const { id: _id, ...editableValues } = firearm
    form.setFieldsValue(editableValues)
  }, [open, firearm, form])

  async function onFinish(values: AddFirearmRequest) {
    if (!firearm) {
      return
    }

    setLoading(true)
    try {
      const updated = await FirearmApi.editFirearm(firearm.id, normalizeRequest(values))
      message.success("武器更新成功")
      onSuccess(updated)
    } catch {
      message.error("武器更新失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="编辑武器"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      destroyOnHidden
    >
      <FirearmForm form={form} onFinish={onFinish} />
    </Modal>
  )
}


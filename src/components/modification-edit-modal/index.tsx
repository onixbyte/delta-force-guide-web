import { useEffect, useState } from "react"
import { App, Form, Modal } from "antd"
import { ModificationApi } from "@/api"
import ModificationForm from "@/components/modification-form"
import { Modification, ModificationRequest } from "@/types"

interface ModificationEditModalProps {
  open: boolean
  modification: Modification | null
  lockedFirearmId?: number
  onCancel: () => void
  onSuccess: (modification: Modification) => void
}

function normalizeRequest(values: ModificationRequest): ModificationRequest {
  return {
    firearmId: values.firearmId,
    name: values.name.trim(),
    code: values.code.trim(),
    tags: values.tags?.map((tag) => tag.trim()).filter(Boolean) || [],
    note: values.note?.trim() || undefined,
    author: values.author?.trim() || undefined,
    videoUrl: values.videoUrl?.trim() || undefined,
    accessories: (values.accessories || []).map((accessory) => ({
      slotName: accessory.slotName.trim(),
      accessoryName: accessory.accessoryName.trim(),
      tunings: (accessory.tunings || []).map((tuning) => ({
        tuningName: tuning.tuningName.trim(),
        tuningValue: tuning.tuningValue,
      })),
    })),
  }
}

export default function ModificationEditModal({
  open,
  modification,
  lockedFirearmId,
  onCancel,
  onSuccess,
}: ModificationEditModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<ModificationRequest>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !modification) {
      return
    }

    const { id: _id, ...editableValues } = modification
    form.setFieldsValue({
      ...editableValues,
      firearmId: lockedFirearmId ?? editableValues.firearmId,
      tags: editableValues.tags || [],
      accessories: editableValues.accessories || [],
    })
  }, [open, modification, lockedFirearmId, form])

  async function onFinish(values: ModificationRequest) {
    if (!modification) {
      return
    }

    setLoading(true)
    try {
      const updated = await ModificationApi.editModification(
        modification.id,
        normalizeRequest({
          ...values,
          firearmId: lockedFirearmId ?? values.firearmId,
        })
      )
      message.success("改枪码更新成功")
      onSuccess(updated)
    } catch {
      message.error("改枪码更新失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="编辑改枪"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={820}
      destroyOnHidden
    >
      <ModificationForm form={form} onFinish={onFinish} lockFirearmId={lockedFirearmId} />
    </Modal>
  )
}



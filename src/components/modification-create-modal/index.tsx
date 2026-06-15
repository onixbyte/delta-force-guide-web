import { useEffect, useState } from "react"
import { App, Form, Modal } from "antd"
import { ModificationApi } from "@/api"
import ModificationForm from "@/components/modification-form"
import { Modification, ModificationRequest } from "@/types"

interface ModificationCreateModalProps {
  open: boolean
  defaultFirearmId?: number
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

export default function ModificationCreateModal({
  open,
  defaultFirearmId,
  lockedFirearmId,
  onCancel,
  onSuccess,
}: ModificationCreateModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<ModificationRequest>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue({
      firearmId: lockedFirearmId ?? defaultFirearmId,
      accessories: [],
      tags: [],
    })
  }, [open, defaultFirearmId, lockedFirearmId, form])

  async function onFinish(values: ModificationRequest) {
    setLoading(true)
    try {
      const modification = await ModificationApi.addModification(
        normalizeRequest({
          ...values,
          firearmId: lockedFirearmId ?? values.firearmId,
        })
      )
      message.success("改枪码创建成功")
      form.resetFields()
      onSuccess(modification)
    } catch {
      message.error("改枪码创建失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="新建改枪"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="创建"
      cancelText="取消"
      confirmLoading={loading}
      width={820}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (!visible) {
          form.resetFields()
        }
      }}
    >
      <ModificationForm form={form} onFinish={onFinish} lockFirearmId={lockedFirearmId} />
    </Modal>
  )
}

import { Form, Input, InputNumber, Select } from "antd"
import { AddFirearmRequest, FirearmType } from "@/types"
import calibres from "@/constant/calibres.json"

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

const calibreOptions = calibres.map((calibre) => ({
  value: calibre,
  label: calibre,
}))

interface FirearmFormProps {
  form: ReturnType<typeof Form.useForm<AddFirearmRequest>>[0]
  onFinish: (values: AddFirearmRequest) => void
}

export default function FirearmForm({ form, onFinish }: FirearmFormProps) {
  return (
    <Form<AddFirearmRequest> form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
      <Form.Item<AddFirearmRequest>
        name="name"
        label="武器名称"
        rules={[{ required: true, message: "请输入武器名称" }]}
      >
        <Input placeholder="请输入武器名称" />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="type"
        label="武器类型"
        rules={[{ required: true, message: "请选择武器类型" }]}
      >
        <Select
          placeholder="请选择武器类型"
          options={Object.entries(firearmTypeText).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="level"
        label="武器输出等级"
        rules={[{ required: true, message: "请输入武器输出等级" }]}
      >
        <Input placeholder="例如：T0" />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="calibre"
        label="子弹口径"
        rules={[{ required: true, message: "请选择子弹口径" }]}
      >
        <Select
          placeholder="请选择子弹口径"
          showSearch
          optionFilterProp="label"
          options={calibreOptions}
        />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="fireRate"
        label="射速（每分钟发数）"
        rules={[{ required: true, message: "请输入射速" }]}
      >
        <InputNumber className="w-full" min={1} precision={0} placeholder="请输入射速" />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="armourDamage"
        label="甲伤"
        rules={[{ required: true, message: "请输入甲伤" }]}
      >
        <InputNumber className="w-full" min={0} precision={0} placeholder="请输入甲伤" />
      </Form.Item>

      <Form.Item<AddFirearmRequest>
        name="bodyDamage"
        label="肉伤"
        rules={[{ required: true, message: "请输入肉伤" }]}
      >
        <InputNumber className="w-full" min={0} precision={0} placeholder="请输入肉伤" />
      </Form.Item>

      <Form.Item<AddFirearmRequest> name="review" label="描述">
        <Input.TextArea rows={4} placeholder="可选：补充武器特点或使用建议" />
      </Form.Item>
    </Form>
  )
}

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { App, Button, Card, Form, Input, Typography } from "antd"
import { AuthApi } from "@/api"
import { useAppDispatch } from "@/hooks/store"
import { setCurrentUser } from "@/store/auth-slice"
import { LoginRequest } from "@/types"

export default function LoginPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  async function onFinish(values: LoginRequest) {
    setLoading(true)
    try {
      const user = await AuthApi.login(values)
      dispatch(setCurrentUser(user))
      message.success(`欢迎回来，${user.username}`)
      navigate("/firearms")
    } catch {
      message.error("登录失败，请检查帐号或密码")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <Card variant="borderless" className="shadow-sm">
          <Typography.Title level={3} className="mb-2! text-center">
            登录
          </Typography.Title>
          <Typography.Paragraph className="mb-6! text-center text-gray-500!">
            使用你的帐号登录后即可继续操作
          </Typography.Paragraph>

          <Form<LoginRequest> layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item<LoginRequest>
              name="principle"
              label="帐号"
              rules={[{ required: true, message: "请输入帐号" }]}
            >
              <Input autoComplete="username" placeholder="请输入帐号" />
            </Form.Item>

            <Form.Item<LoginRequest>
              name="credential"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password autoComplete="current-password" placeholder="请输入密码" />
            </Form.Item>

            <Form.Item className="mb-0!">
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

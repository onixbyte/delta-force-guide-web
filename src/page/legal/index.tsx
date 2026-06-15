import { Tabs } from "antd"
import { useSearchParams } from "react-router-dom"
import MarkdownRenderer from "@/components/markdown-renderer"
import { html as EulaHtml } from "@/docs/EULA.md"
import { html as PrivacyHtml } from "@/docs/PrivacyPolicy.md"

const tabKeys = new Set(["eula", "privacy"])

export default function LegalPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab")
  const activeTab = rawTab && tabKeys.has(rawTab) ? rawTab : "eula"

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setSearchParams({ tab: key })}
        items={[
          {
            key: "eula",
            label: "最终用户许可协议",
            children: <MarkdownRenderer html={EulaHtml} />,
          },
          {
            key: "privacy",
            label: "隐私政策",
            children: <MarkdownRenderer html={PrivacyHtml} />,
          },
        ]}
      />
    </div>
  )
}

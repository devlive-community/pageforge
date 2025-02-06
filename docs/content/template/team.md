---
title: 团队模板
icon: users
---

!!! danger "注意"

    团队模版仅支持配置元数据，切勿填写内容。

!!!

## 基本配置

---

```markdown
---
title: 我们的团队
description: 我们是一个充满激情的开发者社区，致力于创造优秀的开源项目。
template: team

members:
    - name: devlive-community
      type: owner
      url: https://github.com/devlive-community
      avatar: https://github.com/devlive-community.png
    - name: qianmoq
      type: contributor
      url: https://github.com/qianmoq
      avatar: https://github.com/qianmoq.png
---
```

- `title`: 页面标题
- `description`: 页面描述
- `template`: 模板名称，这里必须是 `team`
- `members`: 团队成员列表
  - `name`: 成员名称
  - `type`: 成员类型
  - `url`: 成员链接
  - `avatar`: 成员头像
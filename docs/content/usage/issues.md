---
title: Issues 解析
icon: git-merge
---

PageForge 支持解析 Issues 的链接，您可以在 Markdown 中使用以下语法来插入 Issues:

## 基本语法

```markdown
`#123`
```

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置 `feature.issues.enable: true`

!!!

支持所有平台的 Issues 链接，包括 GitHub、GitLab、Bitbucket 等等。需要依赖在 `pageforge.yaml` 中配置 `repo.owner` 和 `repo.name`，才会构建完整的链接路径。

- `#123`: 这是一个示例的 Issues 编号，您可以根据实际情况替换为正确的编号

## 自定义仓库

---

PageForge 支持自定义仓库，不依赖在 `pageforge.yaml` 中配置 `repo.owner` 和 `repo.name`，直接指定仓库路径即可。例如

```markdown
devlive-community/pageforge#1
```

这是一个自定义的 Issues 链接 devlive-community/pageforge#1，可以根据实际情况替换为正确的仓库路径。
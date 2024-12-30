---
title: 发布网站
---

在 git 存储库中托管项目文档的好处是能够在推送新更改时自动部署它。PageForge 将帮助您让这一切变得非常简单。

## GitHub Pages

---

如果您已经在 GitHub 上托管了您的代码，GitHub Pages 无疑是发布项目文档的最便捷方式。它是免费的，而且很容易设置。

### 使用 GitHub Actions

使用 GitHub Actions，您可以自动部署项目文档。在仓库的根目录中，创建一个新的 GitHub Actions 工作流程，例如 `.github/workflows/ci.yml`，然后复制并粘贴以下内容：

```yaml
name: ci 
on:
  push:
    branches:
      - master 
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js 18.x
        uses: actions/setup-node@v3
        with:
          node-version: 18.x

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
        
      - name: Install dependencies
        run: pnpm install

      - name: Build site
        run: |
          pageforge build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 使用 PageForge

---

您也可以使用 PageForge 的命令行工具来自动部署项目文档。PageForge 会在项目根目录中 `pageforge.yaml` 文件，读取配置信息：

```yaml
deploy:
  github:
    repository: devlive-community/pageforge
    branch: gh-pages
    cname: pageforge.devlive.community
    buildDir: dist
    username: devlive-community
    email: support@devlive.org
```
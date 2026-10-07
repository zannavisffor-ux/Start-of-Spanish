# Hola · 我的西语小世界

为 2–3 岁幼儿设计的西班牙语大图词卡。11 个分类、196 个单词，首页重点展示车辆。无需登录、数据库或 API 密钥。

## 启动与预览

需要 Node.js 20.19+ 或 22.12+（当前环境使用 Node 24）。

```sh
cd /workspace/Start-of-Spanish
npm ci
npm run dev -- --port 5173 --strictPort
```

开发服务器监听 `0.0.0.0:5173`。在支持端口预览的开发工具中选择端口 5173；本机运行时在浏览器打开终端显示的地址。云环境若未提供端口预览，可将仓库下载到本机运行相同命令。

```sh
npm test
npm run test:e2e
npm run build
npm run preview -- --port 4173
```

浏览器测试优先使用 `/usr/bin/chromium`。其他环境先执行 `npx playwright install chromium`。测试覆盖手机和平板、所有分类图片、导航边界、朗读调用与不支持语音时的提示。自动化测试模拟语音 API；实际音质需在目标手机或平板试听。

## 词汇与图片

`src/data.js` 集中维护分类及词汇。新增词条使用 `西班牙语单词|emoji`，颜色使用十六进制色值。运行 `node scripts/download-images.js` 下载新增插画，再运行测试。插画保存在 `public/images`，日常访问无需请求图片 CDN。部分人物、衣服和动作采用示意图，后续可替换为更具体的教学图片。

- `src/main.js`：分类首页、词卡路由、朗读和导航。
- `src/style.css`：手机、平板、桌面响应式布局。
- `test/`：数据完整性与浏览器功能测试。

点击整张词卡（含喇叭区域）触发朗读，优先选择 `es-ES`，其次使用其他西班牙语声音。浏览器需提供西班牙语语音，部分设备首次使用需要联网或安装系统语音包。切换词卡会取消上一条朗读。没有可用语音时显示提示，不假装已播放。

## 插画授权

本地 SVG 插画来自 [Twemoji v16.0.1](https://github.com/jdecked/twemoji)，版权归 Twitter, Inc. 及其他贡献者所有，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；完整许可见 `public/images/LICENSE-GRAPHICS`。插画原图未修改，仅调整显示尺寸及组合。配色卡为本项目 CSS 绘制。

未来可在现有数据结构上增加收藏、自动播放、短句和小游戏；本版尚未实现这些功能。

## GitHub Pages 部署

公网地址（首次部署成功后可用）：https://zannavisffor-ux.github.io/Start-of-Spanish/

1. 将项目提交并推送到 `main`，包括 `.github/workflows/deploy-pages.yml`。
2. 打开 GitHub 仓库 **Settings → Pages → Build and deployment**，将 **Source** 设为 **GitHub Actions**，无需选择发布分支。
3. 打开 **Actions → Deploy GitHub Pages → Run workflow**，选择 `main` 并运行。如果修改 Source 前已有失败记录，重新运行即可。
4. 等待 `build` 和 `deploy` 都变绿，再打开上面的公网地址。以后每次推送到 `main` 自动更新。

若 Actions 被禁用，在 **Settings → Actions → General** 启用本仓库使用 GitHub 官方 Actions。若组织策略禁止，需由管理员允许。此流程不需要手动添加部署 token。私有仓库能否启用 Pages 取决于 GitHub 套餐；Pages 网站可能公开，请确认仓库中无敏感内容。

生产 `base` 为 `/Start-of-Spanish/`，开发仍使用 `/`。词卡图片也使用 Vite 的 `BASE_URL`，避免项目子路径下丢图。应用采用 hash 路由，分享词卡地址不需要服务端重写。

```sh
npm run test:pages
```

该命令构建后在真实项目子路径上运行手机和平板浏览器测试。GitHub Actions 同样执行该测试，通过后只上传 `dist` 并发布。

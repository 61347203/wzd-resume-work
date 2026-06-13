# 个人简历网站

金融数字化、数据运营与业务运营互动作品集。

## 本地运行

```bash
npm install
npm run dev
```

## 当前版本

当前只发布金融数字化定向版本。数据运营和业务运营版本暂停，待各自内容结构单独完成后再增加。

## 替换素材

- 头像：`public/portrait.png`
- 下载简历：`public/resume.pdf`
- 页面内容：`src/data.ts`

项目图当前为基于真实业务逻辑的脱敏重绘，不包含客户、账户或内部审批信息。

## 部署

项目为纯静态 Vite 站点，可零成本部署到 Cloudflare Pages、Vercel 或 Netlify。

- 构建命令：`npm run build`
- 输出目录：`dist`

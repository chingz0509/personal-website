# 程卓 · 个人网站

**UX × AI 产品设计，把复杂系统变得更清楚。**

这里是我的数字自留地：介绍自己，记录对设计和 AI 产品体验的思考，也分享一些从真实问题出发、可以直接使用的小工具。

[访问网站](https://personal-website-alpha-one-60.vercel.app/) · [联系我](mailto:424096784@qq.com)

## 网站里有什么

- **个人首页**：简短的自我介绍，以及可以点击切换的「此刻，我正在」。
- **关于我**：用贴纸和 8 张介绍卡片，呈现我的经历、关注方向与设计方法；支持按钮、键盘方向键和触摸滑动切换。
- **小工具**：展示自己做的小产品，提供产品入口和图片或视频预览。
- **响应式体验**：适配桌面与移动端，包含滚动收起的导航栏和移动端菜单。
- **细节与动效**：卡片切换、贴纸互动、图片懒加载，以及按需加载和播放的视频预览；适配系统的「减少动态效果」偏好。

### 正在分享的小工具

| 产品 | 做什么 | 入口 |
| --- | --- | --- |
| OnePage · 你的个人目录 | 集中展示工作、作品与重要链接，创建可以分享的个人目录。 | [打开 OnePage](https://onepage.chengzhuo.work/) |
| 隐私截图打码器 | 在浏览器本地处理截图，支持敏感信息识别、手动框选、水印和多种打码方式。 | [打开打码器](https://mask.chengzhuo.work/) |

本仓库包含个人网站及工具展示素材；这两个工具是独立站点，其应用源码不在本仓库中。

## 技术实现

使用 **HTML + CSS + 原生 JavaScript**，无需安装前端依赖或执行构建。

- 页面结构、样式和主要交互集中在 `index.html`。
- 个人介绍卡片的数据与切换状态封装在 `assets/sticker-deck.js`。
- 使用 CSS 媒体查询、Web Animations API 和 `IntersectionObserver` 实现布局适配、交互动画与视频按需加载。
- 图片采用 PNG / WebP，工具演示使用本地视频素材。
- 当前站点通过 Vercel 托管。

## 本地预览

需要 Git 和 Python 3。在终端执行：

```bash
git clone https://github.com/chingz0509/personal-website.git
cd personal-website
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器打开 [http://localhost:8000](http://localhost:8000)。修改文件后刷新页面即可查看效果，按 `Ctrl+C` 停止服务。

也可以使用其他静态文件服务器，将仓库根目录作为网站目录。

## 目录结构

```text
personal-website/
├── index.html                  # 首页：页面、样式与主要交互
├── assets/
│   ├── sticker-deck.js          # 个人介绍卡片内容与状态逻辑
│   ├── profile/                 # 头像素材
│   ├── stickers/                # 贴纸素材
│   ├── tools/                   # 工具预览图与演示视频
│   ├── portfolio/               # 作品展示素材
│   └── …                        # 其他贴纸和视觉参考素材
├── work/                        # 早期作品详情页面
└── nexprinter-reference.html    # 视觉参考页面
```

`work/` 中保留了 AI 招聘、AI 简历优化、Petloo、58 魔方和 AIGC 探索等早期作品页，目前未接入首页导航。这些页面引用的 `work.css` 和旧版 `designer-portfolio.html` 不在当前仓库中，后续接入前需要补齐。

## 内容维护与部署

| 想修改的内容 | 对应位置 |
| --- | --- |
| 姓名、首页介绍、联系方式 | `index.html` 中的页面正文 |
| 「此刻，我正在」的轮换文案 | `index.html` 中的 `phrases` 数组 |
| 关于我的 8 张介绍卡片 | `assets/sticker-deck.js` 中的 `cards` 数组 |
| 工具名称、描述、跳转链接与预览 | `index.html` 中的 `#tools` 区域及 `assets/tools/` |
| 配色、字体与响应式布局 | `index.html` 中的 `<style>` |

部署时将仓库根目录作为静态网站目录，入口为 `index.html`，并保留 `assets/` 的相对路径即可。站点本身不需要运行后端，也不需要配置 API 密钥。

## 联系

欢迎交流产品设计、AI 体验和有趣的小工具。

- 邮箱：[424096784@qq.com](mailto:424096784@qq.com)
- GitHub：[@chingz0509](https://github.com/chingz0509)

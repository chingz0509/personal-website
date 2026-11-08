# 底部快捷栏品牌图标

保持现有纸白、灰黑与深绿的页面配色，以及圆形按钮、悬停提示和键盘焦点样式。外部平台图标使用本地素材，不引入远程字体或图标运行库。按用户要求，小红书保留官方 App 图标的红底白字。

| 平台 | 本地素材 | 素材来源 | 个人主页 |
| --- | --- | --- | --- |
| GitHub | `assets/icons/github.svg` | 官方 GitHub 品牌包，https://brand.github.com/foundations/logo | https://github.com/chingz0509 |
| Dribbble | `assets/dribbble-brand/icon.png` | Dribbble 官网，https://dribbble.com/images/favicon-192x192.png；使用说明 https://dribbble.com/media-kit | https://dribbble.com/424096784emm |
| 小红书 | `assets/xiaohongshu-brand/app-icon.png` | 官方 App Store，https://apps.apple.com/cn/app/id741292507；通过 Apple Lookup API 获取图标地址 | https://www.xiaohongshu.com/user/profile/5b235f75e8ac2b7ab4dac864?tab=note |

小红书使用 128 × 128px 官方 PNG，显示为 30 × 30px、7px 圆角，不改色、不重绘、不拉伸。其他图标尺寸保持不变。

Dribbble 使用官网 192 × 192px 透明 PNG 粉色篮球标志，显示为 26 × 26px，保留原配色与比例。快捷栏保留 44px 的移动端点击目标；窄屏仅收紧按钮间距及容器留白。

图标源地址：https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/38/bd/a2/38bda237-424d-e201-35a4-e4485ce4a4fc/AppIcon-0-0-1x_U007epad-0-11-0-85-220.png/128x128bb.png

## 光标拖尾

沿用页面星星与贴纸文字的 `--lilac`（`#a994dc`），不新增色系。8 个圆点尺寸由 14px 递减至 4.2px，透明度由 0.4 递减至 0.085，以时间归一化缓动逐个跟随鼠标。停止移动 80ms 后开始淡出，480ms 后停止动画循环。

保留原生光标，装饰层不拦截点击、不进入无障碍树；仅鼠标精细指针且未开启减少动态效果时启用。离开窗口、切换后台或设置变更时隐藏并取消动画帧。不修改快捷栏和现有布局。

实现：`assets/cursor-trail.css`、`assets/cursor-trail.js`。逻辑检查：`node tests/cursor-trail.test.cjs`。

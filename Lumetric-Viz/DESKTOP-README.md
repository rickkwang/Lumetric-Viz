# Lumetric-Viz 桌面应用程序

这是一个 3D 数据可视化工具，可将 Excel 和 CSV 文件转换为交互式 3D 可视化。

## 快速启动

### 作为开发模式运行
```bash
npm run dev                    # 启动 Web 版本
npm run electron:dev           # 启动桌面版本（需要先在另一个终端运行 `npm run dev`）
```

### 使用启动脚本运行桌面应用
```bash
node start-electron.js         # 同时启动开发服务器和桌面应用
```

## 分发给其他用户

要创建可安装的桌面应用程序，请运行：

```bash
./build-desktop-app.sh
```

完成后，您可以在 `dist_electron` 目录中找到适用于您操作系统的安装文件：
- macOS: .dmg 文件
- Windows: .exe 文件
- Linux: .AppImage 文件

## 使用方法

1. 启动应用程序
2. 在侧边栏找到 "UPLOAD DATA" 区域
3. 拖放 Excel(.xlsx) 或 CSV 文件，或点击浏览上传
4. 使用鼠标控制：
   - 左键 + 拖拽：旋转
   - 右键 + 拖拽：平移
   - 滚轮：缩放
5. 在侧边栏切换不同的 3D 视图模式（柱状图、气泡图、表面图等）

## 数据要求

您的 Excel 或 CSV 文件应具有以下格式：
- 第一行：列标题（如 Category, Sales, Profit 等）
- 第二行及以后：数据

示例：
```
| Category | Sales | Profit |
|----------|-------|--------|
| Jan      | 100   | 20     |
| Feb      | 150   | 40     |
| Mar      | 120   | 30     |
```
# Lumetric-Viz 3D 数据可视化工具

这是一个高性能、交互式的 3D 数据可视化引擎，可将 Excel 和 CSV 电子表格转换为沉浸式的 3D 环境。

## 安装方法

### macOS 用户
1. 下载 `Lumetric-Viz-1.8.0-arm64.dmg` 文件
2. 双击打开 DMG 文件
3. 将 Lumetric-Viz 拖拽到应用程序文件夹
4. 首次运行时，右键（或 Ctrl+点击）Lumetric-Viz 应用程序，然后选择"打开"
5. 以后可以直接双击应用程序启动

### Windows 用户
1. 系统需要先安装 Node.js（v16 或更高版本）
2. 从 GitHub 下载项目源码
3. 在项目目录运行 `npm install`
4. 运行 `npm run electron:build-win` 构建 Windows 版本
5. 安装生成的 .exe 文件

### Linux 用户
1. 系统需要先安装 Node.js（v16 或更高版本）
2. 从 GitHub 下载项目源码
3. 在项目目录运行 `npm install`
4. 运行 `npm run electron:build-linux` 构建 Linux 版本
5. 运行生成的 .AppImage 文件

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

## 兼容性
- macOS: ARM64 (M1/M2/M3 Macs) 和 x64 (Intel Macs)
- Windows: 64位系统
- Linux: 大多数主流发行版

## 技术支持
如有问题请联系技术支持或访问 GitHub 仓库。
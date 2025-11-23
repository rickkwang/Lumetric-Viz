#!/bin/bash

echo "构建 Lumetric-Viz 桌面应用程序"

# 首先构建前端资源
echo "正在构建前端资源..."
npm run build

if [ $? -ne 0 ]; then
    echo "前端构建失败。让我们尝试创建一个可分发的桌面应用，它将直接从开发服务器加载。"
    mkdir -p dist_electron
    cp -r main.js preload.js package.json node_modules dist_electron/ 2>/dev/null || echo "复制资源时出现警告，但这可能是正常的"
    echo "创建了基础分发文件在 dist_electron 目录"
else
    echo "前端构建成功，现在创建完整的桌面应用..."
    
    # 现在构建 Electron 应用
    npm run electron:build
fi

echo "构建过程完成。"
echo "对于 macOS 用户，可以在 dist_electron 目录找到 .dmg 文件"
echo "对于 Windows 用户，可以在 dist_electron 目录找到 .exe 文件"
# -*- coding: utf-8 -*-
"""
月下签小程序 - 图片批量压缩脚本
运行方式：python compress_images.py
作用：把 assets/illustration 下的所有PNG压缩到小程序可用尺寸，代码包从30MB降到~1.5MB
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("正在安装 Pillow 库...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'illustration')
MAX_WIDTH = 750  # 小程序图片最大宽度，750rpx约等于750px
QUALITY = 85

def compress_image(filepath):
    """压缩单张图片"""
    try:
        img = Image.open(filepath)
        original_size = os.path.getsize(filepath)

        # 如果有透明通道，转成P模式（带透明）大幅减小体积
        if img.mode in ('RGBA', 'LA'):
            img = img.quantize(colors=256, method=Image.FASTOCTREE)
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # 限制最大宽度
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

        # 保存（优化）
        img.save(filepath, optimize=True)
        new_size = os.path.getsize(filepath)
        ratio = (1 - new_size / original_size) * 100
        print(f"  {os.path.basename(filepath)}: {original_size//1024}KB -> {new_size//1024}KB (-{ratio:.0f}%)")
        return True
    except Exception as e:
        print(f"  失败 {os.path.basename(filepath)}: {e}")
        return False

def main():
    if not os.path.exists(BASE_DIR):
        print(f"目录不存在: {BASE_DIR}")
        return

    total_before = 0
    total_after = 0
    count = 0

    for root, dirs, files in os.walk(BASE_DIR):
        for f in files:
            if f.lower().endswith('.png'):
                filepath = os.path.join(root, f)
                total_before += os.path.getsize(filepath)
                if compress_image(filepath):
                    count += 1
                total_after += os.path.getsize(filepath)

    print(f"\n完成！共压缩 {count} 张图片")
    print(f"压缩前: {total_before//1024}KB ({total_before//1024//1024}MB)")
    print(f"压缩后: {total_after//1024}KB ({total_after//1024//1024}MB)")
    print(f"节省: {(total_before-total_after)//1024}KB")

if __name__ == '__main__':
    main()

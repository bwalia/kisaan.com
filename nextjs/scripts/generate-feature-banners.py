"""
Generate additional banner variations for feature pages.
Creates themed banners for Security, Pricing, Returns, and Support pages.
"""

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math

WIDTH = 1920
HEIGHT = 600  # Shorter for feature pages

def create_abstract_pattern_banner(primary_color, secondary_color, accent_color, filename):
    """
    Create an abstract geometric pattern banner
    """
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(primary_color[0] * (1 - ratio) + secondary_color[0] * ratio)
        g = int(primary_color[1] * (1 - ratio) + secondary_color[1] * ratio)
        b = int(primary_color[2] * (1 - ratio) + secondary_color[2] * ratio)
        draw.rectangle([(0, y), (WIDTH, y + 1)], fill=(r, g, b))
    
    # Add geometric shapes
    overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Large circles
    for i in range(3):
        x = WIDTH // 4 * (i + 1)
        y = HEIGHT // 2 + (i - 1) * 100
        radius = 200 - i * 30
        overlay_draw.ellipse(
            [(x - radius, y - radius), (x + radius, y + radius)],
            fill=(*accent_color, 30)
        )
    
    # Add diagonal lines
    for i in range(0, WIDTH + HEIGHT, 80):
        overlay_draw.line(
            [(i, 0), (i - HEIGHT, HEIGHT)],
            fill=(255, 255, 255, 15),
            width=2
        )
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Apply subtle texture
    noise = Image.effect_noise((WIDTH, HEIGHT), 20)
    img = Image.blend(img, noise.convert('RGB'), 0.02)
    
    # Save
    output_path = f'../public/{filename}.jpg'
    img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"✅ {filename}.jpg created")
    return img

def create_field_texture_banner(base_color, filename):
    """
    Create a subtle field texture for backgrounds
    """
    img = Image.new('RGB', (WIDTH, HEIGHT), base_color)
    draw = ImageDraw.Draw(img)
    
    # Add horizontal lines (field rows)
    for i in range(0, HEIGHT, 40):
        alpha = int(20 - (i / HEIGHT) * 10)
        overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle(
            [(0, i), (WIDTH, i + 15)],
            fill=(0, 0, 0, alpha)
        )
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Add organic shapes
    overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    import random
    random.seed(42)
    for _ in range(50):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        size = random.randint(20, 60)
        overlay_draw.ellipse(
            [(x - size, y - size), (x + size, y + size)],
            fill=(255, 255, 255, random.randint(5, 15))
        )
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Blur for softness
    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    
    # Save
    output_path = f'../public/{filename}.jpg'
    img.save(output_path, 'JPEG', quality=85, optimize=True)
    print(f"✅ {filename}.jpg created")
    return img

def create_all_banners():
    """Generate all feature page banners"""
    print("🎨 Creating feature page banners...")
    print()
    
    # Security page - Blue theme
    print("📘 Security Banner")
    create_abstract_pattern_banner(
        primary_color=(37, 99, 235),    # Blue-600
        secondary_color=(29, 78, 216),   # Blue-700
        accent_color=(96, 165, 250),     # Blue-400
        filename='banner-security'
    )
    
    # Pricing page - Green theme
    print("💚 Pricing Banner")
    create_abstract_pattern_banner(
        primary_color=(22, 163, 74),     # Green-600
        secondary_color=(21, 128, 61),   # Green-700
        accent_color=(134, 239, 172),    # Green-300
        filename='banner-pricing'
    )
    
    # Returns page - Purple theme
    print("💜 Returns Banner")
    create_abstract_pattern_banner(
        primary_color=(147, 51, 234),    # Purple-600
        secondary_color=(126, 34, 206),  # Purple-700
        accent_color=(216, 180, 254),    # Purple-300
        filename='banner-returns'
    )
    
    # Support page - Orange theme
    print("🧡 Support Banner")
    create_abstract_pattern_banner(
        primary_color=(234, 88, 12),     # Orange-600
        secondary_color=(194, 65, 12),   # Orange-700
        accent_color=(251, 146, 60),     # Orange-400
        filename='banner-support'
    )
    
    print()
    print("🌾 Creating subtle field textures...")
    print()
    
    # Subtle field textures for backgrounds
    create_field_texture_banner((240, 253, 244), 'texture-green-light')
    create_field_texture_banner((239, 246, 255), 'texture-blue-light')
    create_field_texture_banner((250, 245, 255), 'texture-purple-light')
    create_field_texture_banner((255, 247, 237), 'texture-orange-light')
    
    print()
    print("🎉 All banners created successfully!")

if __name__ == "__main__":
    try:
        create_all_banners()
        print("\nGenerated files:")
        print("  Feature page banners (1920x600px):")
        print("    - banner-security.jpg")
        print("    - banner-pricing.jpg")
        print("    - banner-returns.jpg")
        print("    - banner-support.jpg")
        print()
        print("  Subtle textures (1920x600px):")
        print("    - texture-green-light.jpg")
        print("    - texture-blue-light.jpg")
        print("    - texture-purple-light.jpg")
        print("    - texture-orange-light.jpg")
    except Exception as e:
        print(f"❌ Error: {e}")

"""
Generate a professional farmer-themed banner image for Kisaan marketplace.
This script creates a high-quality banner showing a farmer working in fields
with a beautiful sunset/sunrise atmosphere.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math

# Banner dimensions (optimized for hero sections)
WIDTH = 1920
HEIGHT = 800

# Create new image with gradient background
def create_gradient_background():
    """Create a beautiful sunrise/sunset gradient"""
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # Sky gradient colors (sunrise/sunset theme)
    colors = [
        (255, 200, 150),  # Warm orange top
        (255, 180, 120),
        (255, 160, 100),
        (240, 140, 80),
        (220, 130, 70),   # Deeper orange
        (180, 110, 60),
        (140, 90, 50),    # Ground transition
        (100, 70, 40),
        (80, 60, 35),     # Dark ground
        (60, 50, 30),
    ]
    
    # Draw gradient
    for i in range(HEIGHT):
        # Calculate color index
        ratio = i / HEIGHT
        idx = int(ratio * (len(colors) - 1))
        next_idx = min(idx + 1, len(colors) - 1)
        
        # Interpolate between colors
        local_ratio = (ratio * (len(colors) - 1)) - idx
        r = int(colors[idx][0] * (1 - local_ratio) + colors[next_idx][0] * local_ratio)
        g = int(colors[idx][1] * (1 - local_ratio) + colors[next_idx][1] * local_ratio)
        b = int(colors[idx][2] * (1 - local_ratio) + colors[next_idx][2] * local_ratio)
        
        draw.rectangle([(0, i), (WIDTH, i + 1)], fill=(r, g, b))
    
    return img

def add_sun(img):
    """Add a glowing sun to the image"""
    draw = ImageDraw.Draw(img)
    
    # Sun position (top right)
    sun_x = WIDTH - 300
    sun_y = 150
    sun_radius = 100
    
    # Draw sun glow (multiple circles with decreasing opacity)
    for i in range(8, 0, -1):
        radius = sun_radius + (i * 15)
        alpha = int(30 / i)
        overlay = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.ellipse(
            [(sun_x - radius, sun_y - radius), (sun_x + radius, sun_y + radius)],
            fill=(255, 230, 150, alpha)
        )
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    # Draw main sun
    draw.ellipse(
        [(sun_x - sun_radius, sun_y - sun_radius), 
         (sun_x + sun_radius, sun_y + sun_radius)],
        fill=(255, 240, 180)
    )
    
    return img

def add_field_rows(img):
    """Add agricultural field rows for depth"""
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Field starts at bottom 40% of image
    field_start = int(HEIGHT * 0.6)
    
    # Draw crop rows
    num_rows = 20
    for i in range(num_rows):
        y = field_start + (i * (HEIGHT - field_start) // num_rows)
        # Calculate perspective (rows get wider as they get closer)
        perspective = 1 + (i / num_rows) * 2
        offset = int(WIDTH * 0.2 / perspective)
        
        # Row color (alternating for depth)
        base_green = 80 + (i * 3)
        row_color = (40 + i * 2, base_green, 30 + i * 2, 150 - i * 3)
        
        # Draw row with perspective
        points = [
            (offset, y),
            (WIDTH - offset, y),
            (WIDTH - offset + 10, y + 15),
            (offset - 10, y + 15)
        ]
        draw.polygon(points, fill=row_color)

def add_farmer_silhouette(img):
    """Add a farmer silhouette working in the field"""
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Farmer position (left side, in the field)
    farmer_x = 400
    farmer_y = HEIGHT - 300
    
    # Silhouette color (dark against the sunset)
    silhouette_color = (20, 20, 20, 200)
    
    # Draw farmer body (simplified)
    # Head
    draw.ellipse(
        [(farmer_x - 25, farmer_y - 120), (farmer_x + 25, farmer_y - 70)],
        fill=silhouette_color
    )
    
    # Body
    draw.rectangle(
        [(farmer_x - 30, farmer_y - 70), (farmer_x + 30, farmer_y)],
        fill=silhouette_color
    )
    
    # Left arm (reaching down to plant)
    arm_points = [
        (farmer_x - 30, farmer_y - 60),
        (farmer_x - 60, farmer_y - 20),
        (farmer_x - 70, farmer_y - 10),
        (farmer_x - 40, farmer_y - 30),
    ]
    draw.polygon(arm_points, fill=silhouette_color)
    
    # Right arm
    arm_points = [
        (farmer_x + 30, farmer_y - 60),
        (farmer_x + 40, farmer_y - 40),
        (farmer_x + 50, farmer_y - 30),
        (farmer_x + 35, farmer_y - 40),
    ]
    draw.polygon(arm_points, fill=silhouette_color)
    
    # Legs
    draw.polygon([
        (farmer_x - 25, farmer_y),
        (farmer_x - 15, farmer_y),
        (farmer_x - 20, farmer_y + 80),
        (farmer_x - 30, farmer_y + 80),
    ], fill=silhouette_color)
    
    draw.polygon([
        (farmer_x + 15, farmer_y),
        (farmer_x + 25, farmer_y),
        (farmer_x + 30, farmer_y + 80),
        (farmer_x + 20, farmer_y + 80),
    ], fill=silhouette_color)
    
    # Hat
    draw.ellipse(
        [(farmer_x - 35, farmer_y - 130), (farmer_x + 35, farmer_y - 115)],
        fill=silhouette_color
    )
    draw.rectangle(
        [(farmer_x - 20, farmer_y - 125), (farmer_x + 20, farmer_y - 100)],
        fill=silhouette_color
    )
    
    return img

def add_plants(img):
    """Add small plant/crop silhouettes"""
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Add plants in foreground (bottom of image)
    plants_y = HEIGHT - 150
    plant_color = (30, 50, 30, 180)
    
    for x in range(0, WIDTH, 80):
        # Vary plant heights
        import random
        random.seed(x)  # Consistent randomness
        height = 40 + random.randint(0, 30)
        width = 20 + random.randint(0, 15)
        
        # Draw simple plant shape
        plant_points = [
            (x, plants_y),
            (x - width//2, plants_y - height//2),
            (x - width//3, plants_y - height),
            (x, plants_y - height - 10),
            (x + width//3, plants_y - height),
            (x + width//2, plants_y - height//2),
        ]
        draw.polygon(plant_points, fill=plant_color)

def add_overlay_texture(img):
    """Add subtle texture overlay for realism"""
    # Create noise texture
    noise = Image.effect_noise((WIDTH, HEIGHT), 25)
    noise = noise.convert('RGB')
    
    # Blend with main image
    img = Image.blend(img, noise, 0.03)
    return img

def add_vignette(img):
    """Add vignette effect (darker edges)"""
    # Create radial gradient mask
    vignette = Image.new('L', (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(vignette)
    
    # Draw radial gradient
    center_x, center_y = WIDTH // 2, HEIGHT // 2
    max_dist = math.sqrt(center_x**2 + center_y**2)
    
    for y in range(HEIGHT):
        for x in range(WIDTH):
            dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            intensity = int(255 * (1 - (dist / max_dist) * 0.5))
            vignette.putpixel((x, y), intensity)
    
    # Apply blur to vignette
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=100))
    
    # Apply vignette to image
    img = img.convert('RGBA')
    vignette_img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    vignette_img.putalpha(vignette)
    
    # Composite
    result = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 255))
    result.paste(img, (0, 0))
    result = Image.alpha_composite(result, vignette_img)
    
    return result.convert('RGB')

def create_banner():
    """Main function to create the complete banner"""
    print("🎨 Creating farmer-themed banner...")
    
    # Create base gradient
    print("  ├─ Generating sunset gradient...")
    img = create_gradient_background()
    
    # Add sun
    print("  ├─ Adding sun...")
    img = add_sun(img)
    
    # Add field rows
    print("  ├─ Drawing agricultural rows...")
    add_field_rows(img)
    
    # Add plants
    print("  ├─ Adding crop plants...")
    add_plants(img)
    
    # Add farmer
    print("  ├─ Adding farmer silhouette...")
    img = add_farmer_silhouette(img)
    
    # Add texture
    print("  ├─ Applying texture overlay...")
    img = add_overlay_texture(img)
    
    # Add vignette
    print("  ├─ Adding vignette effect...")
    img = add_vignette(img)
    
    # Enhance colors
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.2)
    
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    # Save high quality
    output_path = '../public/hero-farmer-banner.jpg'
    img.save(output_path, 'JPEG', quality=95, optimize=True)
    print(f"✅ Banner saved to: {output_path}")
    print(f"   Dimensions: {WIDTH}x{HEIGHT}px")
    
    # Also create a blurred version for overlay
    print("  ├─ Creating blurred version...")
    blurred = img.filter(ImageFilter.GaussianBlur(radius=5))
    blurred_path = '../public/hero-farmer-banner-blurred.jpg'
    blurred.save(blurred_path, 'JPEG', quality=85, optimize=True)
    print(f"✅ Blurred version saved to: {blurred_path}")

if __name__ == "__main__":
    try:
        create_banner()
        print("\n🎉 Banner generation complete!")
        print("\nNext steps:")
        print("1. Check the generated images in kisaan-next/public/")
        print("2. Update HeroSection.tsx to use the new background")
        print("3. Adjust overlay opacity if needed for text readability")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure you have PIL/Pillow installed:")
        print("  pip install Pillow")

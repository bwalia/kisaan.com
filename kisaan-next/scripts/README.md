# Banner Image Generation

This directory contains scripts for generating custom banner images for the Kisaan marketplace.

## Files

### `generate-banner.py`
Python script that creates a professional farmer-themed banner image featuring:
- Beautiful sunrise/sunset gradient background
- Glowing sun in the sky
- Agricultural field rows with perspective
- Farmer silhouette working in the field
- Crop plants in foreground
- Realistic texture and vignette effects

**Output:**
- `public/hero-farmer-banner.jpg` (1920x800px, high quality)
- `public/hero-farmer-banner-blurred.jpg` (blurred version for subtle backgrounds)

## Usage

### Prerequisites
```bash
# Install Pillow (PIL)
pip install Pillow
# or
pip3 install Pillow --user
```

### Generate Banner
```bash
cd kisaan-next/scripts
python3 generate-banner.py
```

### Output
The script will create two images in `kisaan-next/public/`:
1. **hero-farmer-banner.jpg** - Main banner with full detail
2. **hero-farmer-banner-blurred.jpg** - Softly blurred version

## Customization

### Adjust Colors
Edit the `create_gradient_background()` function to change the sky colors:
```python
colors = [
    (255, 200, 150),  # Warm orange top
    (255, 180, 120),
    # ... add more colors
]
```

### Change Banner Size
Modify the constants at the top:
```python
WIDTH = 1920  # Banner width
HEIGHT = 800  # Banner height
```

### Adjust Farmer Position
In `add_farmer_silhouette()` function:
```python
farmer_x = 400  # Horizontal position
farmer_y = HEIGHT - 300  # Vertical position
```

### Modify Sun Position
In `add_sun()` function:
```python
sun_x = WIDTH - 300  # Sun horizontal position
sun_y = 150  # Sun vertical position
```

## Integration

The banner is automatically integrated into the HeroSection component:
```tsx
// In HeroSection.tsx
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: "url('/hero-farmer-banner.jpg')"
  }}
/>
```

## Image Specifications

- **Format:** JPEG
- **Quality:** 95% (optimized for web)
- **Dimensions:** 1920x800px (responsive)
- **File Size:** ~300-500KB
- **Color Space:** RGB
- **Compression:** Optimized

## Effects Applied

1. **Gradient Sky** - Multi-color sunrise/sunset gradient
2. **Sun Glow** - Layered glowing sun effect
3. **Field Rows** - Perspective-corrected agricultural rows
4. **Farmer Silhouette** - Simplified but recognizable farmer figure
5. **Crop Plants** - Foreground vegetation
6. **Texture Overlay** - Subtle noise for realism (3% opacity)
7. **Vignette** - Darker edges for depth (50% intensity)
8. **Color Enhancement** - +20% saturation, +10% contrast

## Performance

- Images are optimized for web delivery
- Lazy loading supported via Next.js Image component
- Mobile-responsive (background-size: cover)
- Fast loading with appropriate compression

## Future Enhancements

- [ ] Add seasonal variations (spring, summer, autumn, winter)
- [ ] Create multiple farmer poses
- [ ] Add weather effects (rain, sunny, cloudy)
- [ ] Generate different times of day
- [ ] Add farm animals or equipment
- [ ] Create animated version (video/GIF)
- [ ] Support for different aspect ratios

## Troubleshooting

### ModuleNotFoundError: No module named 'PIL'
Install Pillow:
```bash
pip3 install Pillow --user
```

### Permission Error
Ensure write permissions in the `public/` directory:
```bash
chmod 755 kisaan-next/public/
```

### Low Quality Output
Increase JPEG quality in the script:
```python
img.save(output_path, 'JPEG', quality=98, optimize=True)
```

## Credits

- Generated using Python PIL/Pillow library
- Design inspired by agricultural photography
- Optimized for Kisaan marketplace branding

## License

Part of the Kisaan marketplace project.

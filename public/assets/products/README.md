# NexoGen Pharma — transparent product cutouts

Six cutouts generated from the original product photographs without altering the printed labels or packaging artwork. Backgrounds and floor shadows were removed using individually drawn object masks; small light halos may remain around white objects on bright backgrounds.

## Use in Angular

Copy the `products/` directory into `public/assets/products/` in an Angular application configured to serve public assets. The corresponding URLs are listed in `products.json`.

Use **WebP** in the website for smaller files, and **PNG** if lossless processing or manual cleanup is needed.

```html
<img src="/assets/products/lumgen-care.webp" alt="LumGen-care Cream" width="600" height="400" />
```

Image aspect ratios vary intentionally and should be preserved using `object-fit: contain` rather than distortion.

## Notes

- `nexogen-massage-gel` includes the original carton and tube in the same cutout.
- `nexray-care-spray` includes the original carton and bottle.
- `lumgen-care` includes the jar and its separate lid.
- Crops have a small transparent safety margin for GSAP transformations.
- Inspect at final on-screen size, especially high-contrast backgrounds; original photographic highlights are close in color to the removed backdrops.

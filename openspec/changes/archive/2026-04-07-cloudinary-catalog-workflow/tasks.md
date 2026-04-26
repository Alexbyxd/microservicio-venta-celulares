# Tasks: Cloudinary Catalog Workflow

## Phase 1: Dependencies (Priority: High)

- [ ] 1.1 Install `cloudinary` package in `backend/catalog-ms` (npm install cloudinary)
- [ ] 1.2 Install `next-cloudinary` package in `frontend` (npm install next-cloudinary)
- [ ] 1.3 Verify `.env` has `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (backend)
- [ ] 1.4 Verify `.env.local` has `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (frontend for CldImage)

## Phase 2: Backend - Cloudinary Configuration (Priority: High)

- [ ] 2.1 Add Cloudinary env vars to `backend/catalog-ms/src/config/envs.ts` - Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to Joi schema with validation
- [ ] 2.2 Create `backend/catalog-ms/src/config/cloudinary.service.ts` - Implement CloudinaryService with: uploadFromUrl(url), isCloudinaryUrl(url), handle errors gracefully
- [ ] 2.3 Create `backend/catalog-ms/src/config/cloudinary.module.ts` - NestJS Module exporting CloudinaryService
- [ ] 2.4 Update `backend/catalog-ms/src/products/products.module.ts` - Import CloudinaryModule in imports array

## Phase 3: Backend - Products Service Integration (Priority: High)

- [ ] 3.1 Modify `backend/catalog-ms/src/products/products.service.ts` create() method - Process images array: for each URL, check if Cloudinary, skip if true, upload if no, handle errors gracefully (log and continue)
- [ ] 3.2 Ensure create() saves product with Cloudinary URLs in images field
- [ ] 3.3 Test: Create product with 2 external URLs -> both uploaded to Cloudinary
- [ ] 3.4 Test: Create product with 1 Cloudinary URL -> skipped, original kept
- [ ] 3.5 Test: Create product with 1 invalid URL -> logs error, continues, product created

## Phase 4: Frontend - ImagePreview Component (Priority: High)

- [ ] 4.1 Create `frontend/components/ui/image-preview.tsx` - Props: urls (string comma-separated), onChange?: (urls: string[]) => void. Features: parse URLs, render 48x48 thumbnails grid, show loading state (spinner), show error state, show delete button on hover
- [ ] 4.2 Implement internal state with ImageItem[] (url, status: loading|loaded|error)
- [ ] 4.3 Handle onClick delete button -> remove from array, call onChange with updated URLs
- [ ] 4.4 Test: Empty string renders no thumbnails
- [ ] 4.5 Test: Valid URLs render thumbnails, invalid URLs show error state
- [ ] 4.6 Test: Delete button removes image and calls onChange with updated array

## Phase 5: Frontend - Create Page Integration (Priority: HIGH)

- [ ] 5.1 Update `frontend/app/admin/catalog/create/page.tsx` - Import ImagePreview component
- [ ] 5.2 Add ImagePreview below images field (Field component)
- [ ] 5.3 Pass form.watch("images") as urls prop
- [ ] 5.4 Pass onChange that updates form.setValue("images", joinedUrls)
- [ ] 5.5 Verify preview updates in real-time as user types URLs

## Phase 6: Frontend - Catalog Page Integration (Priority: MEDIUM)

- [ ] 6.1 Update `frontend/app/admin/catalog/page.tsx` - Import CldImage from next-cloudinary
- [ ] 6.2 Replace `<img>` with `<CldImage>` in product display
- [ ] 6.3 Pass width=48, height=48, crop="fill" props
- [ ] 6.4 Extract public ID from Cloudinary URL or use src as-is for non-Cloudinary URLs
- [ ] 6.5 Handle fallback for non-Cloudinary URLs (use original src)

## Phase 7: Backend Testing (Priority: HIGH)

- [ ] 7.1 Create `backend/catalog-ms/src/products/products.service.spec.ts`
- [ ] 7.2 Mock Cloudinary SDK with jest.mock
- [ ] 7.3 Test: create() with 2 external URLs -> CloudinaryService.uploadFromUrl called twice
- [ ] 7.4 Test: create() with 1 Cloudinary URL -> skip upload, keep original URL
- [ ] 7.5 Test: create() with invalid URL -> logs error, product created with empty images
- [ ] 7.6 Test: create() without images field -> works normally, no Cloudinary calls

## Phase 8: Frontend Testing (Priority: MEDIUM)

- [ ] 8.1 Create `frontend/components/ui/image-preview.spec.tsx`
- [ ] 8.2 Setup Vitest + React Testing Library if not existing
- [ ] 8.3 Test: renders empty when urls=""
- [ ] 8.4 Test: renders thumbnails for valid comma-separated URLs
- [ ] 8.5 Test: shows error state for invalid URL
- [ ] 8.6 Test: delete button calls onChange with updated array
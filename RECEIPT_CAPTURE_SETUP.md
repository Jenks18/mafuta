# Receipt Capture Setup Guide

## Overview
This guide covers the setup required to enable receipt photo capture with Google Vision OCR.

---

## 1. Google Vision API Setup

### Step 1: Enable Google Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Cloud Vision API**:
   - Navigate to APIs & Services → Library
   - Search for "Cloud Vision API"
   - Click "Enable"

### Step 2: Create API Key
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → API Key
3. Copy the API key
4. (Optional but recommended) Restrict the API key:
   - Set Application restrictions to "HTTP referrers"
   - Add your domains (e.g., `*.yourdomain.com/*`)
   - Set API restrictions to only "Cloud Vision API"

### Step 3: Add to Environment Variables
Add to your `.env` file:
```bash
VITE_GOOGLE_VISION_API_KEY=your_api_key_here
```

---

## 2. Supabase Storage Setup

### Step 1: Create Storage Bucket
Run this in your Supabase SQL Editor:

```sql
-- Create receipts storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts',
  'receipts',
  true,  -- Public bucket for easy access
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/webp']
);

-- Set up RLS policies for receipts bucket
CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Users can view receipts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'receipts');

CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'receipts' AND owner = auth.uid());
```

### Step 2: Run Database Migration
Apply the receipt OCR fields migration:

```bash
# If using Supabase CLI
supabase db push

# Or run manually in Supabase SQL Editor
# Copy contents of supabase/migrations/020_add_receipt_ocr_fields.sql
```

---

## 3. Testing the Feature

### Test with Sample Receipt
1. Log in to your app
2. Go to Transactions page
3. Click "Scan Receipt" button
4. Upload a test receipt image
5. Verify OCR extracts:
   - Amount
   - Date
   - Station name
   - Fuel type (if visible)

### Expected Behavior
- **High confidence (80%+)**: Auto-fill all fields, mark as completed
- **Medium confidence (60-79%)**: Auto-fill with warning badge
- **Low confidence (<60%)**: Require manual review flag
- **Missing critical data**: Require manual review flag

---

## 4. Cost Estimation

### Google Vision API Pricing
- **First 1,000 requests/month**: FREE
- **1,001 - 5,000,000**: $1.50 per 1,000 requests
- **5M+**: Volume discounts available

### Example Monthly Costs (after free tier)
- 100 receipts/month: FREE
- 1,000 receipts/month: FREE  
- 5,000 receipts/month: ~$6/month
- 10,000 receipts/month: ~$13.50/month

### Supabase Storage
- **Free tier**: 1GB storage, 2GB bandwidth
- **Pro tier**: 100GB storage, 200GB bandwidth included
- Images are typically 500KB-2MB each

---

## 5. Production Checklist

Before launching:

- [ ] Google Vision API key configured in production
- [ ] API key restricted to production domains
- [ ] Supabase storage bucket created
- [ ] Storage RLS policies applied
- [ ] Database migration applied
- [ ] Test receipt upload end-to-end
- [ ] Monitor API usage in Google Cloud Console
- [ ] Set up billing alerts (recommended at 80% of free tier)

---

## 6. Troubleshooting

### "OCR service not configured"
- Check `VITE_GOOGLE_VISION_API_KEY` is set in `.env`
- Restart dev server after adding env variable
- Verify API key is valid in Google Cloud Console

### "Failed to upload receipt"
- Check Supabase storage bucket exists
- Verify bucket is public or RLS policies allow access
- Check file size is under 10MB
- Verify file type is supported (jpg, png, heic, webp)

### Poor OCR accuracy
- Ensure receipt is well-lit and in focus
- Avoid glare or shadows
- Keep text horizontal (not rotated)
- Try different camera angles if initial scan fails

### Storage quota exceeded
- Monitor usage in Supabase dashboard
- Consider implementing automatic old receipt deletion
- Compress images before upload (optional optimization)

---

## 7. Future Enhancements

Potential improvements:
- **Image compression** before upload (reduce storage costs)
- **Batch processing** for multiple receipts
- **Receipt history view** with full image gallery
- **Advanced ML** for station logo recognition
- **Fraud detection** using duplicate image hashing
- **Multi-language support** for international receipts

---

## Support

For issues:
1. Check browser console for errors
2. Verify environment variables are set
3. Test with Google Vision API playground
4. Review Supabase storage logs

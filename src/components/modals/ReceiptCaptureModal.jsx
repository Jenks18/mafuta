import { useState, useRef } from 'react';
import { processReceiptOCR, imageToBase64, validateReceiptData } from '../services/receiptOCR';
import { supabase } from '../lib/supabaseClient';

/**
 * Receipt Capture Modal
 * Allows users to take photo or upload receipt image
 * Processes with Google Vision OCR
 */
export default function ReceiptCaptureModal({ isOpen, onClose, onReceiptProcessed }) {
  const [step, setStep] = useState('capture'); // capture, processing, review
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageSelected = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image too large. Please select an image under 10MB');
      return;
    }

    setError(null);
    setReceiptImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setStep('processing');
    await processImage(file);
  };

  const processImage = async (file) => {
    setProcessing(true);
    setError(null);

    try {
      // Convert to base64
      const base64Image = await imageToBase64(file);
      
      // Process with Google Vision API
      const result = await processReceiptOCR(base64Image);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process receipt');
      }

      // Validate extracted data
      const validation = validateReceiptData(result.data);
      
      setOcrData({
        ...result.data,
        rawText: result.rawText,
        validation,
      });
      setOcrConfidence(result.confidence);
      setStep('review');
      
    } catch (err) {
      console.error('OCR processing error:', err);
      setError(err.message);
      setStep('capture');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!receiptImage || !ocrData) return;

    try {
      setProcessing(true);

      // Upload image to Supabase Storage
      const fileName = `receipt-${Date.now()}-${receiptImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptImage, {
          contentType: receiptImage.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      // Return processed data to parent
      onReceiptProcessed({
        receiptImageUrl: publicUrl,
        ocrData: ocrData,
        ocrConfidence: ocrConfidence,
        ocrStatus: ocrData.validation.isValid ? 'completed' : 'manual',
        manualReviewRequired: ocrData.validation.requiresManualReview,
      });

      handleClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload receipt: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('capture');
    setReceiptImage(null);
    setReceiptPreview(null);
    setOcrData(null);
    setOcrConfidence(null);
    setError(null);
    onClose();
  };

  const handleRetake = () => {
    setStep('capture');
    setReceiptImage(null);
    setReceiptPreview(null);
    setOcrData(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'capture' && '📸 Capture Receipt'}
            {step === 'processing' && '⚙️ Processing...'}
            {step === 'review' && '📋 Review Details'}
          </h2>
          <button
            onClick={handleClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Capture */}
          {step === 'capture' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                Take a clear photo of your fuel receipt. Make sure all text is visible and in focus.
              </p>

              {/* Camera Button (Mobile) */}
              <div className="space-y-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageSelected(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </button>

                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelected(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose from Gallery
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 'processing' && (
            <div className="space-y-6 text-center">
              {receiptPreview && (
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="max-w-full max-h-96 mx-auto rounded-lg border border-gray-200"
                />
              )}
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="text-gray-600 font-medium">Processing receipt with AI...</p>
                <p className="text-sm text-gray-500">This usually takes 2-5 seconds</p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && ocrData && (
            <div className="space-y-6">
              {/* Receipt Preview */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={receiptPreview}
                  alt="Receipt"
                  className="w-full max-h-48 object-contain bg-gray-50"
                />
              </div>

              {/* Confidence Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">OCR Confidence</span>
                  <span className={`text-sm font-bold ${
                    ocrConfidence >= 80 ? 'text-emerald-600' :
                    ocrConfidence >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {ocrConfidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      ocrConfidence >= 80 ? 'bg-emerald-600' :
                      ocrConfidence >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${ocrConfidence}%` }}
                  />
                </div>
              </div>

              {/* Extracted Data */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Extracted Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                    <p className="text-lg font-bold text-gray-900">
                      {ocrData.amount ? `KES ${ocrData.amount.toFixed(2)}` : 'Not found'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <p className="text-lg font-bold text-gray-900">
                      {ocrData.date || 'Not found'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Station</label>
                    <p className="text-lg font-bold text-gray-900">
                      {ocrData.stationName || 'Not found'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Fuel Type</label>
                    <p className="text-lg font-bold text-gray-900">
                      {ocrData.fuelType || 'Not found'}
                    </p>
                  </div>

                  {ocrData.quantity && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                      <p className="text-lg font-bold text-gray-900">
                        {ocrData.quantity} L
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Issues */}
              {ocrData.validation && ocrData.validation.issues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-semibold text-yellow-800 mb-2">⚠️ Manual Review Required</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {ocrData.validation.issues.map((issue, idx) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  disabled={processing}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  Retake Photo
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={processing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {processing ? 'Uploading...' : 'Confirm & Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

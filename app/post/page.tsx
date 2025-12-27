"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Electronics", "Furniture", "Vehicles", "Books", "Jewelry", "Misc"];
const OFFICES = ["Mumbai Office", "Bangalore Office", "Delhi Office", "Pune Office", "Hyderabad Office"];

export default function PostItemPage() {
  const router = useRouter();
  const MAX_IMAGES = 5;
  const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB per image

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const availableSlots = Math.max(0, MAX_IMAGES - images.length);
    if (availableSlots === 0) {
      e.target.value = "";
      return;
    }

    const selectedFiles = Array.from(files).slice(0, availableSlots);
    const accepted: string[] = [];
    let rejectedForSize = 0;

    for (const file of selectedFiles) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        rejectedForSize += 1;
        continue;
      }
      // Store as a persistent data URL so refresh works.
      accepted.push(await readFileAsDataUrl(file));
    }

    if (rejectedForSize > 0) {
      setErrors((prev) => ({
        ...prev,
        images: `Some images were too large (max ${Math.floor(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))}MB each).`,
      }));
    } else if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted].slice(0, MAX_IMAGES));
    }

    // Allows selecting the same file again.
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.trim() && formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.trim() && formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Send data to API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          price: formData.price,
          location: formData.location,
          description: formData.description,
          images: images,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Listing posted successfully!");
        router.push("/home");
      } else {
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          alert(`${data.error || "Validation failed"}:\n- ${data.errors.join("\n- ")}`);
        } else {
          alert(data.error || "Failed to post listing");
        }
      }
    } catch (error) {
      console.error('Error posting listing:', error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Post an Item</h1>
              <p className="text-xs text-gray-500">Sell to fellow employees</p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Preview
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photos <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Max 5 images)</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.images && <p className="text-sm text-red-600 mt-2">{errors.images}</p>}
          </div>

          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., iPhone 13 Pro - Excellent Condition"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-purple-500/20 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title}</p>}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-purple-500/20 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-600 mt-2">{errors.category}</p>}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-sm text-red-600 mt-2">{errors.price}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-purple-500/20 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Office Location</option>
              {OFFICES.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </select>
            {errors.location && <p className="text-sm text-red-600 mt-2">{errors.location}</p>}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your item in detail..."
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-gray-900 focus:ring-2 focus:ring-blue-500/20 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && <p className="text-sm text-red-600 mt-2">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Include details like condition, age, reason for selling, etc.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Posting...
              </span>
            ) : (
              "Post Item"
            )}
          </button>
        </form>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-500 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {images.length > 0 && (
                <div className="relative h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || "No title"}</h2>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ₹{formData.price ? Number(formData.price).toLocaleString("en-IN") : "0"}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{formData.category || "No category"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{formData.location || "No location"}</span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{formData.description || "No description"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

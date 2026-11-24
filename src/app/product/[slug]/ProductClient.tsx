"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { Truck, PackageCheck } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { categoryForProduct, compareAtPrice, similarProducts } from "@/lib/catalog";
import { Stars } from "@/components/Stars";
import { DeliveryCheck } from "@/components/DeliveryCheck";
import { ProductReviews } from "@/components/ProductReviews";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { recordView } from "@/lib/reviews";
import { useStore } from "@/context/StoreContext";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductDetailSkeleton } from "@/components/Skeletons";
import { ProductCard } from "@/components/ProductCard";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { formatPrice, getStock } from "@/lib/pricing";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart, setBuyNowItem } = useStore();

  const found = getProductBySlug(params?.slug ?? "");

  const [loading, setLoading] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setSelectedColorIdx(0);
    setQuantity(1);
    if (params?.slug) recordView(params.slug);
    const timer = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(timer);
  }, [params?.slug]);

  if (!found) notFound();
  const product = found;

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  const category = categoryForProduct(product);
  const wasPrice = compareAtPrice(product);

  const activeColor = product.colors[selectedColorIdx] || {
    name: "Default",
    hex: product.defaultColor,
    secondaryHex: "#E5E7EB",
  };

  const stock = getStock(product);

  const handleBuyNow = () => {
    setBuyNowItem({ product, color: activeColor.name, quantity });
    router.push("/checkout?mode=buy-now");
  };

  const similarItems = similarProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/category/${category.slug}`} className="hover:text-brand-green">
              {category.name}
            </Link>
          </>
        )}
        {category && product.headphoneType && (
          <>
            <span>/</span>
            <Link
              href={`/category/${category.slug}?type=${encodeURIComponent(product.headphoneType)}`}
              className="hover:text-brand-green"
            >
              {product.headphoneType}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-semibold text-gray-900">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Product Gallery */}
        <div>
          <div className="flex h-[420px] sm:h-[470px] w-full items-center justify-center rounded-2xl bg-brand-surface p-10 transition-all duration-300">
            <div
              key={activeColor.name}
              className="animate-popIn flex items-center justify-center"
            >
              <ProductVisual
                type={product.visualType}
                emoji={product.emoji}
                color={activeColor.hex}
                secondaryColor={activeColor.secondaryHex}
                className="h-72 w-72 sm:h-80 sm:w-80"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.colors.slice(0, 4).map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                className={`flex h-24 items-center justify-center rounded-xl bg-brand-surface p-3 transition-all ${
                  selectedColorIdx === idx
                    ? "ring-2 ring-brand-green bg-white"
                    : "hover:bg-gray-200/70"
                }`}
              >
                <ProductVisual
                  type={product.visualType}
                  emoji={product.emoji}
                  color={c.hex}
                  secondaryColor={c.secondaryHex}
                  className="h-16 w-16"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-md">
              {product.description}
            </p>

            {/* Rating */}
            <div className="mt-3">
              <a href="#reviews" className="inline-block hover:opacity-80" aria-label="Jump to reviews">
                <Stars rating={product.rating} reviews={product.reviews} size="h-4 w-4" />
              </a>
            </div>

            {/* Price */}
            <div className="mt-6 border-y border-gray-100 py-5">
              {wasPrice && (
                <p className="mb-1 flex items-center gap-2 text-sm">
                  <span className="text-gray-400 line-through">{formatPrice(wasPrice)}</span>
                  <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[11px] font-bold text-white">
                    {product.offer}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    You save {formatPrice(wasPrice - product.price)}
                  </span>
                </p>
              )}
              <p className="text-2xl font-extrabold text-gray-900">
                {formatPrice(product.price)}
                {product.monthlyPrice && (
                  <span className="font-bold">
                    {" "}
                    or {formatPrice(product.monthlyPrice)}/month
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500">Inclusive of all taxes</p>
              {product.monthlyPrice && (
                <p className="mt-1 text-xs text-gray-500">
                  Suggested payments with 6 months special financing
                </p>
              )}
            </div>

            {/* Choose a Color */}
            <div className="mt-6 border-b border-gray-100 pb-6">
              <p className="text-sm font-bold text-gray-900">
                Choose a Color{" "}
                <span className="font-normal text-gray-500 ml-1">
                  ({activeColor.name})
                </span>
              </p>
              <div className="mt-3 flex items-center gap-3">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`relative h-9 w-9 rounded-full p-0.5 transition-transform hover:scale-110 ${
                      selectedColorIdx === idx
                        ? "ring-2 ring-brand-green ring-offset-2"
                        : ""
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full border border-black/10"
                      style={{
                        background: `linear-gradient(180deg, ${c.secondaryHex} 50%, ${c.hex} 50%)`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <QuantityStepper
                value={quantity}
                max={stock}
                onChange={(q) => setQuantity(Math.min(stock, Math.max(1, q)))}
              />

              <div className="text-xs leading-snug">
                <p className="text-gray-700">
                  Only{" "}
                  <span className="font-bold text-brand-orange">
                    {stock} Items
                  </span>{" "}
                  Left!
                </p>
                <p className="text-gray-500">Don&apos;t miss it</p>
              </div>
            </div>

            {/* Buy Now & Add to Cart */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 min-w-[160px] rounded-full bg-brand-green px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-greenHover active:scale-95"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() =>
                  addToCart(product, activeColor.name, quantity, { openDrawer: true })
                }
                className="flex-1 min-w-[160px] rounded-full border border-brand-green bg-white px-8 py-3.5 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white active:scale-95"
              >
                Add to Cart
              </button>
            </div>

            {/* Delivery Info Card */}
            <div className="mt-7 divide-y divide-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3.5 p-4">
                <Truck className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    Free Delivery
                  </p>
                  <DeliveryCheck />
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-4">
                <PackageCheck className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Return Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Free 30days Delivery Returns.{" "}
                    <Link href="/delivery#returns" className="underline hover:text-brand-green">
                      Details
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Specifications */}
      <section className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-xl font-bold text-gray-900">
          {product.brand} {product.name} Full Specifications
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* General Card */}
          <div className="rounded-2xl bg-brand-surface p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">General</h3>
            <div className="divide-y divide-gray-200/60 rounded-xl bg-white px-5">
              {Object.entries(product.specs.general).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-3 text-xs sm:text-sm"
                >
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Card */}
          <div className="rounded-2xl bg-brand-surface p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Product details
            </h3>
            <div className="divide-y divide-gray-200/60 rounded-xl bg-white px-5">
              {Object.entries(product.specs.details).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-3 text-xs sm:text-sm"
                >
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductReviews product={product} />

      {/* Similar Items You Might Like */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Similar Items You Might Like
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {similarItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}

import React from "react";

export function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Banner Skeleton */}
      <div className="h-56 w-full rounded-2xl skeleton-shimmer" />

      {/* Filter Pills Skeleton */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full skeleton-shimmer" />
          ))}
        </div>
        <div className="h-9 w-24 rounded-full skeleton-shimmer" />
      </div>

      {/* Heading Skeleton */}
      <div className="mt-8 h-7 w-56 rounded-lg skeleton-shimmer" />

      {/* 4-Col Product Grid Skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-64 w-full rounded-2xl skeleton-shimmer" />
            <div className="flex justify-between">
              <div className="h-4 w-36 rounded skeleton-shimmer" />
              <div className="h-4 w-12 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-44 rounded skeleton-shimmer" />
            <div className="h-8 w-28 rounded-full skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-72 rounded skeleton-shimmer mb-8" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="h-[460px] w-full rounded-2xl skeleton-shimmer" />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="h-9 w-64 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          <div className="h-8 w-48 rounded skeleton-shimmer mt-4" />
          <div className="flex gap-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-9 rounded-full skeleton-shimmer" />
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-44 rounded-full skeleton-shimmer" />
            <div className="h-12 w-44 rounded-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

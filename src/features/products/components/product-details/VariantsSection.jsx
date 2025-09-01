"use client";

import { useState } from "react";

export default function VariantsSection({
  variantBlocks = [],
  onVariantChange,
}) {
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  if (variantBlocks.length === 0) return null;

  const displayedBlocks = showAll ? variantBlocks : variantBlocks.slice(0, 8);
  const hasMore = variantBlocks.length > 8;

  return (
    <div className="space-y-3">
      {/* Header with view controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Variants</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {variantBlocks.length}
          </span>
        </div>

        {variantBlocks.length > 6 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            >
              {viewMode === "grid" ? "☰" : "⊞"}
            </button>
          </div>
        )}
      </div>

      {/* Variants display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {displayedBlocks.map((block) => (
            <CompactVariantCard
              key={block.id}
              block={block}
              onClick={() => onVariantChange(block)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {displayedBlocks.map((block) => (
            <CompactVariantRow
              key={block.id}
              block={block}
              onClick={() => onVariantChange(block)}
            />
          ))}
        </div>
      )}

      {/* Show more/less button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showAll ? `Show Less` : `Show ${variantBlocks.length - 8} More`}
        </button>
      )}
    </div>
  );
}

function CompactVariantCard({ block, onClick }) {
  const hasDiscount = block.comparePrice && block.comparePrice > block.price;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg cursor-pointer transition-all duration-150 border
        ${
          block.isSelected
            ? "border-black bg-black text-white"
            : block.isAvailable
            ? "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
        }
      `}
    >
      {/* Availability dot */}
      <div
        className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
          block.isAvailable ? "bg-green-500" : "bg-red-400"
        }`}
      />

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded text-[10px]">
          -
          {Math.round(
            ((block.comparePrice - block.price) / block.comparePrice) * 100
          )}
          %
        </div>
      )}

      {/* Content */}
      <div className="space-y-1">
        <div
          className={`text-xs font-medium truncate ${
            block.isSelected ? "text-white" : "text-gray-900"
          }`}
        >
          {block.name}
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className={`text-sm font-bold ${
              block.isSelected ? "text-white" : "text-gray-900"
            }`}
          >
            ${Number.parseFloat(block.price).toFixed(2)}
          </span>

          {hasDiscount && (
            <span
              className={`text-xs line-through ${
                block.isSelected ? "text-gray-300" : "text-gray-400"
              }`}
            >
              ${Number.parseFloat(block.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactVariantRow({ block, onClick }) {
  const hasDiscount = block.comparePrice && block.comparePrice > block.price;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 border
        ${
          block.isSelected
            ? "border-black bg-black text-white"
            : block.isAvailable
            ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
        }
      `}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Status indicator */}
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            block.isAvailable ? "bg-green-500" : "bg-red-400"
          }`}
        />

        {/* Name */}
        <span
          className={`text-sm font-medium truncate ${
            block.isSelected ? "text-white" : "text-gray-900"
          }`}
        >
          {block.name}
        </span>
      </div>

      {/* Price section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {hasDiscount && (
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
            -
            {Math.round(
              ((block.comparePrice - block.price) / block.comparePrice) * 100
            )}
            %
          </span>
        )}

        <div className="text-right">
          <div
            className={`text-sm font-bold ${
              block.isSelected ? "text-white" : "text-gray-900"
            }`}
          >
            ${Number.parseFloat(block.price).toFixed(2)}
          </div>

          {hasDiscount && (
            <div
              className={`text-xs line-through ${
                block.isSelected ? "text-gray-300" : "text-gray-400"
              }`}
            >
              ${Number.parseFloat(block.comparePrice).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animations";

export function ProjectSkeleton() {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <StaggerItem key={i} className="h-full">
          <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-full">
            {/* Image Skeleton */}
            <div className="relative h-56 w-full bg-gray-200 animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="p-8 flex flex-col flex-grow">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />
              {/* Description Lines */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded animate-pulse w-4/6" />
              </div>
              {/* Bottom Border & Action */}
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

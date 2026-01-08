"use client"

import React from "react"
import Image from "next/image"
import { getCardIcon } from "@/components/Cards/card-icons"

interface ServiceCardProps {
  id: string
  name: string
  description: string | null
  image?: string | null
  onOrderClick?: () => void
}

export default function ServiceCard({
  name,
  description,
  image,
  onOrderClick,
}: ServiceCardProps) {
  // Determine if image is a custom image path or an icon key
  const isCustomImage = image && !image.startsWith("icon_")
  const iconKey = !isCustomImage && image ? image : null

  // Color mapping for each icon - matches the Card components
  const colorMap: { [key: string]: { bg: string; hover: string } } = {
    icon_1: { bg: "bg-[--RepasBlue]", hover: "xl:hover:bg-[#505ba3]" },
    icon_2: { bg: "bg-[#984447]", hover: "xl:hover:bg-[#984447]/80" },
    icon_3: { bg: "bg-[#45B69C]", hover: "xl:hover:bg-[#45B69C]/80" },
    icon_4: { bg: "bg-[#E3B23C]", hover: "xl:hover:bg-[#E3B23C]/80" },
    icon_5: { bg: "bg-[#068D9D]", hover: "xl:hover:bg-[#068D9D]/80" },
    icon_6: { bg: "bg-black", hover: "xl:hover:bg-black/80" },
  }

  const colors = colorMap[iconKey || "icon_1"] || colorMap.icon_1
  const cardClassName = `group w-full flex flex-col py-3 px-2 rounded-[10px] md:px-4 md:py-6 lg:h-[382px] xl:h-[360px] ${colors.bg} ${colors.hover}`

  return (
    <a
      rel="alternate"
      className={cardClassName}
      href="#"
      style={{ textDecoration: "none" }}
      onClick={(e) => {
        e.preventDefault()
        onOrderClick?.()
      }}
    >
      {/* Icon/Image Section */}
      <div className="h-[74px] md:hidden flex flex-col justify-center items-center mx-auto">
        {isCustomImage && image ? (
          <Image
            src={image}
            alt={name}
            width={49}
            height={50}
            className="mx-auto object-contain"
          />
        ) : (
          getCardIcon(iconKey, false)
        )}
      </div>

      <div className="hidden h-[120px] w-[120px] md:flex flex-col justify-center items-center mx-auto">
        {isCustomImage && image ? (
          <Image
            src={image}
            alt={name}
            width={97}
            height={102}
            className="mx-auto object-contain"
          />
        ) : (
          getCardIcon(iconKey, true)
        )}
      </div>

      {/* Service Name */}
      <div className={`my-1 md:my-4 text-white font-bold text-center group-hover:underline`}>
        <h4>{name}</h4>
      </div>

      {/* Service Description */}
      <div className={`font-poppins text-sm md:text-base font-normal text-white leading-[22px] md:leading-6 text-center break-words`}>
        {description}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Order Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onOrderClick?.()
        }}
        className="border font-bold mt-3 w-full h-10 border-white rounded-[10px] text-white text-xs leading-[14px] md:h-[50px] md:text-sm md:leading-[22px] font-poppins transition-all duration-300 ease-in-out xl:group-hover:bg-white xl:group-hover:border-white xl:group-hover:text-red-600"
      >
        Užsisakyti
      </button>
    </a>
  )
}
import React, { useState } from "react";
import { Zap, Shield, Headphones, Tag } from "lucide-react";

export default function FeaturesHome() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      icon: Zap,
      title: "Internet cepat",
      description: "Kecepatan tinggi & stabil",
    },
    {
      id: 2,
      icon: Shield,
      title: "Fiber optik",
      description: "100% jaringan fiber optik",
    },
    {
      id: 3,
      icon: Headphones,
      title: "Support teknis professional",
      description: "Tim teknis siap membantu",
    },
    {
      id: 4,
      icon: Tag,
      title: "Harga hemat",
      description: "Paket internet terjangkau",
    },
  ];

  const badges = [
    { id: 1, label: "100% Fiber optik", bgColor: "bg-blue-600" },
    { id: 2, label: "Unlimited", bgColor: "bg-green-600" },
    { id: 3, label: "Support teknis professional", bgColor: "bg-cyan-600" },
  ];

  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === feature.id;

            return (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                border border-gray-200 rounded-xl py-10 cursor-pointer mb-5
                  transition-all duration-200 ease-out
                  ${isHovered ? "shadow-lg -translate-y-1 bg-gray-50" : "shadow-sm"}
                `}>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <Icon size={40} strokeWidth={2} className="text-blue-600" />
                </div>

                {/* Title */}
                <h5 className="text-center text-xl font-medium text-gray-900 mb-2">
                  {feature.title}
                </h5>

                {/* Description */}
                <p className="text-center text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() =>
                setSelectedBadge(selectedBadge === badge.id ? null : badge.id)
              }
              className={`
                ${badge.bgColor} text-white px-4 py-2 rounded-md text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${
                  selectedBadge === badge.id
                    ? "scale-105 opacity-100 shadow-lg"
                    : "scale-100 opacity-90 hover:opacity-100"
                }
              `}>
              {badge.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
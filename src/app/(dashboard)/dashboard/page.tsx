"use client";

import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ animals: 0, volunteers: 0, requests: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/animals").then((r) => r.json()),
      fetch("/api/volunteers").then((r) => r.json()),
      fetch("/api/adoption").then((r) => r.json()),
    ]).then(([animals, volunteers, requests]) => {
      setStats({
        animals: Array.isArray(animals) ? animals.length : 0,
        volunteers: Array.isArray(volunteers) ? volunteers.length : 0,
        requests: Array.isArray(requests) ? requests.length : 0,
      });
    });
  }, []);

  const cards = [
    { label: "Тварини", value: stats.animals, color: "bg-[#ced48c]/20 text-[#5b7765]", href: "/dashboard/animals" },
    { label: "Волонтери", value: stats.volunteers, color: "bg-blue-50 text-blue-600", href: "/dashboard/volunteers" },
    { label: "Анкети", value: stats.requests, color: "bg-orange-50 text-orange-600", href: "/dashboard/requests" },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-400 font-medium mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color} inline-flex items-center justify-center w-14 h-14 rounded-xl`}>
              {card.value}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

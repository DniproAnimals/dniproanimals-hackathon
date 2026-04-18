"use client";
import { motion } from "motion/react";
import Image from "next/image";

export function HeroCollage() {
  return (
    <motion.div
      className="flex-1 w-full max-w-lg mx-auto relative"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className="absolute inset-0 bg-primary rounded-full blur-[80px] opacity-20 -z-10" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 pt-8">
          <Image
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"
            alt="Собака з притулку"
            width={300}
            height={400}
            className="rounded-3xl object-cover shadow-lg border-4 border-white h-48 w-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop"
            alt="Кіт з притулку"
            width={300}
            height={300}
            className="rounded-3xl object-cover shadow-lg border-4 border-white h-64 w-full"
          />
        </div>
        <div className="space-y-4">
          <Image
            src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop"
            alt="Кошеня"
            width={300}
            height={300}
            className="rounded-3xl object-cover shadow-lg border-4 border-white h-64 w-full"
          />
          <Image
            src="/happy-dog.jpg"
            alt="Щасливий собака"
            width={300}
            height={400}
            className="rounded-3xl object-cover shadow-lg border-4 border-white h-48 w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

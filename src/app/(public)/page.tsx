"use client";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/shared/lib/utils";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconHeartFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

// Subtle Paw icon for the background pattern
const PawIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 20c-3 0-5.5-2.5-6-5s3-6 7-6 7 3.5 7 6-3 5-8 5z" />
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#Fcfcfc] text-foreground selection:bg-primary selection:text-foreground relative z-0 pb-24 md:pb-0 overflow-hidden">
      {/* Background Decorative Paws */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[-1]">
        <PawIcon className="absolute top-[5%] left-[5%] size-32 -rotate-12" />
        <PawIcon className="absolute top-[20%] right-[10%] size-48 rotate-45" />
        <PawIcon className="absolute top-[40%] left-[15%] size-24 rotate-12" />
        <PawIcon className="absolute bottom-[30%] right-[20%] size-40 -rotate-45" />
        <PawIcon className="absolute bottom-[10%] left-[30%] size-20 rotate-90" />
        <PawIcon className="absolute top-[60%] right-[5%] size-32 rotate-180" />
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge
              variant="soft"
              size="lg"
              className="mb-6 border border-primary/40 shadow-sm font-bold"
            >
              <span className="text-lg">🐾</span> Благодійний фонд · м. Дніпро
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Ми — <span className="text-green-secondary">DniproAnimals</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Рятуємо тих, хто не може попросити про допомогу. Понад 300 тварин
              у нашому притулку щодня отримують шанс на нове життя завдяки
              небайдужим людям.
            </p>

            {/* PROMINENT SOCIAL MEDIA */}
            <div className="mb-10">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Слідкуйте за життям хвостиків:
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href="https://instagram.com/dniproanimals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://t.me/itsmotherofcats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0088cc] text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Telegram
                </a>
                <a
                  href="https://facebook.com/dniproanimals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1877F2] text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  Facebook
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.37-3.4-5.74.04-2.18 1.34-4.14 3.26-5.11 1.25-.66 2.7-.91 4.11-.83V15c-.86-.03-1.73.18-2.48.64-.84.5-1.4 1.4-1.46 2.37-.05 1.05.47 2.05 1.33 2.6.93.58 2.11.66 3.12.28 1.18-.45 1.97-1.64 2.02-2.93.02-3.19.01-6.38.01-9.56 0-2.8-.02-5.61.02-8.42z" />
                  </svg>
                  TikTok
                </a>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <Button
                asChild
                variant="secondary"
                size="xl"
                className="rounded-2xl shadow-lg hover:-translate-y-1"
              >
                <Link href="/donate">Допомогти притулку</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-2 border-gray-200 hover:border-primary hover:bg-gray-50 rounded-2xl"
              >
                <Link href="/animals">Знайти друга</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Image Collage */}
          <motion.div
            className="flex-1 w-full max-w-lg mx-auto relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-primary rounded-full blur-[80px] opacity-20 -z-10"></div>
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
        </div>
      </div>

      {/* Stats — floating cards */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              number: "300+",
              label: "Тварин у притулку",
              accent: "text-primary",
            },
            {
              number: "2015",
              label: "Рік заснування",
              accent: "text-blue-400",
            },
            { number: "23K", label: "Підписників", accent: "text-pink-400" },
            { number: "24/7", label: "Піклування", accent: "text-amber-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Card className="bg-white p-5 shadow-lg shadow-black/5 text-center border-0">
                <p className={cn("text-3xl md:text-4xl font-bold", s.accent)}>
                  {s.number}
                </p>
                <p className="text-xs text-gray-medium mt-1">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story — two column with offset */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-20 md:py-28">
        <div className="md:flex md:gap-16 md:items-center">
          <motion.div
            className="flex-1 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              Наша історія
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Від волонтерки до фонду, що рятує сотні життів
            </h2>
            <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
              <p>
                <strong className="text-foreground">Інесса Капінус</strong>{" "}
                заснувала DniproAnimals у 2015 році. Спочатку це була ініціатива
                однієї волонтерки — сьогодні це зареєстрований фонд з командою,
                притулком та понад 300 підопічними.
              </p>
              <p>
                Притулок розташований на{" "}
                <strong className="text-foreground">вул. Героїв Дніпра</strong>{" "}
                і повністю існує за рахунок пожертвувань — жодного державного
                фінансування.
              </p>
              <p>
                З 2022 року фонд активно евакуює поранених та покинутих тварин
                із зон бойових дій по всій Україні.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="md:w-96 shrink-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="DniproAnimals"
                  width={384}
                  height={384}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-sm font-bold text-foreground">З 2015 року</p>
                <p className="text-xs text-foreground/60">рятуємо тварин</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission — card grid */}
      <div className="bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 text-center">
            Що ми робимо
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Кожен день — це боротьба за життя
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "🏠",
                title: "Усиновлення",
                desc: "Знаходимо люблячі родини для наших підопічних. Кожна тварина проходить огляд та вакцинацію.",
              },
              {
                icon: "🚑",
                title: "Евакуація",
                desc: "Рятуємо тварин із зон бойових дій та обстрілів по всій Україні з 2022 року.",
              },
              {
                icon: "💉",
                title: "Ветеринарія",
                desc: "Лікування, реабілітація, вакцинація та стерилізація — повний цикл ветеринарної допомоги.",
              },
              {
                icon: "🔍",
                title: "Пошук загублених",
                desc: "Платформа для розміщення оголошень про загублених тварин та возз'єднання з господарями.",
              },
              {
                icon: "📚",
                title: "Освіта",
                desc: "Просвіта щодо гуманного та відповідального ставлення до домашніх тварин.",
              },
              {
                icon: "🤝",
                title: "Волонтерство",
                desc: "Координація волонтерів для кормління, вигулу, прибирання та соціалізації тварин.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily needs — horizontal scroll feel */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 text-center">
          Щоденні потреби
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
          300+ тварин потребують
          <br />
          вашої допомоги
        </h2>
        <p className="text-sm text-gray-medium text-center mb-10 max-w-lg mx-auto">
          Важливо купувати тільки зі списку — це перевірені корми, ліки та
          засоби догляду, які не зашкодять хвостикам
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: "50 кг",
              label: "Сухого корму",
              sub: "щодня",
              color: "bg-amber-50 border-amber-200",
            },
            {
              value: "2.5 кг",
              label: "Вологого корму",
              sub: "щодня",
              color: "bg-green-50 border-green-200",
            },
            {
              value: "∞",
              label: "Ліків та вакцин",
              sub: "постійно",
              color: "bg-red-50 border-red-200",
            },
            {
              value: "∞",
              label: "Любові",
              sub: "завжди",
              color: "bg-primary/20 border-primary/40",
            },
          ].map((n, i) => (
            <motion.div
              key={n.label}
              className={cn(n.color, "border rounded-2xl p-6 text-center")}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {n.value}
              </p>
              <p className="text-sm font-medium text-foreground">{n.label}</p>
              <p className="text-xs text-gray-medium mt-0.5">{n.sub}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="primary" size="lg">
            <Link href="/donate">
              <IconHeartFilled size={18} />
              Переглянути список потреб
            </Link>
          </Button>
        </div>
      </div>

      {/* Founder — quote style */}
      <div className="bg-primary/10">
        <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 md:py-24">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="size-20 rounded-full bg-primary mx-auto flex items-center justify-center text-4xl mb-6">
              🐾
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6 italic">
              &laquo;Ми — невелика команда волонтерів, яка робить все можливе
              для порятунку тварин. Наш притулок завжди відкритий для тих, хто
              хоче навістити наших мешканців.&raquo;
            </blockquote>
            <p className="text-base font-bold text-foreground">
              Інесса Капінус
            </p>
            <p className="text-sm text-gray-medium">
              Засновниця БО &laquo;Дніпро Енімалс&raquo;
            </p>
            <div className="flex gap-3 mt-4 justify-center">
              <a
                href="https://instagram.com/dniproanimals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-foreground transition-colors"
              >
                <IconBrandInstagram size={20} />
              </a>
              <a
                href="https://t.me/itsmotherofcats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-foreground transition-colors"
              >
                <IconBrandTelegram size={20} />
              </a>
              <a
                href="https://facebook.com/dniproanimals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-foreground transition-colors"
              >
                <IconBrandFacebook size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LOCATION & CONTACTS */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <motion.div
          className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold mb-8 text-foreground">
              Чекаємо в гості!
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="size-10 bg-primary/20 text-green-secondary rounded-full flex items-center justify-center shrink-0">
                  <IconMapPinFilled size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-1">
                    Адреса притулку
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    м. Дніпро, вул. Героїв Дніпра
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 bg-primary/20 text-green-secondary rounded-full flex items-center justify-center shrink-0">
                  <IconPhoneFilled size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-1">
                    Телефон керівника
                  </p>
                  <a
                    href="tel:+380966601817"
                    className="text-lg font-bold text-gray-800 hover:text-green-secondary"
                  >
                    +380 96 660 18 17
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 bg-primary/20 text-green-secondary rounded-full flex items-center justify-center shrink-0">
                  <IconMailFilled size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:dniproanimals.org@gmail.com"
                    className="text-lg font-bold text-gray-800 hover:text-green-secondary"
                  >
                    dniproanimals.org@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="mt-8 w-full sm:w-auto self-start shadow-md"
            >
              <a
                href="https://www.google.com/maps/search/?api=1&query=вул.+Героїв+Дніпра,+Дніпро"
                target="_blank"
                rel="noopener noreferrer"
              >
                Відкрити на карті
              </a>
            </Button>
          </div>
          <div className="md:w-1/2 bg-gray-100 min-h-75 relative">
            <iframe
              title="Розташування DniproAnimals"
              width="100%"
              height="100%"
              className="absolute inset-0"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=вул.+Героїв+Дніпра,+Дніпро,+Україна&output=embed&z=14"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

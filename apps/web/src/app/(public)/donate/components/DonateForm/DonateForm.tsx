"use client";

import { useFoundationQuery } from "@/shared/query-hooks";
import { Form } from "@dniproanimals/ui";
import { motion } from "motion/react";
import { useState } from "react";
import { DonateAmountField } from "./components/DonateAmountField";
import { DonateSubmitButton } from "./components/DonateSubmitButton";
import { useDonateForm } from "./hooks/useDonateForm";

export function DonateForm() {
  const { data: foundation } = useFoundationQuery();
  const form = useDonateForm();
  const [error, setError] = useState("");

  const onSubmit = form.handleSubmit(({ amount }) => {
    setError("");
    const jarUrl = foundation?.monobankJarUrl;

    if (!jarUrl) {
      setError("Посилання на Monobank-банку не налаштоване");
      return;
    }

    const paymentUrl = `${jarUrl}${jarUrl.includes("?") ? "&" : "?"}amount=${amount}`;
    window.open(paymentUrl, "_blank");
  });

  return (
    <Form {...form}>
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-120 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 relative shrink-0"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-foreground">
          Швидка пожертва онлайн
        </h2>

        <DonateAmountField />

        {!!error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <DonateSubmitButton />
      </motion.form>
    </Form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

/**
 * There is no backend, so this form does not pretend to send anything.
 * It composes a message and hands it to the visitor's own email client.
 *
 * That is stated in the button label and in the helper text, because a
 * form that silently does nothing -- or that claims "message sent!" when
 * nothing was sent -- is worse than no form at all.
 *
 * The direct email address is shown above this form regardless, so this
 * is a convenience and never the only route.
 *
 * The address arrives as a prop rather than an import, which keeps the
 * whole content module out of the client bundle.
 */
export function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = [message, "", name ? "— " + name : ""].join("\n");
    const href =
      "mailto:" +
      email +
      "?subject=" +
      encodeURIComponent(subject || "Hello from your portfolio") +
      "&body=" +
      encodeURIComponent(lines);
    window.location.href = href;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field
        id="contact-name"
        label="Your name"
        autoComplete="name"
        value={name}
        onValueChange={setName}
      />
      <Field
        id="contact-subject"
        label="Subject"
        value={subject}
        onValueChange={setSubject}
      />
      <Field
        id="contact-message"
        label="Message"
        multiline
        value={message}
        onValueChange={setMessage}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary">
          Open in email app
        </Button>
        <p className="text-body-sm text-muted">
          This fills in a draft in whatever email app you use. Nothing is
          sent from this page.
        </p>
      </div>
    </form>
  );
}

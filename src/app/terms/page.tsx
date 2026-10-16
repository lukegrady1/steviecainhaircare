import type { Metadata } from "next";
import { LegalLink, LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms for using the ${site.name} website and booking a hair appointment in Oklahoma City, including how we confirm appointments by email.`,
  alternates: { canonical: "/terms/" },
};

/*
  Appointment communication is email only. If an SMS program is ever added,
  this page needs a section with: program description, "Message frequency
  varies", "Msg & data rates may apply", STOP/HELP, and a support contact.
*/
export default function TermsPage() {
  return (
    <LegalPage eyebrow="Terms & Conditions" title="The short version of the fine print." updated="October 16, 2026">
      <p>
        These Terms &amp; Conditions (“Terms”) govern your use of the {site.name} website and online
        booking, and the emails we send about your appointments. By using the site or booking an
        appointment, you agree to these Terms and to our{" "}
        <LegalLink href="/privacy/">Privacy Policy</LegalLink>.
      </p>

      <h2>Booking appointments</h2>
      <ul>
        <li>
          Appointments are booked through our online calendar or by phone. Online bookings are
          confirmed by email, with a reminder the day before.
        </li>
        <li>
          Please book with your own, accurate contact details so we can reach you about your
          appointment.
        </li>
        <li>
          If you need to reschedule or cancel, use the link in your confirmation or call us as early
          as you can so the time can go to someone else.
        </li>
        <li>
          Color services start with a free, required consultation so we can plan the look and the
          time it needs.
        </li>
      </ul>

      <h2>Prices</h2>
      <p>
        Prices on the Services page are current as of the date above and may change. Prices marked
        “from” are starting prices and depend on hair length, density, and detail; hourly services
        are billed by the time they take. Your final price is confirmed in the chair before we
        start.
      </p>

      <h2>Appointment emails</h2>
      <p>
        When you book online, {site.name} sends appointment-related emails to the address you
        provide: a booking confirmation, a reminder the day before, and reschedule or cancellation
        notices. These are part of the booking service, not marketing. We do not send appointment
        text messages, and we do not send marketing texts.
      </p>
      <p>
        You can unsubscribe from non-essential emails using the link in the message. If you
        unsubscribe from everything, you may not receive appointment reminders, so please check your
        confirmation for the date and time.
      </p>
      <p>
        <strong>Questions or help.</strong> Call us at <a href={site.phoneHref}>{site.phone}</a>
        {site.email ? (
          <>
            {" "}
            or email <a href={`mailto:${site.email}`}>{site.email}</a>
          </>
        ) : null}
        . How we handle your contact details, including your phone number, is described in our{" "}
        <LegalLink href="/privacy/">Privacy Policy</LegalLink>.
      </p>

      <h2>Using this website</h2>
      <ul>
        <li>
          The content, photos, and logo on this site belong to {site.name} or are used with
          permission. Please don’t copy or reuse them without asking.
        </li>
        <li>
          Please don’t misuse the site or booking calendar, for example by making bookings you
          don’t intend to keep or by attempting to interfere with how it works.
        </li>
        <li>
          The site links to third-party services such as Google Maps and our booking platform.
          Those services have their own terms and privacy policies.
        </li>
      </ul>

      <h2>Disclaimer and liability</h2>
      <p>
        The site is provided “as is”. We do our best to keep it accurate and available, but we
        don’t guarantee it will be error-free or uninterrupted. To the fullest extent permitted by
        law, {site.name} is not liable for indirect or consequential losses arising from use of the
        site. Nothing in these Terms limits liability that cannot be limited by law.
      </p>

      <h2>Governing law</h2>
      <p>These Terms are governed by the laws of the State of Oklahoma.</p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. The date at the top shows the latest version,
        and continued use of the site or our messaging after a change means you accept it.
      </p>

      <h2>Contact</h2>
      <p>
        {site.name}, {site.address.line1}, {site.address.city}, {site.address.state}{" "}
        {site.address.zip}. Phone: <a href={site.phoneHref}>{site.phone}</a>.
      </p>
    </LegalPage>
  );
}

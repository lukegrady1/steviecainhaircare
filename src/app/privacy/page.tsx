import type { Metadata } from "next";
import { LegalLink, LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} in Oklahoma City collects and uses the information you share when you book a hair appointment or contact us.`,
  alternates: { canonical: "/privacy/" },
};

/*
  Written for a one-stylist salon: the only data the site collects is what
  the booking widget asks for. Appointment communication is email only (no
  SMS program), so the phone number is described as a contact detail, not a
  messaging channel. The mobile-information sentence is kept verbatim: it is
  true, and it is the wording carriers look for if texting is ever added.
*/
export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy Policy" title="Your information stays between us." updated="October 16, 2026">
      <p>
        This Privacy Policy explains how {site.name} (“we”, “us”) collects, uses, and protects the
        information you share through this website, our online booking calendar, and our emails.
        By using the site or booking an appointment, you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <p>We only collect what we need to look after your appointment:</p>
      <ul>
        <li>
          <strong>Contact details</strong> you enter when booking: your first and last name, phone
          number, and email address, plus any notes you add about the look you want.
        </li>
        <li>
          <strong>Appointment details</strong>: the service, date, and time you choose, and any
          reschedules or cancellations.
        </li>
        <li>
          <strong>Messages</strong> you send us by email or phone, and our replies.
        </li>
        <li>
          <strong>Basic technical data</strong> that any website receives, such as your browser type
          and the pages you visit. We do not run advertising trackers on this site.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>
          To schedule, confirm, remind you about, and manage your appointments. Confirmations and
          reminders are sent by email.
        </li>
        <li>To answer your questions and respond to your messages.</li>
        <li>To keep a record of your past services so your next visit is consistent.</li>
        <li>To run and improve this website and our booking system.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for third-party advertising.</p>

      <h2>Your phone number</h2>
      <p>
        We ask for a phone number when you book so we can reach you if something changes with your
        appointment, for example if we need to call about a delay. We do not run a text message
        program: appointment confirmations and reminders come by email, and we do not send marketing
        texts. See our <LegalLink href="/terms/">Terms &amp; Conditions</LegalLink> for how we
        communicate.
      </p>
      <p>
        <strong>
          No mobile information will be shared with third parties or affiliates for marketing or
          promotional purposes. Text messaging originator opt-in data and consent will not be
          shared with any third parties.
        </strong>
      </p>

      <h2>Who we share it with</h2>
      <p>
        We share your information only with the service providers that run our booking and
        messaging for us, and only so they can do that job:
      </p>
      <ul>
        <li>
          Our appointment scheduling and messaging platform, which stores your booking details and
          sends confirmations and reminders on our behalf.
        </li>
        <li>Google, which provides the embedded map on our Visit page.</li>
        <li>Our website hosting provider, which serves these pages.</li>
      </ul>
      <p>
        We may also disclose information if the law requires it or to protect our rights, your
        safety, or the safety of others.
      </p>

      <h2>Cookies</h2>
      <p>
        This site does not set tracking cookies of its own. The embedded booking calendar and map
        are provided by third parties and may set cookies needed for them to work. You can control
        cookies through your browser settings.
      </p>

      <h2>Keeping your information safe</h2>
      <p>
        We use reputable providers that protect data in transit and at rest, and we limit access to
        your information to what is needed to serve you. No system is perfectly secure, so we cannot
        guarantee absolute security.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Ask us to update or delete your contact details at any time.</li>
        <li>Unsubscribe from emails using the link in the message, or by asking us.</li>
      </ul>

      <h2>Children</h2>
      <p>
        Our services include kids’ haircuts, but appointments must be booked by a parent or
        guardian. We do not knowingly collect personal information directly from children under 13.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows the latest version,
        and continued use of the site after a change means you accept it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your information? Call or text{" "}
        <a href={site.phoneHref}>{site.phone}</a>
        {site.email ? (
          <>
            {" "}
            or email <a href={`mailto:${site.email}`}>{site.email}</a>
          </>
        ) : null}
        . {site.name}, {site.address.line1}, {site.address.city}, {site.address.state}{" "}
        {site.address.zip}.
      </p>
    </LegalPage>
  );
}

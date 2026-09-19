import React, { useState } from "react";
import "./ContactSection.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Fade from "react-reveal/Fade";
import SectionHeader from "../SectionHeader";
import { info } from "../data.js";

const EMPTY_FORM = { name: "", email: "", message: "", website: "" };

function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail =
          Array.isArray(data.details) && data.details.length ? data.details[0] : data.error;
        throw new Error(detail || `Request failed (${response.status})`);
      }
      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact">
      <div className="contact-stuff">
        <Container className="contact-container">
          <Row>
            <Col>
              <SectionHeader id="contact-header" text="Contact" />
            </Col>
          </Row>
          <Fade bottom>
            <Row className="justify-content-center">
              <Col lg={7} md={9} sm={12}>
                <p className="contact-intro">
                  Have a project in mind, a role to discuss, or just want to say hi? Send me a
                  message and I'll get back to you. Prefer email?{" "}
                  <a className="contact-email" href={`mailto:${info.Email}`}>
                    {info.Email}
                  </a>
                </p>

                <form className="contact-form" onSubmit={onSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="contact-name">Name</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-control contact-input"
                        maxLength={100}
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={onChange}
                        disabled={sending}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className="form-control contact-input"
                        maxLength={200}
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={onChange}
                        disabled={sending}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-control contact-input"
                      rows={6}
                      maxLength={5000}
                      required
                      value={form.message}
                      onChange={onChange}
                      disabled={sending}
                    />
                  </div>

                  {/* Honeypot: hidden from people, bots tend to fill it in. Server drops these. */}
                  <div className="contact-honeypot" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={onChange}
                    />
                  </div>

                  <div className="contact-actions">
                    <button type="submit" className="btn contact-submit" disabled={sending}>
                      {sending ? "Sending…" : "Send message"}
                    </button>
                    <span className="contact-status" role="status" aria-live="polite">
                      {status === "sent" && "Thanks! Your message has been sent."}
                      {status === "error" && error}
                    </span>
                  </div>
                </form>
              </Col>
            </Row>
          </Fade>
        </Container>
      </div>
    </section>
  );
}

export default ContactSection;

import React, { useRef } from "react";
import { images } from "../../constants";
import { Tooltip as ReactTooltip } from "react-tooltip";
import emailjs from "emailjs-com";
import "./Footer.css";

const Footer = ({ id = 'footer' }) => {
  const copyText = function (e) {
    let parentDiv = e.currentTarget;
    let button = parentDiv.children[1];
    let textArea = document.createElement("textarea");
    let ptags = [...button.children];

    // Copy text
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.top = "0";
    textArea.style.opacity = "0";
    textArea.value = button.textContent.replace("Text Copied!", "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");

    // Add particle
    let lottie = parentDiv.children[2];
    lottie.play();

    // Toggle between info to text copied
    ptags.forEach((el) => el.classList.add("active"));

    // Prevent spam
    parentDiv.style.pointerEvents = "none";

    setTimeout(() => {
      ptags.forEach((el) => el.classList.remove("active"));

      parentDiv.style.pointerEvents = "all";
      lottie.stop();
    }, 2500);
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_shbm2aa", // Replace with your service ID
      "template_ipqzw5l", // Replace with your template ID
      form.current,
      "yM8CqlPMhDguFYshq" // Replace with your user ID
    )
      .then(
        (result) => {
          console.log(result.text);
          alert("Message sent successfully!");
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send the message, please try again.");
        }
      );

    e.target.reset();
  };

  return (
    <div id={id} style={{ paddingTop: "6rem" }}>
      <h2 className="head-text">Take a coffee & chat with me</h2>

      <div className="app__footer-cards">
        {["mobile", "email"].map((el) => {
          return (
            <div
              key={el}
              className="app__footer-card"
              data-tooltip-content="Tap to copy"
              data-tooltip-id="tooltip"
              onClick={(e) => copyText(e)}
            >
              <img src={images[el]} alt={el} />
              <h6 className="p-text btn-copy">
                <p>{el === "mobile" ? "91+ 9463567280" : "gagandeepsingh220903@gmail.com"}</p>
                <span>Text Copied!</span>
              </h6>

              <lottie-player
                src="https://lottie.host/ba5f1b29-c134-49e6-92a5-0c3c0138ac41/1fZfylyQsU.json"
                style={{
                  height: "100%",
                  width: "100%",
                  transform: "scale(2.6) translateX(-50px)",
                }}
              ></lottie-player>

              <h4>COPY</h4>
            </div>
          );
        })}
        <ReactTooltip
          styles={{ position: "absolute", top: 0, left: 0 }}
          id="tooltip"
        ></ReactTooltip>
      </div>

      <form ref={form} onSubmit={sendEmail} className="app__footer-form app__flex">
        <div className="app__flex">
          <input className="p-text" type="text" placeholder="Full Name" name="from_name" required />
        </div>
        <div className="app__flex">
          <input className="p-text" type="email" placeholder="Your Email" name="from_email" required />
        </div>
        <div>
          <textarea className="p-text" placeholder="Your Message" name="message" required />
        </div>
        <button type="submit" className="p-text">
          Send message
        </button>
      </form>

      <p className="copyright">Created by Gagandeep Singh with 💖 &copy;{new Date().getFullYear()}</p>
    </div>
  );
};

export default Footer;

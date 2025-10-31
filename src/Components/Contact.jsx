import React from "react";
import Input from "./Inputs";
import axios from "axios"; // Importa Axios
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Contact = (props) => {
  const chains = [
    "APT",
    "ARB",
    "AVAX",
    "BASE",
    "BERA",
    "BLAST",
    "BSC",
    "BTC",
    "CELO",
    "COSMOS",
    "CYBER",
    "DOT",
    "ETH",
    "FLOW",
    "FTM",
    "IMX",
    "MANTLE",
    "MATIC",
    "MORPH",
    "NEAR",
    "NOVA",
    "OP",
    "SCROLL",
    "SEI",
    "SOL",
    "STELLAR",
    "STRK",
    "STX",
    "TRON",
    "XAI",
    "XDAI",
    "ZKSYNC",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const emailData = {
        sender_email: "juancarlos192003@gmail.com",
        recipient_email: "kath@nodefleet.net",
        subject: "Contact Info Nodefleet - Dedicated Cluster Request",
        body: `
          Name: ${data.name} ${data.last}
          Email: ${data.email}
          Telegram: ${data.telegram}
          Organization: ${data.organization}
          Region: ${data.region}
          
          Selected Chains: ${data.chains?.join(", ")}
          
          Cluster Type: ${data.clusterType}
          RPS Requirements: ${data.rpsRequirements}
          Budget: ${data.budget}
          Timeline: ${data.timeline}
          
          Additional Information:
          ${data.additionalInfo}
        `,
      };

      const response = await axios.post(
        "https://staging.api.appbot.do/send-email/",
        emailData
      );
      toast.success("Successfully send email!");
      reset();
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error("error to send email!");
    }
  };

  return (
    <div
      className="flex flex-col gap-4 justify-center items-center text-white relative py-20 max-sm:py-14"
      id="Contact"
    >
      <img
        src="https://appbot.nyc3.digitaloceanspaces.com/Landing_Nodefleet/end-lan.png"
        alt="home"
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      <h2 className="font-bold text-4xl max-sm:text-xl text-center mb-2 max-sm:px-4">
        Ready for your own Dedicated Cluster?
      </h2>
      <p className="text-center mb-6 text-lg max-sm:text-sm max-sm:px-4">
        Speak to our team today to explore your dedicated solution for
        unparalleled performance and security.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-8/12 max-sm:w-11/12 gap-6"
      >
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <Input
            name="name"
            label="First name*"
            register={register}
            required
            errors={errors.name}
          />
          <Input
            name="last"
            label="Last name*"
            register={register}
            required
            errors={errors.last}
          />
        </div>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <Input
            name="email"
            label="Email*"
            type="email"
            register={register}
            required
            errors={errors.email}
          />
          <Input
            name="telegram"
            label="Telegram username"
            register={register}
            errors={errors.telegram}
          />
        </div>
        <div>
          <Input
            name="organization"
            label="Organization*"
            register={register}
            required
            errors={errors.organization}
          />
        </div>

        <div>
          <label className="font-semibold mb-2 block">Select Region*</label>
          <select
            {...register("region", { required: true })}
            className="p-2 rounded-lg outline-none bg-white/10 border border-white w-full"
          >
            <option value="">Select region</option>
            <option value="EUROPE">Europe</option>
            <option value="USA">United States</option>
            <option value="SINGAPORE">Singapore</option>
          </select>
          {errors.region && (
            <span className="text-red-500 text-sm">This field is required</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            What chains are you interested in?*
          </label>
          <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-2 bg-gray-800 p-4 rounded-lg">
            {chains.map((chain) => (
              <div key={chain} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={chain}
                  {...register("chains")}
                  value={chain}
                  className="w-4 h-4"
                />
                <label htmlFor={chain} className="text-sm">
                  {chain}
                </label>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="other"
                {...register("chains")}
                value="Other"
                className="w-4 h-4"
              />
              <label htmlFor="other" className="text-sm">
                Other
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <div>
            <label className="font-semibold mb-2 block">Cluster Type*</label>
            <select
              {...register("clusterType", { required: true })}
              className="p-2 rounded-lg outline-none bg-white/10 border border-white w-full"
            >
              <option value="">Select cluster type</option>
              <option value="Archival">Archival</option>
              <option value="Mainnet">Mainnet</option>
            </select>
            {errors.clusterType && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className="font-semibold mb-2 block">
              RPS Requirements*
            </label>
            <select
              {...register("rpsRequirements", { required: true })}
              className="p-2 rounded-lg outline-none bg-white/10 border border-white w-full"
            >
              <option value="">Select RPS requirements</option>
              <option value="0-1000">0-1000</option>
              <option value="1000+">1000+</option>
            </select>
            {errors.rpsRequirements && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <div>
            <label className="font-semibold mb-2 block">
              What's your ideal budget?*
            </label>
            <select
              {...register("budget", { required: true })}
              className="p-2 rounded-lg outline-none bg-white/10 border border-white w-full"
            >
              <option value="">Select budget range</option>
              <option value="-800">Less than $800</option>
              <option value="800-1500">$800 - $1,500</option>
              <option value="1500-3000">$1,500 - $3,000</option>
              <option value="3000-6000">$3,000 - $6,000</option>
              <option value="6000+">$6,000+</option>
            </select>
            {errors.budget && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          <div>
            <label className="font-semibold mb-2 block">
              What's your timeline?*
            </label>
            <select
              {...register("timeline", { required: true })}
              className="p-2 rounded-lg outline-none bg-white/10 border border-white w-full"
            >
              <option value="">Select timeline</option>
              <option value="1-7">1-7 days</option>
              <option value="8-15">8-15 days</option>
              <option value="16-30">16-30 days</option>
              <option value="31-60">31-60 days</option>
              <option value="60+">60+ days</option>
            </select>
            {errors.timeline && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>
        </div>

        <div>
          <Input
            name="additionalInfo"
            label="Anything else?"
            textarea={true}
            rows={4}
            register={register}
            errors={errors.additionalInfo}
          />
        </div>

        <div className="flex items-start gap-2 mt-2">
          <input
            type="checkbox"
            {...register("terms")}
            required
            className="mt-1 w-4 h-4"
          />
          <label className="text-sm text-gray-300">
            By submitting this form, I agree to Nodefleet's Terms of Service,
            Privacy Policy, and to be contacted using the information I've
            provided.*
          </label>
        </div>

        <div className="w-full">
          <button
            type="submit"
            className="w-full bg-green-300 text-morado font-bold text-base p-2 rounded-lg hover:bg-sky-300 transition-all"
          >
            Submit Request
          </button>
        </div>
      </form>

      {/* <div className="flex flex-row justify-between w-6/12 max-sm:w-9/12 gap-4 font-sans text-sm mt-16 max-sm:mt-5">
        <a href="#About" className="hover:underline transition-all">
          About
        </a>
        <a href="#Pricing" className="hover:underline transition-all">
          Pricing
        </a>
        <a href="#FAQ" className="hover:underline transition-all">
          FAQ
        </a>
        <a href="#Press" className="hover:underline transition-all">
          Press
        </a>
        <a href="#Partners" className="hover:underline transition-all">
          Partners
        </a>
      </div> */}
      <div className="flex flex-row justify-between gap-10 font-sans text-sm mt-5">
        <a href="https://t.me/nodefleet" target="_blank" rel="noreferrer">
          <i className="fa-solid fa-paper-plane text-white text-md"></i>
        </a>
        <a
          href="https://twitter.com/nodefleet"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/images/twitter2.svg" alt="twitter2" />
        </a>
        <a href="https://github.com/nodefleet" target="_blank" rel="noreferrer">
          <img src="/images/github.svg" alt="github" />
        </a>
      </div>
      <div className="flex flex-row gap-2 justify-between font-sans text-sm mt-5">
        <p className="text-gray-500 font-sans font-normal">
          © {new Date().getFullYear()} Nodefleet, Inc. All rights reserved.
        </p>
        <Link
          to="/privacy-policy"
          className="text-white  font-sans font-normal hover:underline transition-all"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Contact;

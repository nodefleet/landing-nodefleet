import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useState } from "react";

const Admin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const rpcLinksArray = data.rpcLinks.split("\n").map((link) => {
        const [label, value] = link.split("|");
        return { label: label.trim(), value: value.trim() };
      });

      const blockchainData = {
        name: data.name,
        logo: data.logo,
        network: data.network,
        nodeType: data.nodeType,
        rpcLinks: rpcLinksArray,
        faucetLink: data.faucetLink || null,
        xLink: data.xLink || null,
      };

      await addDoc(collection(db, "blockchains"), blockchainData);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding blockchain:", error);
      alert("Error saving data");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[89vh] bg-gradient-to-b from-morado1 to-morado2 px-8">
      <motion.div
        className="max-w-2xl mx-auto bg-morado3 rounded-xl px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">Add Blockchain</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Blockchain Name</label>
            <input
              {...register("name", { required: "This field is required" })}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
              placeholder="e.g.: Lava"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Logo URL</label>
            <input
              {...register("logo", { required: "This field is required" })}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
              placeholder="https://example.com/logo.png"
            />
            {errors.logo && (
              <span className="text-red-500 text-sm">
                {errors.logo.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Network</label>
            <select
              {...register("network", { required: "This field is required" })}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
            >
              <option value="">Select a network</option>
              <option value="Testnet">Testnet</option>
              <option value="Mainnet">Mainnet</option>
            </select>
            {errors.network && (
              <span className="text-red-500 text-sm">
                {errors.network.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Node Type</label>
            <select
              {...register("nodeType", { required: "This field is required" })}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
            >
              <option value="">Select a node type</option>
              <option value="Archival">Archival</option>
              <option value="Full">Full</option>
            </select>
            {errors.nodeType && (
              <span className="text-red-500 text-sm">
                {errors.nodeType.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">
              RPC Links (format: label|url, one per line)
            </label>
            <textarea
              {...register("rpcLinks", { required: "This field is required" })}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
              placeholder="USA|https://rpc-url-here&#10;EUR|https://another-rpc-url"
              rows="4"
            />
            {errors.rpcLinks && (
              <span className="text-red-500 text-sm">
                {errors.rpcLinks.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">
              Faucet Link (optional)
            </label>
            <input
              {...register("faucetLink")}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
              placeholder="https://faucet-url"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              X (Twitter) Link (optional)
            </label>
            <input
              {...register("xLink")}
              className="w-full p-3 rounded-lg bg-morado4 text-black border border-morado5 focus:outline-none focus:border-purple-500"
              placeholder="https://x.com/your-account"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Blockchain"}
          </button>

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-center mt-4"
            >
              Blockchain saved successfully!
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;

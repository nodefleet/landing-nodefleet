import { motion } from "framer-motion";
import Contact from "../Components/Contact";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link } from "react-router-dom";

const Faucets = () => {
  const [blockchains, setBlockchains] = useState([]);
  const [filteredBlockchains, setFilteredBlockchains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEndpoints, setSelectedEndpoints] = useState({});
  const [filters, setFilters] = useState({
    network: "all",
    nodeType: "all",
    search: "",
  });
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    mainnet: false,
    archival: false,
  });

  useEffect(() => {
    const fetchBlockchains = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blockchains"));
        const blockchainsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const initialEndpoints = {};
        blockchainsData.forEach((blockchain) => {
          if (blockchain.rpcLinks && blockchain.rpcLinks.length > 0) {
            initialEndpoints[blockchain.id] = blockchain.rpcLinks[0];
          }
        });

        setSelectedEndpoints(initialEndpoints);
        setBlockchains(blockchainsData);
        setFilteredBlockchains(blockchainsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blockchains:", error);
        setLoading(false);
      }
    };

    fetchBlockchains();
  }, []);

  useEffect(() => {
    let result = [...blockchains];

    // Filtrar por red
    if (filters.network !== "all") {
      result = result.filter(
        (blockchain) => blockchain.network === filters.network
      );
    }

    // Filtrar por tipo de nodo
    if (filters.nodeType !== "all") {
      result = result.filter(
        (blockchain) => blockchain.nodeType === filters.nodeType
      );
    }

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((blockchain) =>
        blockchain.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBlockchains(result);
  }, [filters, blockchains]);

  const handleEndpointChange = (event, links, blockchainId) => {
    const selectedValue = event.target.value;
    const link = links.find((link) => link.value === selectedValue);
    if (link) {
      setSelectedEndpoints({
        ...selectedEndpoints,
        [blockchainId]: link,
      });
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFilterClick = (filter) => {
    if (filter === "all") {
      setActiveFilters({
        all: true,
        mainnet: false,
        archival: false,
      });
      setFilters({
        network: "all",
        nodeType: "all",
        search: "",
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        all: false,
        [filter]: !activeFilters[filter],
      });

      // Actualizar filtros basados en las pills seleccionadas
      setFilters((prev) => ({
        ...prev,
        network: activeFilters.mainnet ? "Mainnet" : "all",
        nodeType: activeFilters.archival ? "Archival" : "all",
      }));
    }
  };

  return (
    <div className="h-auto flex flex-col gap-0">
      <motion.div
        className="h-auto min-h-screen flex justify-start flex-col gap-4 items-start -mt-10 p-4 md:p-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="https://appbot.nyc3.digitaloceanspaces.com/Landing_Nodefleet/home-lan.png"
          alt="home"
          className="absolute top-0 left-0 w-full h-screen"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="relative z-10 text-white text-start flex flex-col gap-4 mt-24 md:mt-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-2xl md:text-4xl mb-2">
            RPC public <b>endpoints</b>
          </h1>
          <hr className="w-10/12 h-1 bg-white" />
          <h2 className="text-2xl md:text-4xl">Public Faucets</h2>
        </motion.div>

        <motion.div
          className="relative z-10 w-full h-full flex justify-start items-start flex-col bg-[#222038D4] p-4 md:p-8 mt-8 md:mt-12 rounded-2xl"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="w-full flex flex-col gap-4 mb-4 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <h2 className="text-xl md:text-2xl text-white font-semibold">
                Blockchain list
              </h2>
              <div className="text-white">
                {filteredBlockchains.length} results
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center py-2 text-base md:text-lg">
              <div className="flex gap-0 items-center border rounded-lg border-white w-full md:w-auto">
                <button
                  onClick={() => handleFilterClick("all")}
                  className={`px-4 md:px-4 py-1.5 border-r rounded-l-lg border-white font-medium transition-colors flex-1 md:flex-none ${
                    activeFilters.all
                      ? "bg-[#7a65d0] text-white"
                      : "bg-[#222038D4] text-gray-300"
                  }`}
                >
                  <i className="fa-solid fa-check"></i> All
                </button>
                <button
                  onClick={() => handleFilterClick("mainnet")}
                  className={`px-4 md:px-4 py-1.5 border-r border-white font-medium transition-colors flex-1 md:flex-none ${
                    activeFilters.mainnet
                      ? "bg-[#3c7b97] text-white"
                      : "bg-[#222038D4] text-gray-300"
                  }`}
                >
                  Mainnet
                </button>
                <button
                  onClick={() => handleFilterClick("archival")}
                  className={`px-4 md:px-4 py-1.5 font-medium rounded-r-lg transition-colors flex-1 md:flex-none ${
                    activeFilters.archival
                      ? "bg-[#484c71] text-white"
                      : "bg-[#222038D4] text-gray-300"
                  }`}
                >
                  Archival
                </button>
              </div>

              <div className="w-full md:w-8/12 relative">
                <input
                  type="text"
                  placeholder="Search blockchain..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="px-4 py-1.5 rounded-lg bg-[#222038D4] w-full border border-white text-white placeholder-gray-400 focus:outline-none text-base md:text-xl"
                />
                <i className="fa-solid fa-magnifying-glass text-white text-xl absolute right-4 top-1/2 -translate-y-1/2"></i>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-6 place-items-center gap-4 p-4 bg-morado3 rounded-t-xl text-gray-300 text-xl font-semibold">
              <div>Blockchain Node</div>
              <div>Network</div>
              <div>Node Type</div>
              <div>Public RPC Endpoint</div>
              <div>Faucets</div>
              <div>Snapshot</div>
            </div>

            <div className="space-y-2 mt-4 overflow-y-auto max-h-[70vh]">
              {loading ? (
                <div className="text-white text-center py-4">Loading...</div>
              ) : (
                filteredBlockchains.map((blockchain) => (
                  <motion.div
                    key={blockchain.id}
                    className="grid grid-cols-1 md:grid-cols-6 place-items-center gap-4 p-4 bg-morado4 rounded-xl text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col md:hidden w-full gap-4 mb-4">
                      <div className="text-gray-300 font-medium">
                        Blockchain Node
                      </div>
                      <div className="flex items-center justify-center">
                        <img
                          src={blockchain.logo}
                          alt={blockchain.name}
                          className="w-44 h-8 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <img
                        src={blockchain.logo}
                        alt={blockchain.name}
                        className="w-44 h-8 rounded-full"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                      <div className="text-gray-300 md:hidden font-medium">
                        Network
                      </div>
                      <div className="bg-[#3c7b97] text-lg px-3 py-3 rounded-lg w-full md:w-fit text-center">
                        {blockchain.network}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                      <div className="text-gray-300 md:hidden font-medium">
                        Node Type
                      </div>
                      <div className="bg-[#484c71] px-3 py-3 rounded-lg w-full md:w-fit text-center">
                        {blockchain.nodeType}
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-2">
                      <div className="text-gray-300 md:hidden font-medium">
                        Public RPC Endpoint
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 bg-[#3d4954] px-3 py-3 rounded-lg w-full">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-link"></i>
                          <a
                            href={selectedEndpoints[blockchain.id]?.value}
                            className="text-white text-lg font-medium text-nowrap"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Endpoint link
                          </a>
                        </div>
                        <select
                          onChange={(e) =>
                            handleEndpointChange(
                              e,
                              blockchain.rpcLinks,
                              blockchain.id
                            )
                          }
                          value={selectedEndpoints[blockchain.id]?.value || ""}
                          className="text-[#3d4954] text-base md:text-lg font-bold focus:outline-[#99dfaf] px-4 py-2 font-['Roboto'] rounded-lg bg-[#99dfaf] cursor-pointer hover:bg-[#8accA0] transition-colors w-full md:w-auto"
                        >
                          {blockchain.rpcLinks.map((link, index) => (
                            <option key={index} value={link.value}>
                              {link.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-2">
                      <div className="text-gray-300 md:hidden font-medium">
                        Faucets
                      </div>
                      <div>
                        {blockchain.faucetLink ? (
                          blockchain.name.toLowerCase() === "snapshot" ? (
                            <>
                              <a
                                href={blockchain.faucetLink}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                              >
                                {blockchain.name}{" "}
                                <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                                  <i className="fa-solid fa-download text-xl"></i>
                                </div>
                              </a>
                            </>
                          ) : isValidUrl(blockchain.faucetLink) ? (
                            <a
                              href={blockchain.faucetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                            >
                              {blockchain.name}{" "}
                              <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                                <i className="fa-solid fa-arrow-right text-xl -rotate-45"></i>
                              </div>
                            </a>
                          ) : (
                            <Link
                              to={`/faucets/${blockchain.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                            >
                              {blockchain.name}{" "}
                              <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                                <i className="fa-solid fa-arrow-right text-xl -rotate-45"></i>
                              </div>
                            </Link>
                          )
                        ) : (
                          <div className="transition-colors inline-flex items-center gap-6">
                            N/A
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {blockchain.snapshotLink ? (
                        blockchain.name.toLowerCase() === "snapshot" ? (
                          <>
                            <a
                              href={blockchain.snapshotLink}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                            >
                              {blockchain.name}{" "}
                              <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                                <i className="fa-solid fa-download text-xl"></i>
                              </div>
                            </a>
                          </>
                        ) : isValidUrl(blockchain.snapshotLink) ? (
                          <a
                            href={blockchain.snapshotLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                          >
                            {blockchain.name}{" "}
                            <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                              <i className="fa-solid fa-arrow-right text-xl -rotate-45"></i>
                            </div>
                          </a>
                        ) : (
                          <Link
                            to={`/faucets/${blockchain.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#7a65d0] px-4 py-2 rounded-xl hover:bg-[#5538ce] transition-colors inline-flex items-center gap-6"
                          >
                            {blockchain.name}{" "}
                            <div className="px-3 py-1.5 bg-[#5538ce] rounded-lg">
                              <i className="fa-solid fa-arrow-right text-xl -rotate-45"></i>
                            </div>
                          </Link>
                        )
                      ) : (
                        <div className="transition-colors inline-flex items-center gap-6">
                          N/A
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Contact isFaucets={true} />
      </motion.div>
    </div>
  );
};

export default Faucets;

// Import statements (keep your existing imports)
import { useState, useEffect } from "react";
import { LeaderboardItem } from "@/lib/clicker-anchor-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  leaders: LeaderboardItem[];
  walletPublicKeyString: string;
  clicks: number;
  backgroundGradient: string;
};

const initialDisplayCount = 10;

export default function Leaderboard({
  leaders,
  walletPublicKeyString,
  clicks,
  backgroundGradient,
}: Props) {
  const [displayLeaders, setDisplayLeaders] = useState<LeaderboardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayCount, setDisplayCount] = useState<number>(initialDisplayCount);
  const [currentGradient, setCurrentGradient] = useState<string>(backgroundGradient);

  const generateSequentialLinearGradient = (): string => {
    const colors = [
      "linear-gradient(to right, #fff6dd, #fff6ee)",
    ];

    const currentIndex = colors.indexOf(currentGradient);
    const nextIndex = (currentIndex + 1) % colors.length;

    return colors[nextIndex];
  };

  useEffect(() => {
    let foundCurrentUser = false;
    const updatedLeaders = leaders.map((leader) => {
      if (leader.playerPublicKey === walletPublicKeyString) {
        foundCurrentUser = true;
        return {
          playerPublicKey: leader.playerPublicKey,
          clicks: clicks,
        };
      }
      return leader;
    });

    if (walletPublicKeyString && clicks && !foundCurrentUser) {
      updatedLeaders.push({
        playerPublicKey: walletPublicKeyString,
        clicks: clicks,
      });
    }

    const sortByClicks = updatedLeaders.sort((a, b) => b.clicks - a.clicks);
    setDisplayLeaders(sortByClicks.slice(0, displayCount));
  }, [clicks, walletPublicKeyString, leaders, displayCount]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newGradient = generateSequentialLinearGradient();
      setCurrentGradient(newGradient);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentGradient]);

  const handleSearch = () => {
    if (searchTerm === "") {
      setDisplayLeaders([...leaders.slice(0, displayCount)]);
    } else {
      const filteredLeaders = leaders.filter((leader) =>
        leader.playerPublicKey.includes(searchTerm)
      );
      setDisplayLeaders(filteredLeaders.slice(0, displayCount));
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + initialDisplayCount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("Wallet address copied!");
  };

  const downloadWalletAddresses = () => {
    const filteredAddresses = leaders
      .filter((leader) => leader.clicks >= 150)
      .map((leader) => leader.playerPublicKey);

    const jsonContent = JSON.stringify(filteredAddresses, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet_addresses.json";
    a.click();
    URL.revokeObjectURL(url);

    notify("Wallet addresses downloaded!");
  };

  const notify = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  return (
    <div className="sm:p-10 items-center flex flex-col" style={{ background: "linear-gradient(to right, #fff6dd, #fff6ee)", borderColor: 'black', borderWidth: '2px', borderRadius: '30px' }}>
      <div className="flex items-center mb-4">
      <input
  type="text"
  placeholder="Search by Wallet Address"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="rounded-l-md p-2 focus:outline-green-500 focus:ring focus:border-green-500 transition-all duration-300 text-black"
/>
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white rounded-r-md p-2 ml-1 transition-all duration-300 transform hover:scale-105"
        >
          Search
        </button>
      </div>
      <div>
        <p style={{ color: 'black', fontWeight: 'bold' }}>
          Target : 150 Clicks
        </p>
      </div>
      <div className="text-2xl mb-4" style={{ color: 'black', fontWeight: 'bold' }}>
        Leaderboard
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full leaderboard-table" style={{ borderColor: 'black', borderRadius: '30px' }}>
          <thead>
            <tr>
              <th className="text-center border rounded p-2 font-bold" style={{ borderColor: 'black', borderRadius: '30px' }}>
                Rank
              </th>
              <th className="text-center border rounded p-2 font-bold" style={{ borderColor: 'black', borderRadius: '30px' }}>
                Player
              </th>
              <th className="text-center border rounded p-2 font-bold" style={{ borderColor: 'black', borderRadius: '30px' }}>
                Total Clicks
              </th>
            </tr>
          </thead>
          <tbody>
            {displayLeaders.map((leader, index) => (
              <tr key={leader.playerPublicKey} className="leaderboard-row">
                <th className="text-center border rounded p-2 font-bold" style={{ borderColor: 'black', borderRadius: '30px' }}>
                  {index + 1}
                </th>
                <td
                  className="text-center border rounded p-2 font-bold"
                  onClick={() => copyToClipboard(leader.playerPublicKey)}
                  style={{ cursor: "pointer", borderColor: 'black', borderRadius: '30px', fontWeight: leader.playerPublicKey === walletPublicKeyString ? 'bold' : 'normal' }}
                >
                  {leader.playerPublicKey === walletPublicKeyString ? (
                    <b>You</b>
                  ) : (
                    <span>{leader.playerPublicKey}</span>
                  )}
                </td>
                <td className="text-center border rounded p-2 font-bold" style={{ borderColor: 'black', borderRadius: '30px' }}>
                  {leader.clicks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {walletPublicKeyString === "ExnV1bFPfDQJ5PtVy8jEdH2gt19cu1XLDM8t7wprKdR5" && (
        <button
          onClick={downloadWalletAddresses}
          className="bg-black font-bold text-white rounded-md p-2 mt-4" style={{ borderColor: 'black', borderRadius: '30px' }}
        >
          Download Wallet Addresses (150+ clicks)
        </button>
      )}
      {leaders.length > displayCount && (
        <button
          onClick={handleLoadMore}
          className="bg-green-500 text-white rounded-md p-2 mt-4"style={{ borderColor: 'black', borderRadius: '30px' }}
        >
          Load More
        </button>
      )}
    </div>
  );
}

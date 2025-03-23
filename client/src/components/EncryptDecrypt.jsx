import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EncryptDecrypt = ({ keyword }) => {
  const [action, setAction] = useState("encrypt");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [userKeyword, setUserKeyword] = useState("");
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [showAudioWarning, setShowAudioWarning] = useState(false);

  // Check if warning should be displayed
  useEffect(() => {
    setShowAudioWarning(action === "encrypt" && inputType === "audio");
  }, [action, inputType]);

  const handleSubmit = async () => {
    if (!keyword) {
      toast.error("Keyword is missing! Please fill in your details first.");
      return;
    }

    if (!userKeyword.trim()) {
      toast.error("Please enter your keyword.");
      return;
    }

    setLoading(true);
    setResult(null);
    setFileUrl(null);

    const formData = new FormData();
    formData.append("action", action);
    formData.append("keyword", keyword);
    formData.append("userKeyword", userKeyword);

    if (inputType !== "text" && file) {
      formData.append("file", file);
    } else {
      formData.append("text", text);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          `${action.charAt(0).toUpperCase() + action.slice(1)}ion Successful!`
        );

        if (data.fileUrl) {
          setFileUrl(data.fileUrl);
          setResult(data.message);
        } else {
          setResult(data.result);
        }
      } else {
        toast.error("Error processing request");
      }
    } catch (error) {
      toast.error("Server error. Try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Add this at the top of your component, with your other useEffect hooks
  useEffect(() => {
    // Reset results when switching between encrypt/decrypt
    setResult(null);
    setFileUrl(null);
  }, [action]);

  return (
    <div className="text-center p-6 py-16 lg:px-16 w-full" id="encrypt-decrypt">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-green-900">
        Encrypt or Decrypt
      </h1>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
        Select an option below and provide the necessary details to proceed.
      </p>

      {!keyword ? (
        <p className="text-red-600 font-semibold">
          ❌ Keyword not found. Please fill in your details first.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side: Input form */}
            <div className="w-full lg:w-1/2 text-gray-700 bg-white shadow-lg rounded-lg p-6">
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-green-600"
                placeholder="Enter your secret keyword"
                value={userKeyword}
                onChange={(e) => setUserKeyword(e.target.value)}
                required
              />

              <div className="flex justify-center gap-4 mt-6">
                <button
                  className={`py-2 px-6 rounded-lg text-lg cursor-pointer ${
                    action === "encrypt"
                      ? "bg-green-900 text-white shadow-md"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setAction("encrypt")}
                >
                  Encrypt
                </button>
                <button
                  className={`py-2 px-6 rounded-lg text-lg cursor-pointer ${
                    action === "decrypt"
                      ? "bg-green-900 text-white shadow-md"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setAction("decrypt")}
                >
                  Decrypt
                </button>
              </div>

              {/* Input Type Selection */}
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-4">
                  Choose Input Type:
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="inputType"
                      value="text"
                      checked={inputType === "text"}
                      onChange={() => setInputType("text")}
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg ${
                        inputType === "text"
                          ? "bg-green-900 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      Text
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="inputType"
                      value="file"
                      checked={inputType === "file"}
                      onChange={() => setInputType("file")}
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg ${
                        inputType === "file"
                          ? "bg-green-900 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      PDF
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="inputType"
                      value="audio"
                      checked={inputType === "audio"}
                      onChange={() => setInputType("audio")}
                      className="hidden"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg ${
                        inputType === "audio"
                          ? "bg-green-900 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      Audio
                    </span>
                  </label>
                </div>
              </div>

              {/* Audio Encryption Warning */}
              {showAudioWarning && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-400 rounded-md text-yellow-800">
                  <p className="text-sm flex items-center">
                    <span>
                      <strong>Note:</strong> Encrypted audio files will not be
                      playable until they are decrypted again. This is normal
                      and ensures your audio is securely protected.
                    </span>
                  </p>
                </div>
              )}

              {/* Input Fields */}
              {inputType === "text" ? (
                <textarea
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 mt-6 h-32 resize-none focus:ring-2 focus:ring-green-600"
                  placeholder="Enter text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="file"
                  accept={inputType === "file" ? ".pdf" : ".mp3,.wav"}
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 mt-6 focus:ring-2 focus:ring-green-600"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              )}

              <button
                className={`py-3 px-12 mt-6 w-full text-lg rounded-lg cursor-pointer ${
                  keyword && userKeyword
                    ? "bg-green-900 text-white shadow-md"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!keyword || !userKeyword || loading}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>

            {/* Right side: Results */}
            <div className="w-full lg:w-1/2 h-full">
              <div className="bg-white shadow-lg rounded-lg p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-green-900 border-b border-gray-200 pb-2">
                  Result Dashboard
                </h2>

                {/* Only show results if they match the current action */}
                {(result || fileUrl) && loading === false ? (
                  <div className="flex-grow flex flex-col">
                    <div className="flex-grow p-4 border border-green-100 rounded-lg bg-green-50 text-green-900">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-white mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold">
                          {action === "encrypt" ? "Encryption" : "Decryption"}{" "}
                          Complete
                        </h3>
                      </div>

                      {result && (
                        <div className="mb-4 bg-white p-3 rounded-lg border border-green-200 shadow-sm overflow-auto max-h-32">
                          <p className="break-words text-gray-700">{result}</p>
                        </div>
                      )}

                      {/* Audio encryption additional info */}
                      {action === "encrypt" &&
                        inputType === "audio" &&
                        fileUrl && (
                          <div className="my-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                            <div className="flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p>
                                Your audio has been successfully encrypted.
                                Remember to keep track of your encryption
                                keyword - you'll need it to decrypt the file
                                later. The encrypted file won't play in standard
                                media players until it's decrypted.
                              </p>
                            </div>
                          </div>
                        )}

                      {/* Audio decryption success message */}
                      {action === "decrypt" &&
                        inputType === "audio" &&
                        fileUrl && (
                          <div className="my-2 p-3 bg-green-100 border border-green-200 rounded-md text-green-800 text-sm">
                            <div className="flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p>
                                Your audio has been successfully decrypted and
                                should now be playable in standard media
                                players.
                              </p>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* File Download Link */}
                    {fileUrl && (
                      <div className="mt-4">
                        <a
                          href={`http://127.0.0.1:5000${fileUrl}`}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                          download
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col justify-center items-center text-gray-500 bg-gray-50 rounded-lg p-4">
                    <div className="text-center p-6">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No results yet
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Enter your secret keyword, choose an option, and submit
                        to see your results here.
                      </p>
                      <div className="mt-6">
                        <div className="text-xs text-gray-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {action === "encrypt" ? "Encrypted" : "Decrypted"}{" "}
                          content will appear here
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptDecrypt;

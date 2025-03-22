  return (
    <div className="baseBG font-sans leading-normal tracking-normal h-screen overflow-hidden">
      <div className="p-2 grid grid-cols-[auto_1fr] h-full">
        <div className="relative flex">
          <Sidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            language={language}
          />
        </div>

        {/* Success Message Display (added)*/}
        {successMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-md p-2 rounded-md shadow-md transition-opacity duration-500 ease-in-out z-50">
            {successMessage}
          </div>
        )}

        {/* Error Message Display (added)*/}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded-md shadow-md mt-2 z-50">
            {errorMessage}
          </div>
        )}

        {/* Main Content */}
        <div
          className={`main-content flex flex-col flex-1 transition-all duration-300 overflow-y-auto`}
        >
          <div className="px-4 grid grid-rows-[5rem_1fr] flex-1">
            {/* Main Content Header */}
            <MainContentHeader
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
              translations={translations}
            />

            {/* <!-- Main Content --> */}
            <div class="flex flex-col flex-1">
              {/* <!-- Main Content --> */}
              <div class="flex flex-col flex-1 gap-4">
                {/* Internet Usage Section */}
                <div className="grid grid-cols-[auto,1fr] items-center mt-5 w-full">
                  <a className="relative pl-4" href="/">
                    <i className="fa fa-2x fa-arrow-left"></i>
                  </a>
                  <h1 className="text-center md:text-4xl lg:text-4xl w-full ml-[-5%]">
                    {translations.createRoom}
                  </h1>
                </div>

                {/* ==================== */}
                <div className="wrapper p-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  {/* Event Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="event-form bg-gray-100 p-4 mt-4 rounded-lg shadow-md grid grid-rows-[auto] gap-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full border border-gray-300 rounded p-4">
                        {/* Upload Button */}
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-colors"
                        >
                          {translations.uploadPicture}
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />

                        {/* Preview the Uploaded Image */}
                        {imagePreview && (
                          <div className="mt-4">
                            <img
                              src={imagePreview}
                              alt="Uploaded Preview"
                              className="w-full max-w-xs mx-auto border border-gray-300 rounded shadow-md"
                            />
                          </div>
                        )}
                      </div>

                      {/* Room Title Input*/}
                      <input
                        type="text"
                        placeholder={translations.roomTitle}
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                      />
                    </div>

                    <div className="grid grid-rows-[auto] border border-gray-300 bg-white rounded-lg">
                      <div className="grid grid-cols-2">
                        {/* Left Section */}
                        <h3 className="text-xl font-semibold m-5">
                          {translations.selectDevice}
                        </h3>

                        {/* Right Section */}
                        <div className="p-4 flex justify-end items-center">
                          {/* Trigger Button */}
                          <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                            onClick={openModal}
                          >
                            {translations.view_all}
                          </button>

                          {/* Modal */}
                          {isOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-xl font-semibold">
                                    {translations.view_all}
                                  </h2>
                                  <button

                                    className="text-gray-500 hover:text-gray-700 transition"
                                    onClick={closeModal}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>

                                {/* Content */}
                                <div className="overflow-y-auto max-h-96">
                                  <ul className="space-y-4">
                                    {deviceDetails.map((device) => (
                                      <li
                                        key={device.deviceid}
                                        className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition flex justify-between items-center"
                                      >
                                        <div className="relative w-full">
                                          <span>
                                            {device.deviceName} (
                                            {device.category.categoryName})
                                          </span>

                                          {/* Green Check Mark for Selected Devices */}
                                          {selectedDevices.includes(
                                            device.deviceid
                                          ) && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                              <i className="fas fa-check"></i>
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleFavorite(device.deviceid)
                                          }
                                          className={`text-sm px-3 py-1 rounded-md ${
                                            favorites.includes(
                                              device.deviceid
                                            )
                                              ? "bg-green-500 text-white"
                                              : "bg-gray-300 text-black"
                                          }`}
                                        >
                                          {favorites.includes(device.deviceid)
                                            ? `${translations.favorited}`
                                            : `${translations.favorite}`}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleSelected(device.deviceid)
                                          }
                                          className="text-sm px-3 py-1 rounded-md ml-2"
                                        >
                                          {selectedDevices.includes(
                                            device.deviceid
                                          )
                                            ? `${translations.deselect}`
                                            : `${translations.select}`}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 justify-center items-center p-3">
                        {/* Dynamically added blocks for Favorites */}
                        {favorites.map((favDevice) => (
                          <div
                            key={favDevice}
                            className="rounded-lg border-[2px] border-gray-300 bg-white flex flex-col justify-center items-center p-3 cursor-pointer"
                            onClick={() => toggleSelected(favDevice)} // Toggle selected when clicked
                          >
                            <div className="grid sm:grid-cols-1 items-center gap-4 p-4">
                              <img
                                src=""
                                alt=""
                                className="border border-black rounded-lg mb-4 mx-auto"
                                style={{ height: "100px", width: "100px" }}
                              />
                              <div className="relative w-full">
                                <div className="grid grid-rows-3 teal-text text-sm sm:text-base w-full mb-2 text-center">
                                  <div className="mb-2">{favDevice}</div>
                                </div>

                                {/* Green Check Mark for Selected Devices in Favorites */}
                                {selectedDevices.includes(favDevice) && (
                                  <div className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                                    <i className="fas fa-check"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Message if no favorites */}
                        {favorites.length === 0 && (
                          <p className="text-gray-500 col-span-4 text-center">
                            {translations.no_favorites}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <Link
                      to={`/rooms/${roomName}/access`} // Use the input value in the link
                      className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center ${
                        roomName ? "" : "pointer-events-none opacity-50"
                      }`}
                    >
                      {translations.nextStep}
                    </Link> */}
                    {/* Replace the Link with a submit button */}
                    <button
                      type="submit"
                      className={`w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 block text-center ${
                        roomName ? "" : "pointer-events-none opacity-50"
                      }`}
                    >
                      {translations.nextStep}
                    </button>
                    {/* ===================================== */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
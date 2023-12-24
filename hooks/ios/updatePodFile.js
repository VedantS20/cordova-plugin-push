const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Function to add Notification Service Extension using xcodeproj gem

module.exports = function (context) {
  const rootdir = context.opts.projectRoot;
  const podfilePath = path.join(rootdir, "platforms", "ios", "Podfile");
  const podfileContent = fs.readFileSync(podfilePath, "utf8");

  // Check if the dependency is already added
  if (!podfileContent.includes("pod 'Firebase/Messaging'")) {
    // Add the dependency to the Podfile
    const updatedPodfile = podfileContent.replace(
      /target 'NotificationServiceExtension' do[\s\S]*?end/,
      "$&\n  pod 'Firebase/Messaging'"
    );

    // Write the updated Podfile back to the file system
    fs.writeFileSync(podfilePath, updatedPodfile, "utf8");
    console.log("Firebase/Messaging dependency added to NotificationServiceExtension target.");
  } else {
    console.log("Firebase/Messaging dependency is already present in Podfile.");
  }
};

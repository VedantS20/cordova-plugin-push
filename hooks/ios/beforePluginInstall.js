const { execSync } = require("child_process");
const path = require("path");

// Function to add Notification Service Extension using xcodeproj gem

module.exports = function (context) {
  const rootdir = context.opts.projectRoot;

  const project = path.join(rootdir, "platforms/ios/Fasal.xcodeproj");
  try {
    const rubyCode = `
    require 'xcodeproj'
    project_path = ${project}
    project = Xcodeproj::Project.open(project_path)
    puts "Project: #{project.path}"
    group = project.main_group.find_subpath('NotificationServiceExtension', true)
    group.new_reference("NotificationServiceExtension/NotificationService.h")
    assets = group.new_reference("NotificationExtension/NotificationService.m")
    target = project.new_target(:app_extension, 'NotificationServiceExtension', :ios, "11.0")
    target.add_file_references([assets])
    target.build_configuration_list.set_setting('INFOPLIST_FILE', "NotificationServiceExtension/Info.plist")
    target.build_configuration_list.set_setting('PRODUCT_BUNDLE_IDENTIFIER', "")
    target.build_configuration_list.set_setting('DEVELOPMENT_TEAM', "")
    project.save
    `;

    execSync(`ruby -e "${rubyCode}"`);
    console.log("Notification service extension added successfully.");
  } catch (error) {
    console.error("Error adding notification service extension:", error.message);
  }
};

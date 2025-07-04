"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "km";

type TranslationsType = {
  [key: string]: {
    en: string;
    km: string;
  };
};
// Add your translations here
const translations: TranslationsType = {
  // TelePass
  TelePass: {
    en: "TelePass",
    km: "តេឡេផាស",
  },
  "Or continue with": {
    en: "Or continue with",
    km: "ឬបន្តជាមួយ",
  },
  "Event Management": {
    en: "Event Management",
    km: "កម្មវិធីគ្រប់គ្រងព្រឹត្តិការណ៍",
  },
  Home: {
    en: "Home",
    km: "ទំព័រដើម",
  },
  // Account page translations
  General: {
    en: "General",
    km: "ទូទៅ",
  },
  Security: {
    en: "Security",
    km: "សុវត្ថិភាព",
  },
  "Profile Information": {
    en: "Profile Information",
    km: "ព័ត៌មានប្រវត្តិរូប",
  },
  "Update your account profile information": {
    en: "Update your account profile information",
    km: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូបគណនីរបស់អ្នក",
  },
  "Change Avatar": {
    en: "Change Avatar",
    km: "ប្តូររូបតំណាង",
  },
  "Full Name": {
    en: "Full Name",
    km: "ឈ្មោះពេញ",
  },
  "Saving...": {
    en: "Saving...",
    km: "កំពុងរក្សាទុក...",
  },
  "Save Changes": {
    en: "Save Changes",
    km: "រក្សាទុកការផ្លាស់ប្តូរ",
  },
  "Change Password": {
    en: "Change Password",
    km: "ប្តូរពាក្យសម្ងាត់",
  },
  "Update your password to keep your account secure": {
    en: "Update your password to keep your account secure",
    km: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់របស់អ្នកដើម្បីរក្សាគណនីរបស់អ្នកឱ្យមានសុវត្ថិភាព",
  },
  "Current Password": {
    en: "Current Password",
    km: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
  },
  "New Password": {
    en: "New Password",
    km: "ពាក្យសម្ងាត់ថ្មី",
  },
  "Confirm New Password": {
    en: "Confirm New Password",
    km: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
  },
  "Updating...": {
    en: "Updating...",
    km: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
  },
  "Update Password": {
    en: "Update Password",
    km: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",
  },
  "Profile updated": {
    en: "Profile updated",
    km: "ប្រវត្តិរូបបានធ្វើបច្ចុប្បន្នភាព",
  },
  "Your profile information has been updated successfully.": {
    en: "Your profile information has been updated successfully.",
    km: "ព័ត៌មានប្រវត្តិរូបរបស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
  },
  "Password updated": {
    en: "Password updated",
    km: "ពាក្យសម្ងាត់បានធ្វើបច្ចុប្បន្នភាព",
  },
  "Your password has been changed successfully.": {
    en: "Your password has been changed successfully.",
    km: "ពាក្យសម្ងាត់របស់អ្នកត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ។",
  },
  "Account Settings": {
    en: "Account Settings",
    km: "ការកំណត់គណនី",
  },
  "Manage your account settings and preferences": {
    en: "Manage your account settings and preferences",
    km: "គ្រប់គ្រងការកំណត់គណនីនិងចំណូលចិត្តរបស់អ្នក",
  },
  Administrator: {
    en: "Administrator",
    km: "អ្នកគ្រប់គ្រង",
  },
  Admin: {
    en: "Admin",
    km: "អ្នកគ្រប់គ្រង",
  },
  // 404 Not Found page translations
  "Page Not Found": {
    en: "Page Not Found",
    km: "ទំព័រមិនអាចស្វែងរកឃើញ",
  },
  "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.":
    {
      en: "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.",
      km: "សូមអភ័យទោស យើងមិនអាចស្វែងរកទំព័រដែលអ្នកកំពុងស្វែងរកឃើញទេ។ ប្រហែលជាត្រូវបានផ្លាស់ប្តូរ លុប ឬមិនមាន។",
    },
  "Go Back": {
    en: "Go Back",
    km: "ត្រឡប់ក្រោយ",
  },
  Dashboard: {
    en: "Dashboard",
    km: "ផ្ទាំងគ្រប់គ្រង",
  },
  // Login page translations
  "Login to TelePass": {
    en: "Login to TelePass",
    km: "ចូលទៅកាន់តេឡេផាស",
  },
  "Enter your email below to login to your account.": {
    en: "Enter your email below to login to your account.",
    km: "បញ្ចូលអ៊ីមែលរបស់អ្នកខាងក្រោមដើម្បីចូលទៅកាន់គណនីរបស់អ្នក។",
  },
  Username: {
    en: "Username",
    km: "ឈ្មោះគណនី",
  },
  Password: {
    en: "Password",
    km: "ពាក្យសម្ងាត់",
  },
  "Sign in": {
    en: "Sign in",
    km: "ចូលគណនី",
  },
  "Signing in...": {
    en: "Signing in...",
    km: "កំពុងចូល...",
  },
  "Login failed": {
    en: "Login failed",
    km: "ការចូលគណនីបានបរាជ័យ",
  },
  "Enter your username": {
    en: "Enter your username",
    km: "បញ្ចូលឈ្មោះគណនីរបស់អ្នក",
  },
  "Enter your email": {
    en: "Enter your email",
    km: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
  },
  "Enter your password": {
    en: "Enter your password",
    km: "បញ្ចូលពាក្យសម្ងាត់របស់អ្នក",
  },
  "Forgot password?": {
    en: "Forgot password?",
    km: "ភ្លេចពាក្យសម្ងាត់?",
  },
  "Don't have an account?": {
    en: "Don't have an account?",
    km: "មិនទាន់មានគណនីមែនទេ?",
  },
  Register: {
    en: "Register",
    km: "ចុះឈ្មោះ",
  },

  // Dashboard page
  "Event Analytics": {
    en: "Event Analytics",
    km: "ការវិភាគព្រឹត្តិការណ៍",
  },
  "Number of events and attendees over time": {
    en: "Number of events and attendees over time",
    km: "ចំនួនព្រឹត្តិការណ៍និងអ្នកចូលរួមតាមពេលវេលា",
  },
  "Event Status": {
    en: "Event Status",
    km: "ស្ថានភាពព្រឹត្តិការណ៍",
  },
  "Overview of event statuses": {
    en: "Overview of event statuses",
    km: "ទិដ្ឋភាពទូទៅនៃស្ថានភាពព្រឹត្តិការណ៍",
  },
  // Chart translations
  Trending: {
    en: "Trending",
    km: "និន្នាការ",
  },
  up: {
    en: "up",
    km: "ឡើង",
  },
  down: {
    en: "down",
    km: "ចុះ",
  },
  by: {
    en: "by",
    km: "ដោយ",
  },
  "this month": {
    en: "this month",
    km: "ខែនេះ",
  },
  January: {
    en: "January",
    km: "មករា",
  },
  February: {
    en: "February",
    km: "កុម្ភៈ",
  },
  March: {
    en: "March",
    km: "មីនា",
  },
  April: {
    en: "April",
    km: "មេសា",
  },
  May: {
    en: "May",
    km: "ឧសភា",
  },
  June: {
    en: "June",
    km: "មិថុនា",
  },
  // Stats cards
  "Total Events": {
    en: "Total Events",
    km: "ចំនួនព្រឹត្តិការណ៍សរុប",
  },
  "Ongoing Events": {
    en: "Ongoing Events",
    km: "ព្រឹត្តិការណ៍កំពុងដំណើរការ",
  },
  "Finished Events": {
    en: "Finished Events",
    km: "ព្រឹត្តិការណ៍បានបញ្ចប់",
  },
  "Total Users": {
    en: "Total Users",
    km: "អ្នកប្រើប្រាស់សរុប",
  },
  // Common UI elements
  Events: {
    en: "Events",
    km: "ព្រឹត្តិការណ៍",
  },
  Users: {
    en: "Users",
    km: "អ្នកគ្រប់គ្រង",
  },
  Audience: {
    en: "Audience",
    km: "ទស្សនិកជន",
  },
  Reports: {
    en: "Reports",
    km: "របាយការណ៍",
  },
  Settings: {
    en: "Settings",
    km: "ការកំណត់",
  },
  Active: {
    en: "Active",
    km: "សកម្ម",
  },
  Inactive: {
    en: "Inactive",
    km: "អសកម្ម",
  },
  "Log out": {
    en: "Log out",
    km: "ចាកចេញ",
  },
  Account: {
    en: "Account",
    km: "គណនី",
  },
  Event: {
    en: "Event",
    km: "ព្រឹត្តិការណ៍",
  },
  "Event List": {
    en: "Event List",
    km: "បញ្ជីព្រឹត្តិការណ៍",
  },
  Category: {
    en: "Category",
    km: "ប្រភេទ",
  },
  Capacity: {
    en: "Capacity",
    km: "ចំនួន",
  },

  "User List": {
    en: "User List",
    km: "បញ្ជីអ្នកគ្រប់គ្រង",
  },
  "Manage system users and permissions": {
    en: "Manage system users and permissions",
    km: "គ្រប់គ្រងអ្នកប្រើប្រាស់និងការគ្រប់គ្រងប្រព័ន្ធ",
  },
  "Audience List": {
    en: "Audience List",
    km: "បញ្ជីអ្នកចូលរួម",
  },
  "Manage system audience and permissions": {
    en: "Manage system audience and permissions",
    km: "គ្រប់គ្រងទស្សនិកជននិងការគ្រប់គ្រងប្រព័ន្ធ",
  },
  Report: {
    en: "Report",
    km: "របាយការណ៍",
  },
  "Report Lists": {
    en: "Report Lists",
    km: "បញ្ជីរបាយការណ៍",
  },
  // Table headers and common actions
  Name: {
    en: "Name",
    km: "ឈ្មោះ",
  },
  Email: {
    en: "Email",
    km: "អ៊ីមែល",
  },
  "Phone Number": {
    en: "Phone Number",
    km: "លេខទូរស័ព្ទ",
  },
  Status: {
    en: "Status",
    km: "ស្ថានភាព",
  },
  Role: {
    en: "Role",
    km: "តួនាទី",
  },
  Upcoming: {
    en: "Upcoming",
    km: "កំពុងមកដល់",
  },
  Ongoing: {
    en: "Ongoing",
    km: "កំពុងបន្ត",
  },
  Finished: {
    en: "Finished",
    km: "បានបញ្ចប់",
  },
  Actions: {
    en: "Actions",
    km: "សកម្មភាព",
  },
  Edit: {
    en: "Edit",
    km: "កែប្រែ",
  },
  Delete: {
    en: "Delete",
    km: "លុប",
  },
  Save: {
    en: "Save",
    km: "រក្សាទុក",
  },
  Cancel: {
    en: "Cancel",
    km: "បោះបង់",
  },
  Search: {
    en: "Search",
    km: "ស្វែងរក",
  },
  Submit: {
    en: "Submit",
    km: "បញ្ជូន",
  },
  Add: {
    en: "Add",
    km: "បន្ថែម",
  },
  View: {
    en: "View",
    km: "មើល",
  },
  // Forgot password related translations
  "Forgot Password": {
    en: "Forgot Password",
    km: "ភ្លេចពាក្យសម្ងាត់",
  },
  "Enter your email address to receive a password reset OTP": {
    en: "Enter your email address to receive a password reset OTP",
    km: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នកដើម្បីទទួលបាន OTP កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
  },
  "Enter your email address": {
    en: "Enter your email address",
    km: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក",
  },
  "Verify OTP": {
    en: "Verify OTP",
    km: "ផ្ទៀងផ្ទាត់ OTP",
  },
  "OTP Code": {
    en: "OTP Code",
    km: "កូដ OTP",
  },
  "Enter OTP sent to your email": {
    en: "Enter OTP sent to your email",
    km: "បញ្ចូល OTP ដែលបានផ្ញើទៅអ៊ីមែលរបស់អ្នក",
  },
  "Reset Password": {
    en: "Reset Password",
    km: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
  },
  "Create a new password for your account": {
    en: "Create a new password for your account",
    km: "បង្កើតពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក",
  },
  "Confirm Password": {
    en: "Confirm Password",
    km: "បញ្ជាក់ពាក្យសម្ងាត់",
  },
  "Confirm new password": {
    en: "Confirm new password",
    km: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
  },
  "Enter new password": {
    en: "Enter new password",
    km: "បញ្ចូលពាក្យសម្ងាត់ថ្មី",
  },
  "Email not found": {
    en: "Email not found",
    km: "រកមិនឃើញអ៊ីមែល",
  },
  "Failed to send reset OTP": {
    en: "Failed to send reset OTP",
    km: "បរាជ័យក្នុងការផ្ញើ OTP កំណត់ឡើងវិញ",
  },
  Success: {
    en: "Success",
    km: "ជោគជ័យ",
  },
  "Password reset OTP has been sent to your email": {
    en: "Password reset OTP has been sent to your email",
    km: "OTP កំណត់ពាក្យសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅអ៊ីមែលរបស់អ្នក",
  },
  "OTP verified successfully": {
    en: "OTP verified successfully",
    km: "OTP ត្រូវបានផ្ទៀងផ្ទាត់ដោយជោគជ័យ",
  },
  "Invalid OTP": {
    en: "Invalid OTP",
    km: "OTP មិនត្រឹមត្រូវ",
  },
  "Failed to verify OTP": {
    en: "Failed to verify OTP",
    km: "បរាជ័យក្នុងការផ្ទៀងផ្ទាត់ OTP",
  },
  "Passwords do not match": {
    en: "Passwords do not match",
    km: "ពាក្យសម្ងាត់មិនត្រូវគ្នា",
  },
  "Password reset successful. You can now log in with your new password.": {
    en: "Password reset successful. You can now log in with your new password.",
    km: "ការកំណត់ពាក្យសម្ងាត់ឡើងវិញបានជោគជ័យ។ ឥឡូវអ្នកអាចចូលគណនីជាមួយពាក្យសម្ងាត់ថ្មីរបស់អ្នក។",
  },
  "Failed to reset password": {
    en: "Failed to reset password",
    km: "បរាជ័យក្នុងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ",
  },
  Continue: {
    en: "Continue",
    km: "បន្ត",
  },
  Back: {
    en: "Back",
    km: "ត្រឡប់ក្រោយ",
  },
  "Sending...": {
    en: "Sending...",
    km: "កំពុងផ្ញើ...",
  },
  "Verifying...": {
    en: "Verifying...",
    km: "កំពុងផ្ទៀងផ្ទាត់...",
  },
  "Resetting...": {
    en: "Resetting...",
    km: "កំពុងកំណត់ឡើងវិញ...",
  },
  "Enter the OTP sent to": {
    en: "Enter the OTP sent to",
    km: "បញ្ចូល OTP ដែលបានផ្ញើទៅ",
  },
  // Event specific words
  Date: {
    en: "Date",
    km: "កាលបរិច្ឆេទ",
  },
  Time: {
    en: "Time",
    km: "ពេលវេលា",
  },
  Location: {
    en: "Location",
    km: "ទីតាំង",
  },
  Description: {
    en: "Description",
    km: "ការពិពណ៌នា",
  },
  "Check-in Status": {
    en: "Check-in Status",
    km: "ស្ថានភាពការចូលរួម",
  },
  "Checked In": {
    en: "Checked In",
    km: "បានចូលរួម",
  },
  "Not Checked": {
    en: "Not Checked",
    km: "មិនបានចូលរួម",
  },
  "QR Code": {
    en: "QR Code",
    km: "កូដ QR",
  },
  "Scan this QR code to access event details or check-in.": {
    en: "Scan this QR code to access event details or check-in.",
    km: "ស្កេនកូដ QR នេះដើម្បីចូលមើលព័ត៌មានលម្អិតនៃព្រឹត្តិការណ៍ឬចូលរួម។",
  },
  "Event Details": {
    en: "Event Details",
    km: "ព័ត៌មានលម្អិតនៃព្រឹត្តិការណ៍",
  },
  "Manage event system and permissions": {
    en: "Manage event system and permissions",
    km: "គ្រប់គ្រងប្រព័ន្ធព្រឹត្តិការណ៍និងការអនុញ្ញាត",
  },
  // Common dialog texts
  "Are you absolutely sure?": {
    en: "Are you absolutely sure?",
    km: "តើអ្នកប្រាកដហើយមែនទេ?",
  },
  "This action cannot be undone.": {
    en: "This action cannot be undone.",
    km: "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។",
  },
  Update: {
    en: "Update",
    km: "ធ្វើបច្ចុប្បន្នភាព",
  },
  "Add New": {
    en: "Add New",
    km: "បន្ថែមថ្មី",
  },
  // Error messages
  Error: {
    en: "Error",
    km: "កំហុស",
  },
  Failed: {
    en: "Failed",
    km: "បរាជ័យ",
  },
  // Event list page
  "Search events...": {
    en: "Search events...",
    km: "ស្វែងរកព្រឹត្តិការណ៍...",
  },
  "Filter by category": {
    en: "Filter by category",
    km: "ត្រងតាមប្រភេទ",
  },
  "All Categories": {
    en: "All Categories",
    km: "គ្រប់ប្រភេទទាំងអស់",
  },
  "Add Event": {
    en: "Add Event",
    km: "បន្ថែមព្រឹត្តិការណ៍",
  },
  "Open menu": {
    en: "Open menu",
    km: "បើកម៉ឺនុយ",
  },
  Full: {
    en: "Full",
    km: "ពេញ",
  },
  "QR Code for": {
    en: "QR Code for",
    km: "កូដ QR សម្រាប់",
  },
  "Event updated": {
    en: "Event updated",
    km: "បានធ្វើបច្ចុប្បន្នភាពព្រឹត្តិការណ៍",
  },
  "has been successfully updated.": {
    en: "has been successfully updated.",
    km: "ត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
  },
  "Event added": {
    en: "Event added",
    km: "បានបន្ថែមព្រឹត្តិការណ៍",
  },
  "has been successfully added to the event list.": {
    en: "has been successfully added to the event list.",
    km: "ត្រូវបានបន្ថែមដោយជោគជ័យទៅក្នុងបញ្ជីព្រឹត្តិការណ៍។",
  },
  "Event deleted": {
    en: "Event deleted",
    km: "បានលុបព្រឹត្តិការណ៍",
  },
  "has been removed from the event list.": {
    en: "has been removed from the event list.",
    km: "ត្រូវបានលុបចេញពីបញ្ជីព្រឹត្តិការណ៍។",
  },
  "Total Capacity": {
    en: "Total Capacity",
    km: "សមត្ថភាពសរុប",
  },
  "Total Registered": {
    en: "Total Registered",
    km: "ចុះឈ្មោះសរុប",
  },
  "Add New Event": {
    en: "Add New Event",
    km: "បន្ថែមព្រឹត្តិការណ៍ថ្មី",
  },
  "Update Event": {
    en: "Update Event",
    km: "ធ្វើបច្ចុប្បន្នភាពព្រឹត្តិការណ៍",
  },
  "Create a new event by filling out the form below.": {
    en: "Create a new event by filling out the form below.",
    km: "បង្កើតព្រឹត្តិការណ៍ថ្មីដោយបំពេញទម្រង់នេះ។",
  },
  "Update the event details using the form below.": {
    en: "Update the event details using the form below.",
    km: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានលម្អិតនៃព្រឹត្តិការណ៍ដោយប្រើទម្រង់ខាងក្រោម។",
  },
  // Event form fields
  "Event Name": {
    en: "Event Name",
    km: "ឈ្មោះព្រឹត្តិការណ៍",
  },
  "Start Date and Time": {
    en: "Start Date and Time",
    km: "កាលបរិច្ឆេទនិងពេលវេលាចាប់ផ្តើម",
  },
  "End Date and Time": {
    en: "End Date and Time",
    km: "កាលបរិច្ឆេទនិងពេលវេលាបញ្ចប់",
  },
  "Select category": {
    en: "Select category",
    km: "ជ្រើសរើសប្រភេទ",
  },
  "Select an event": {
    en: "Select an event",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍",
  },
  "Select role": {
    en: "Select role",
    km: "ជ្រើសរើសតួនាទី",
  },
  "Select status": {
    en: "Select status",
    km: "ជ្រើសរើសស្ថានភាព",
  },
  "Registered Attendees": {
    en: "Registered Attendees",
    km: "អ្នកចូលរួមដែលបានចុះឈ្មោះ",
  },
  Organizers: {
    en: "Organizers",
    km: "អ្នករៀបចំ",
  },
  Organizer: {
    en: "Organizer",
    km: "អ្នករៀបចំ",
  },
  "Select users for this event": {
    en: "Select users for this event",
    km: "ជ្រើសរើសអ្នកប្រើប្រាស់សម្រាប់ព្រឹត្តិការណ៍នេះ",
  },
  Next: {
    en: "Next",
    km: "បន្ទាប់",
  },
  // Form validation messages
  "Name is required": {
    en: "Name is required",
    km: "តម្រូវអោយមានឈ្មោះ",
  },
  "Start date and time is required": {
    en: "Start date and time is required",
    km: "តម្រូវអោយមានកាលបរិច្ឆេទនិងពេលវេលាចាប់ផ្តើម",
  },
  "End date and time is required": {
    en: "End date and time is required",
    km: "តម្រូវអោយមានកាលបរិច្ឆេទនិងពេលវេលាបញ្ចប់",
  },
  "End date must be after start date": {
    en: "End date must be after start date",
    km: "កាលបរិច្ឆេទបញ្ចប់ត្រូវតែក្រោយកាលបរិច្ឆេទចាប់ផ្តើម",
  },
  "Description is required": {
    en: "Description is required",
    km: "តម្រូវអោយមានការពិពណ៌នា",
  },
  "Location is required": {
    en: "Location is required",
    km: "តម្រូវអោយមានទីតាំង",
  },
  "Category is required": {
    en: "Category is required",
    km: "តម្រូវអោយមានប្រភេទ",
  },
  "Capacity is required": {
    en: "Capacity is required",
    km: "តម្រូវអោយមានសមត្ថភាព",
  },
  "Capacity must be greater than 0": {
    en: "Capacity must be greater than 0",
    km: "សមត្ថភាពត្រូវតែធំជាង 0",
  },
  "Registered Attendees is required": {
    en: "Registered Attendees is required",
    km: "តម្រូវអោយមានអ្នកចូលរួមដែលបានចុះឈ្មោះ",
  },
  "Registered attendees cannot be negative": {
    en: "Registered attendees cannot be negative",
    km: "អ្នកចូលរួមដែលបានចុះឈ្មោះមិនអាចអវិជ្ជមានបានទេ",
  },
  "Registered attendees cannot exceed capacity": {
    en: "Registered attendees cannot exceed capacity",
    km: "អ្នកចូលរួមដែលបានចុះឈ្មោះមិនអាចលើសសមត្ថភាពបានទេ",
  },
  "At least one user must be selected": {
    en: "At least one user must be selected",
    km: "យ៉ាងហោចណាស់អ្នកប្រើប្រាស់ម្នាក់ត្រូវបានជ្រើសរើស",
  },
  "Email is required": {
    en: "Email is required",
    km: "តម្រូវអោយមានអ៊ីមែល",
  },
  "Email is invalid": {
    en: "Email is invalid",
    km: "អ៊ីមែលមិនត្រឹមត្រូវ",
  },
  "Role is required": {
    en: "Role is required",
    km: "តម្រូវអោយមានតួនាទី",
  },
  "Status is required": {
    en: "Status is required",
    km: "តម្រូវអោយមានស្ថានភាព",
  },
  "Validation Error": {
    en: "Validation Error",
    km: "កំហុសឆ្គងក្នុងការផ្ទៀងផ្ទាត់",
  },
  "Please fill in all required fields correctly": {
    en: "Please fill in all required fields correctly",
    km: "សូមបំពេញគ្រប់វាលដែលត្រូវការអោយបានត្រឹមត្រូវ",
  },
  // Audience/user list page translations
  "Modify the user's information using the form below.": {
    en: "Modify the user's information using the form below.",
    km: "កែសម្រួលព័ត៌មានរបស់អ្នកប្រើប្រាស់ដោយប្រើទម្រង់ខាងក្រោម។",
  },
  "Add a new user to the system.": {
    en: "Add a new user to the system.",
    km: "បន្ថែមអ្នកប្រើប្រាស់ថ្មីទៅក្នុងប្រព័ន្ធ។",
  },
  // Report page
  "Event Selection": {
    en: "Event Selection",
    km: "ការជ្រើសរើសព្រឹត្តិការណ៍",
  },
  "Select Event": {
    en: "Select Event",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍",
  },
  "Select Finished Event": {
    en: "Select Finished Event",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍ដែលបានបញ្ចប់",
  },
  "Select a finished event": {
    en: "Select a finished event",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍ដែលបានបញ្ចប់",
  },
  Refresh: {
    en: "Refresh",
    km: "ធ្វើឱ្យថ្មី",
  },
  "Loading finished events...": {
    en: "Loading finished events...",
    km: "កំពុងផ្ទុកព្រឹត្តិការណ៍ដែលបានបញ្ចប់...",
  },
  "No finished events found": {
    en: "No finished events found",
    km: "រកមិនឃើញព្រឹត្តិការណ៍ដែលបានបញ្ចប់",
  },
  "Loading registrations...": {
    en: "Loading registrations...",
    km: "កំពុងផ្ទុកការចុះឈ្មោះ...",
  },
  "Failed to fetch finished events": {
    en: "Failed to fetch finished events",
    km: "បរាជ័យក្នុងការទាញយកព្រឹត្តិការណ៍ដែលបានបញ្ចប់",
  },
  "Failed to fetch event audiences": {
    en: "Failed to fetch event audiences",
    km: "បរាជ័យក្នុងការទាញយកទស្សនិកជនព្រឹត្តិការណ៍",
  },
  "Start Date": {
    en: "Start Date",
    km: "កាលបរិច្ឆេទចាប់ផ្តើម",
  },
  "End Date": {
    en: "End Date",
    km: "កាលបរិច្ឆេទបញ្ចប់",
  },
  Start: {
    en: "Start",
    km: "ចាប់ផ្តើម",
  },
  End: {
    en: "End",
    km: "បញ្ចប់",
  },
  "View reports for finished events and their registrations.": {
    en: "View reports for finished events and their registrations.",
    km: "មើលរបាយការណ៍សម្រាប់ព្រឹត្តិការណ៍ដែលបានបញ្ចប់ និងការចុះឈ្មោះរបស់ពួកគេ។",
  },
  "Select Event for Report": {
    en: "Select Event for Report",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍សម្រាប់របាយការណ៍",
  },
  "Choose an event to generate report": {
    en: "Choose an event to generate report",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍ដើម្បីបង្កើតរបាយការណ៍",
  },
  available: {
    en: "available",
    km: "មាន",
  },
  "Note: Only events with end dates in the past are shown here. Check browser console for debugging info.":
    {
      en: "Note: Only events with end dates in the past are shown here. Check browser console for debugging info.",
      km: "ចំណាំ៖ មានតែព្រឹត្តិការណ៍ដែលមានកាលបរិច្ឆេទបញ្ចប់ក្នុងអតីតកាលទើបត្រូវបានបង្ហាញនៅទីនេះ។ ពិនិត្យ browser console សម្រាប់ព័ត៌មានបំបាត់កំហុស។",
    },
  "Manage report data for events and registrations.": {
    en: "Manage report data for events and registrations.",
    km: "គ្រប់គ្រងទិន្នន័យរបាយការណ៍សម្រាប់ព្រឹត្តិការណ៍និងការចុះឈ្មោះ",
  },
  Registrations: {
    en: "Registrations",
    km: "ការចុះឈ្មោះ",
  },
  "Registrations Report": {
    en: "Registrations Report",
    km: "របាយការណ៍នៃការចុះឈ្មោះ",
  },
  "Registration Date": {
    en: "Registration Date",
    km: "កាលបរិច្ឆេទចុះឈ្មោះ",
  },
  "Search registrations...": {
    en: "Search registrations...",
    km: "ស្វែងរកការចុះឈ្មោះ...",
  },
  "Print Report": {
    en: "Print Report",
    km: "បោះពុម្ពរបាយការណ៍",
  },
  "Search events by name, location, or description...": {
    en: "Search events by name, location, or description...",
    km: "ស្វែងរកព្រឹត្តិការណ៍តាមឈ្មោះ ទីតាំង ឬការពិពណ៌នា...",
  },
  "events found": {
    en: "events found",
    km: "ព្រឹត្តិការណ៍ត្រូវបានរកឃើញ",
  },
  "View Report": {
    en: "View Report",
    km: "មើលរបាយការណ៍",
  },
  Showing: {
    en: "Showing",
    km: "បង្ហាញ",
  },
  to: {
    en: "to",
    km: "ដល់",
  },
  of: {
    en: "of",
    km: "នៃ",
  },
  "Back to Events": {
    en: "Back to Events",
    km: "ត្រឡប់ទៅព្រឹត្តិការណ៍",
  },
  "Note: Only events with end dates in the past are shown here.": {
    en: "Note: Only events with end dates in the past are shown here.",
    km: "ចំណាំ: មានតែព្រឹត្តិការណ៍ដែលកាលបរិច្ឆេទបញ្ចប់ធ្វើរួចទៅហើយទើបត្រូវបានបង្ហាញនៅទីនេះ។",
  },
  "User session not found": {
    en: "User session not found",
    km: "រកមិនឃើញវគ្គប្រើប្រាស់អ្នកប្រើ",
  },
  "Admin profile not found": {
    en: "Admin profile not found",
    km: "រកមិនឃើញទម្រង់អ្នកគ្រប់គ្រង",
  },
  "Only events that have ended are available for reporting. Please check back after your events have concluded.":
    {
      en: "Only events that have ended are available for reporting. Please check back after your events have concluded.",
      km: "មានតែព្រឹត្តិការណ៍ដែលបានបញ្ចប់ទើបអាចធ្វើរបាយការណ៍បាន។ សូមត្រលប់មកពិនិត្យម្តងទៀតបន្ទាប់ពីព្រឹត្តិការណ៍របស់អ្នកបានបញ្ចប់។",
    },
  "Please wait while we fetch your completed events": {
    en: "Please wait while we fetch your completed events",
    km: "សូមរង់ចាំនៅពេលយើងកំពុងទាញយកព្រឹត្តិការណ៍ដែលបានបញ្ចប់របស់អ្នក",
  },
  "Detailed registration report for this completed event": {
    en: "Detailed registration report for this completed event",
    km: "របាយការណ៍លម្អិតអំពីការចុះឈ្មោះសម្រាប់ព្រឹត្តិការណ៍ដែលបានបញ្ចប់នេះ",
  },
  "Event Information": {
    en: "Event Information",
    km: "ព័ត៌មានព្រឹត្តិការណ៍",
  },
  "Registration Statistics": {
    en: "Registration Statistics",
    km: "ស្ថិតិការចុះឈ្មោះ",
  },
  "Total Registrations": {
    en: "Total Registrations",
    km: "ការចុះឈ្មោះសរុប",
  },
  "Fill Rate": {
    en: "Fill Rate",
    km: "អត្រាពេញ",
  },
  total: {
    en: "total",
    km: "សរុប",
  },
  "Please wait while we fetch registration data": {
    en: "Please wait while we fetch registration data",
    km: "សូមរង់ចាំនៅពេលយើងកំពុងទាញយកទិន្នន័យការចុះឈ្មោះ",
  },
  "No matching registrations": {
    en: "No matching registrations",
    km: "រកមិនឃើញការចុះឈ្មោះដែលត្រូវគ្នា",
  },
  "No registrations found": {
    en: "No registrations found",
    km: "រកមិនឃើញការចុះឈ្មោះ",
  },
  "Try adjusting your search terms to find what you're looking for": {
    en: "Try adjusting your search terms to find what you're looking for",
    km: "សាកល្បងកែសម្រួលពាក្យស្វែងរករបស់អ្នកដើម្បីរកអ្វីដែលអ្នកកំពុងស្វែងរក",
  },
  "This event has no registrations yet": {
    en: "This event has no registrations yet",
    km: "ព្រឹត្តិការណ៍នេះមិនទាន់មានការចុះឈ្មោះនៅឡើយទេ",
  },
  "Clear search": {
    en: "Clear search",
    km: "សម្អាតការស្វែងរក",
  },
  "Registration Report": {
    en: "Registration Report",
    km: "របាយការណ៍ការចុះឈ្មោះ",
  },
  "Detailed registration report for this event": {
    en: "Detailed registration report for this event",
    km: "របាយការណ៍លម្អិតនៃការចុះឈ្មោះសម្រាប់ព្រឹត្តិការណ៍នេះ",
  },
  "All Events": {
    en: "All Events",
    km: "ព្រឹត្តិការណ៍ទាំងអស់",
  },
  Statistics: {
    en: "Statistics",
    km: "ស្ថិតិ",
  },
  Unknown: {
    en: "Unknown",
    km: "មិនស្គាល់",
  },
  Registered: {
    en: "Registered",
    km: "បានចុះឈ្មោះ",
  },
  "Generated on": {
    en: "Generated on",
    km: "បង្កើតនៅថ្ងៃ",
  },
  "Event Report": {
    en: "Event Report",
    km: "របាយការណ៍ព្រឹត្តិការណ៍",
  },
  "Start Date & Time": {
    en: "Start Date & Time",
    km: "កាលបរិច្ឆេទ និងម៉ោងចាប់ផ្តើម",
  },
  "End Date & Time": {
    en: "End Date & Time",
    km: "កាលបរិច្ឆេទ និងម៉ោងបញ្ចប់",
  },
  Venue: {
    en: "Venue",
    km: "កន្លែងធ្វើព្រឹត្តិការណ៍",
  },
  "Registration Summary": {
    en: "Registration Summary",
    km: "សង្ខេបការចុះឈ្មោះ",
  },
  "Available Spots": {
    en: "Available Spots",
    km: "កន្លែងនៅសល់",
  },
  "Occupancy Rate": {
    en: "Occupancy Rate",
    km: "អត្រាការបំពេញ",
  },
  "Loading events...": {
    en: "Loading events...",
    km: "កំពុងផ្ទុកព្រឹត្តិការណ៍...",
  },
  "Please wait while we fetch your events": {
    en: "Please wait while we fetch your events",
    km: "សូមរង់ចាំនៅពេលយើងកំពុងទាញយកព្រឹត្តិការណ៍របស់អ្នក",
  },
  "No events found": {
    en: "No events found",
    km: "រកមិនឃើញព្រឹត្តិការណ៍",
  },
  "You haven't created any events yet. Create your first event to get started with reporting.":
    {
      en: "You haven't created any events yet. Create your first event to get started with reporting.",
      km: "អ្នកមិនទាន់បានបង្កើតព្រឹត្តិការណ៍ណាមួយនៅឡើយទេ។ បង្កើតព្រឹត្តិការណ៍ដំបូងរបស់អ្នកដើម្បីចាប់ផ្តើមធ្វើរបាយការណ៍។",
    },
  "Failed to fetch events": {
    en: "Failed to fetch events",
    km: "បរាជ័យក្នុងការទាញយកព្រឹត្តិការណ៍",
  },
  "Export to Excel": {
    en: "Export to Excel",
    km: "នាំចេញទៅ Excel",
  },
  "No registrations found.": {
    en: "No registrations found.",
    km: "រកមិនឃើញការចុះឈ្មោះទេ។",
  },
  Phone: {
    en: "Phone",
    km: "ទូរស័ព្ទ",
  },
  // Audience/user list page translations  "Add User": {
  "Add User": {
    en: "Add User",
    km: "បន្ថែមអ្នកប្រើប្រាស់",
  },
  "Update User": {
    en: "Update User",
    km: "ធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់",
  },
  "User added": {
    en: "User added",
    km: "បានបន្ថែមអ្នកប្រើប្រាស់",
  },
  "has been added to the system.": {
    en: "has been added to the system.",
    km: "ត្រូវបានបន្ថែមទៅក្នុងប្រព័ន្ធ។",
  },
  "User updated": {
    en: "User updated",
    km: "បានធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់",
  },
  "'s information has been updated.": {
    en: "'s information has been updated.",
    km: " ព័ត៌មានត្រូវបានធ្វើបច្ចុប្បន្នភាព។",
  },
  "User deleted": {
    en: "User deleted",
    km: "បានលុបអ្នកប្រើប្រាស់",
  },
  "has been removed from the system.": {
    en: "has been removed from the system.",
    km: "ត្រូវបានលុបចេញពីប្រព័ន្ធ។",
  },
  "Error fetching users": {
    en: "Error fetching users",
    km: "កំហុសក្នុងការទាញយកព័ត៌មានអ្នកប្រើប្រាស់",
  },
  "Failed to load user data. Please try again later.": {
    en: "Failed to load user data. Please try again later.",
    km: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យអ្នកប្រើប្រាស់។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
  },
  "Error updating user": {
    en: "Error updating user",
    km: "កំហុសក្នុងការធ្វើបច្ចុប្បន្នភាពអ្នកប្រើប្រាស់",
  },
  "Failed to update user information.": {
    en: "Failed to update user information.",
    km: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពព័ត៌មានអ្នកប្រើប្រាស់។",
  },
  "Error adding user": {
    en: "Error adding user",
    km: "កំហុសក្នុងការបន្ថែមអ្នកប្រើប្រាស់",
  },
  "Failed to add new user.": {
    en: "Failed to add new user.",
    km: "បរាជ័យក្នុងការបន្ថែមអ្នកប្រើប្រាស់ថ្មី។",
  },
  "Error deleting user": {
    en: "Error deleting user",
    km: "កំហុសក្នុងការលុបអ្នកប្រើប្រាស់",
  },
  "Failed to delete user.": {
    en: "Failed to delete user.",
    km: "បរាជ័យក្នុងការលុបអ្នកប្រើប្រាស់។",
  },
  "This action cannot be undone. This will permanently delete the user and remove their data from our servers.":
    {
      en: "This action cannot be undone. This will permanently delete the user and remove their data from our servers.",
      km: "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ វានឹងលុបអ្នកប្រើប្រាស់ជាអចិន្ត្រៃយ៍ និងយកទិន្នន័យរបស់ពួកគេចេញពីម៉ាស៊ីនមេរបស់យើង។",
    },
  "Loading...": {
    en: "Loading...",
    km: "កំពុងផ្ទុក...",
  },
  "Search...": {
    en: "Search...",
    km: "ស្វែងរក...",
  },
  Occupation: {
    en: "Occupation",
    km: "មុខរបរ",
  },
  Gender: {
    en: "Gender",
    km: "ភេទ",
  },
  MALE: {
    en: "MALE",
    km: "ប្រុស",
  },
  FEMALE: {
    en: "FEMALE",
    km: "ស្រី",
  },
  OTHER: {
    en: "OTHER",
    km: "ផ្សេងទៀត",
  },
  // Registration page
  "Create Your TelePass Account": {
    en: "Create Your TelePass Account",
    km: "បង្កើតគណនីតេឡេផាសរបស់អ្នក",
  },
  "Already have an account?": {
    en: "Already have an account?",
    km: "មានគណនីរួចហើយ?",
  },
  "Drag & drop or click to select an image": {
    en: "Drag & drop or click to select an image",
    km: "ទាញដាក់ឬចុចដើម្បីជ្រើសរើសរូបភាព",
  },
  "PNG, JPG, GIF up to 2MB": {
    en: "PNG, JPG, GIF up to 2MB",
    km: "PNG, JPG, GIF រហូតដល់ 2MB",
  },
  "Profile Image": {
    en: "Profile Image",
    km: "រូបភាពប្រវត្តិរូប",
  },
  "Create a password": {
    en: "Create a password",
    km: "បង្កើតពាក្យសម្ងាត់",
  },
  "Registering...": {
    en: "Registering...",
    km: "កំពុងចុះឈ្មោះ...",
  },
  "Account verified! You can now log in.": {
    en: "Account verified! You can now log in.",
    km: "គណនីត្រូវបានផ្ទៀងផ្ទាត់! ឥឡូវអ្នកអាចចូលបាន។",
  },
  "Invalid OTP. Please try again.": {
    en: "Invalid OTP. Please try again.",
    km: "OTP មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។",
  },
  "OTP verification failed.": {
    en: "OTP verification failed.",
    km: "ការផ្ទៀងផ្ទាត់ OTP បានបរាជ័យ។",
  },
  "Invalid username or password or account not yet verified!": {
    en: "Invalid username or password or account not yet verified!",
    km: "ឈ្មោះអ្នកប្រើឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឬគណនីមិនទាន់បានផ្ទៀងផ្ទាត់ទេ!",
  },
  "An error occurred during sign in": {
    en: "An error occurred during sign in",
    km: "មានកំហុសកើតឡើងពេលកំពុងចូល",
  },
  "Registration failed": {
    en: "Registration failed",
    km: "ការចុះឈ្មោះបានបរាជ័យ",
  },
  "Registration error": {
    en: "Registration error",
    km: "កំហុសក្នុងការចុះឈ្មោះ",
  },
  "Image upload failed": {
    en: "Image upload failed",
    km: "ការបញ្ចូលរូបភាពបានបរាជ័យ",
  },

  // ...existing code...
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with default values to avoid the error during initial render
const defaultValues: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultValues);

// Add this function to set document-level font settings
const setDocumentLanguageSettings = (lang: Language) => {
  // Set HTML lang attribute
  document.documentElement.setAttribute("lang", lang);

  // Set body class for font styling
  if (lang === "km") {
    document.body.classList.add("font-khmer");
    document.body.classList.remove("font-english");
  } else {
    document.body.classList.add("font-english");
    document.body.classList.remove("font-khmer");
  }
};

export function LanguageProvider({children}: {children: ReactNode}) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    try {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "km")) {
        setLanguage(savedLanguage);
        setDocumentLanguageSettings(savedLanguage);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    setMounted(true);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setDocumentLanguageSettings(newLanguage);
    try {
      localStorage.setItem("language", newLanguage);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Fallback to the key if translation not found
    return key;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}

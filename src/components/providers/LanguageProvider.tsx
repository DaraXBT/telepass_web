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
  Password: {
    en: "Password",
    km: "ពាក្យសម្ងាត់",
  },
  "Sign in": {
    en: "Sign in",
    km: "ចូល",
  },
  "Login failed": {
    en: "Login failed",
    km: "ការចូលគណនីបានបរាជ័យ",
  },
  "Enter your email": {
    en: "Enter your email",
    km: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
  },
  "Enter your password": {
    en: "Enter your password",
    km: "បញ្ចូលពាក្យសម្ងាត់របស់អ្នក",
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
  Success: {
    en: "Success",
    km: "ជោគជ័យ",
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
  "Registered Attendees": {
    en: "Registered Attendees",
    km: "អ្នកចូលរួមដែលបានចុះឈ្មោះ",
  },
  Organizers: {
    en: "Organizers",
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
  Back: {
    en: "Back",
    km: "ត្រឡប់ក្រោយ",
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
  // Report page
  "Event Selection": {
    en: "Event Selection",
    km: "ការជ្រើសរើសព្រឹត្តិការណ៍",
  },
  "Select Event": {
    en: "Select Event",
    km: "ជ្រើសរើសព្រឹត្តិការណ៍",
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
  // Audience/user list page translations
  "Add User": {
    en: "Add User",
    km: "បន្ថែមអ្នកប្រើប្រាស់",
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

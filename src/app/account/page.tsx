"use client";

import {useState} from "react";
import MenuNav from "@/components/nav-menu";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Key,
  Languages,
  MapPin,
  Calendar,
} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {toast} from "@/hooks/use-toast";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function AccountPage() {
  const {t} = useLanguage();
  const [isPending, setIsPending] = useState<boolean>(false);

  // Mock user data - In a real app, this would come from an API/context
  const [userData, setUserData] = useState({
    name: "Dara Chan",
    email: "dara.chan@example.com",
    phone: "+855 12 345 678",
    avatar: "https://github.com/shadcn.png",
    role: "Administrator",
    bio: "Software engineer with a passion for building amazing user experiences. Working at TelePass to streamline event management.",
    address: "Phnom Penh, Cambodia",
    joinedDate: "February 2023",
    language: "en",
    timezone: "Asia/Phnom_Penh",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      toast({
        title: t("Profile updated"),
        description: t(
          "Your profile information has been updated successfully."
        ),
      });
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      toast({
        title: t("Password updated"),
        description: t("Your password has been changed successfully."),
      });

      // Clear form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Account")} />
      </header>
      <Separator />
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Account Settings")}
            </h1>
            <p className="text-muted-foreground">
              {t("Manage your account settings and preferences")}
            </p>
          </div>
          <Badge
            variant="outline"
            className="mt-2 md:mt-0 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {userData.role}
          </Badge>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="mb-8 w-full max-w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
                <User className="mr-2 h-4 w-4" />
                {t("General")}
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
                <Key className="mr-2 h-4 w-4" />
                {t("Security")}
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
                <Bell className="mr-2 h-4 w-4" />
                {t("Notifications")}
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary">
                <Languages className="mr-2 h-4 w-4" />
                {t("Preferences")}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("Profile Information")}</CardTitle>
                  <CardDescription>
                    {t("Update your account profile information")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col items-center space-y-3 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <AvatarFallback>
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <Button type="button" variant="outline" size="sm">
                        {t("Change Avatar")}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name">{t("Full Name")}</Label>
                        <Input
                          id="name"
                          defaultValue={userData.name}
                          className="w-full"
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="email">{t("Email")}</Label>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            defaultValue={userData.email}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="phone">{t("Phone")}</Label>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            defaultValue={userData.phone}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="bio">{t("Bio")}</Label>
                        <Textarea
                          id="bio"
                          defaultValue={userData.bio}
                          className="min-h-32"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? t("Saving...") : t("Save Changes")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Account Information")}</CardTitle>
                    <CardDescription>
                      {t("View information about your account")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t("Role")}
                          </span>
                        </div>
                        <span className="font-medium">{userData.role}</span>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t("Member Since")}
                          </span>
                        </div>
                        <span className="font-medium">
                          {userData.joinedDate}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t("Location")}
                          </span>
                        </div>
                        <span className="font-medium">{userData.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Connected Services")}</CardTitle>
                    <CardDescription>
                      {t("Manage connections to external services")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v12"></path>
                            <path d="M6 12h12"></path>
                          </svg>
                          <span className="font-medium">Google</span>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("Connect")}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                          <span className="font-medium">LinkedIn</span>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("Connect")}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
                          </svg>
                          <span className="font-medium">Twitter</span>
                        </div>
                        <Button variant="outline" size="sm">
                          {t("Connect")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Change Password")}</CardTitle>
                  <CardDescription>
                    {t("Update your password to keep your account secure")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <Label htmlFor="current-password">
                          {t("Current Password")}
                        </Label>
                        <Input id="current-password" type="password" required />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="new-password">
                          {t("New Password")}
                        </Label>
                        <Input id="new-password" type="password" required />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="confirm-password">
                          {t("Confirm New Password")}
                        </Label>
                        <Input id="confirm-password" type="password" required />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? t("Updating...") : t("Update Password")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Two-Factor Authentication")}</CardTitle>
                  <CardDescription>
                    {t("Add an extra layer of security to your account")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("Authenticator App")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Use an authenticator app to generate one-time codes"
                        )}
                      </p>
                    </div>
                    <Button variant="outline">{t("Setup")}</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("SMS Recovery")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("Use your phone number as a backup method")}
                      </p>
                    </div>
                    <Button variant="outline">{t("Setup")}</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("Recovery Codes")}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Generate one-time recovery codes to use if you lose access"
                        )}
                      </p>
                    </div>
                    <Button variant="outline">{t("Generate")}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("Account Sessions")}</CardTitle>
                  <CardDescription>
                    {t("Manage your active sessions across devices")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{t("Current Session")}</h4>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Windows · Chrome · Phnom Penh, Cambodia
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("Started")} {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{t("Current")}</Badge>
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{t("Mobile Session")}</h4>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-muted-foreground">
                            iOS · Safari · Phnom Penh, Cambodia
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("Started")} May 10, 2025, 9:45 AM
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t("Revoke")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive">
                    {t("Sign out from all devices")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("Notification Preferences")}</CardTitle>
                <CardDescription>
                  {t("Customize how you receive notifications")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      {t("Email Notifications")}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-event-updates">
                            {t("Event Updates")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              "Receive updates about events you are managing or attending"
                            )}
                          </p>
                        </div>
                        <Switch id="email-event-updates" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-ticket-sales">
                            {t("Ticket Sales")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              "Get notified when tickets are sold for your events"
                            )}
                          </p>
                        </div>
                        <Switch id="email-ticket-sales" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">
                            {t("Marketing & Newsletter")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              "Receive product updates and marketing communications"
                            )}
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      {t("Push Notifications")}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-event-reminders">
                            {t("Event Reminders")}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {t("Get reminded about upcoming events")}
                          </p>
                        </div>
                        <Switch id="push-event-reminders" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-messages">{t("Messages")}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t(
                              "Receive notifications when someone messages you"
                            )}
                          </p>
                        </div>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">{t("Save Preferences")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{t("Display & Language")}</CardTitle>
                <CardDescription>
                  {t("Customize your experience on TelePass")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="language">{t("Language")}</Label>
                    <Select defaultValue={userData.language}>
                      <SelectTrigger
                        id="language"
                        className="w-full md:w-[250px]">
                        <SelectValue placeholder={t("Select a language")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="km">ភាសាខ្មែរ (Khmer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timezone">{t("Time Zone")}</Label>
                    <Select defaultValue={userData.timezone}>
                      <SelectTrigger
                        id="timezone"
                        className="w-full md:w-[250px]">
                        <SelectValue placeholder={t("Select a time zone")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Phnom_Penh">
                          (GMT+07:00) Phnom Penh
                        </SelectItem>
                        <SelectItem value="UTC">(GMT+00:00) UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          (GMT-05:00) New York
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          (GMT+09:00) Tokyo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="date-format">{t("Date Format")}</Label>
                    <Select defaultValue="MM/DD/YYYY">
                      <SelectTrigger
                        id="date-format"
                        className="w-full md:w-[250px]">
                        <SelectValue placeholder={t("Select a date format")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">{t("Reset to Defaults")}</Button>
                <Button>{t("Save Preferences")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

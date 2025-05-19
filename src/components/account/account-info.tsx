"use client";

import {useState} from "react";
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

export default function Account() {
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
      <Tabs defaultValue="general" className="w-full">
        {" "}
        <ScrollArea className="w-full">
          <TabsList className="mb-8 w-full justify-start rounded-none border-b bg-transparent p-0">
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
          </TabsList>
        </ScrollArea>{" "}
        {/* General Tab */}{" "}
        <TabsContent value="general" className="w-full">
          <div className="grid gap-6 w-full">
            {/* Profile Information with Role information */}
            <Card className="w-full">
              {" "}
              <CardHeader>
                {" "}
                <div className="flex items-center justify-between">
                  <CardTitle>{t("Profile Information")}</CardTitle>{" "}
                  <Badge
                    className="text-sm px-3 py-1 font-medium bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-gradient-x text-white rounded-md"
                    variant="default">
                    <Shield className="mr-1.5 h-4 w-4" /> {t(userData.role)}
                  </Badge>
                </div>
                <CardDescription>
                  {t("Update your account profile information")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-4">
                    {" "}
                    <div className="grid gap-3">
                      <Label htmlFor="name">{t("Full Name")}</Label>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          defaultValue={userData.name}
                          className="w-full"
                        />
                      </div>
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
                    </div>{" "}
                    {/* Removed Role section as it's now displayed as a badge near the avatar */}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("Saving...") : t("Save Changes")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>{" "}
        {/* Security Tab */}{" "}
        <TabsContent value="security" className="w-full">
          <div className="grid gap-6 w-full">
            <Card className="w-full">
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
                      <Label htmlFor="new-password">{t("New Password")}</Label>
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
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

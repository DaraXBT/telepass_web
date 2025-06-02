"use client";
import {API_URL} from "@/api/inteceptor";
import OtpModal from "@/components/Modal/OtpModal";
import {StarBackground} from "@/components/ui/star-background";
import {
  registerUser,
  validateOtpToVerifiedRegister,
} from "@/services/authservice.service";
import {useLanguage} from "@/components/providers/LanguageProvider";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const router = useRouter();
  const {t} = useLanguage();
  const {toast} = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setProfile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Instant preview
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {"image/*": []},
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profileUrl = "";
    if (profile) {
      const formData = new FormData();
      formData.append("image", profile);
      try {
        const response = await axios.post(
          `${API_URL}/api/v1/images/file`,
          formData,
          {
            headers: {"Content-Type": "multipart/form-data"},
          }
        );
        profileUrl = `${API_URL}/api/v1/images/getImage?fileName=${response.data.payload}`;
      } catch (err) {
        toast({
          title: t("Error"),
          description: t("Image upload failed"),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    } else {
      profileUrl =
        "https://img.freepik.com/premium-vector/3d-character-businessman-working-laptop-computer_595064-185.jpg";
    }

    try {
      const res = await registerUser({
        username,
        password,
        email,
        profile: profileUrl,
      });

      if (res.status === 200) {
        setShowOtpModal(true); // Show OTP modal
      } else {
        toast({
          title: t("Error"),
          description: t("Registration failed"),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: t("Error"),
        description: t("Registration error"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setOtpLoading(true);
    try {
      const res: any = await validateOtpToVerifiedRegister(email, otp);
      if (res.status === 200) {
        toast({
          title: t("Success"),
          description: t("Account verified! You can now log in."),
        });
        setShowOtpModal(false);
        router.push("/");
      } else {
        toast({
          title: t("Error"),
          description: t("Invalid OTP. Please try again."),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: t("Error"),
        description: t("OTP verification failed."),
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden">
        <div className="relative w-full">
          {/* Star Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <StarBackground
              count={25}
              minSize={0.4}
              maxSize={0.8}
              opacity="opacity-60"
              color="text-primary/40"
            />
          </div>

          <div className="flex flex-col items-center w-full max-w-md gap-6 relative z-10">
            {/* Logo and Title */}
            <div className="flex flex-col items-center w-full">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary flex items-center justify-center bg-border">
                <Image
                  src="/assets/images/logo.jpg"
                  width={70}
                  height={70}
                  alt="TelePass Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-semibold">
                {t("Create Your TelePass Account")}
              </h1>
            </div>

            {/* Registration Card */}
            <Card className="w-full backdrop-blur-sm bg-card/80 border border-border/70 shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t("Username")}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={t("Enter your username")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("Email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t("Enter your email")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("Password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t("Create a password")}
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profile">{t("Profile Image")}</Label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-background/60 hover:bg-background/80 transition-all ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}>
                      <input {...getInputProps()} id="profile" />{" "}
                      {previewUrl ? (
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={140}
                            height={140}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground">
                            {t("Drag & drop or click to select an image")}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {t("PNG, JPG, GIF up to 2MB")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2 bg-primary hover:bg-primary/90 transition-all"
                    disabled={loading}>
                    {loading ? t("Registering...") : t("Register")}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    {t("Already have an account?")}{" "}
                    <a href="/" className="text-primary hover:underline">
                      {t("Sign in")}
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        email={email}
        loading={otpLoading}
      />
    </>
  );
};

export default RegisterForm;

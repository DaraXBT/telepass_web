"use client";

import Account from "@/components/account/account-info";
import MenuNav from "@/components/nav-menu";
import {Separator} from "@/components/ui/separator";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function AccountPage() {
  const {t} = useLanguage();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("Account")} />
      </header>
      <Separator />
      <div className="p-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Account Settings")}
            </h1>
            <p className="text-muted-foreground">
              {t("Manage your account settings and preferences")}
            </p>
          </div>
        </div>

        <div className="w-full">
          <Account />
        </div>
      </div>
    </>
  );
}

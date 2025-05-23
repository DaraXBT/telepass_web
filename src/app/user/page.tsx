"use client";

import MenuNav from "@/components/nav-menu";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {UserList} from "@/components/user/user-list";
import {useLanguage} from "@/components/providers/LanguageProvider";

export default function UsersPage() {
  const {t} = useLanguage();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <MenuNav props={t("User List")} />
      </header>
      <Separator />
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("User List")}
            </h1>
            <p className="text-muted-foreground">
              {t("Manage system users and permissions")}
            </p>
          </div>
        </div>
        <UserList />
      </div>
    </>
  );
}
